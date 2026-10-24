/**
 * Safe arithmetic evaluator for model-written expressions.
 *
 * Never pass model output to eval() or Function(): a prompt-injected expression
 * like `process.exit()` would run on the server. This parser only understands
 * numbers, + - * / % ^ (or **), parentheses, and an allowlist of Math functions
 * and constants, so there is nothing else it can execute.
 */

const MAX_LENGTH = 500;
const MAX_DEPTH = 50;

type Fn = { fn: (...args: number[]) => number; arity: number | "variadic" };

const FUNCTIONS: Record<string, Fn> = Object.assign(Object.create(null), {
  sqrt: { fn: Math.sqrt, arity: 1 },
  cbrt: { fn: Math.cbrt, arity: 1 },
  abs: { fn: Math.abs, arity: 1 },
  round: { fn: Math.round, arity: 1 },
  floor: { fn: Math.floor, arity: 1 },
  ceil: { fn: Math.ceil, arity: 1 },
  trunc: { fn: Math.trunc, arity: 1 },
  sign: { fn: Math.sign, arity: 1 },
  exp: { fn: Math.exp, arity: 1 },
  log: { fn: Math.log, arity: 1 },
  ln: { fn: Math.log, arity: 1 },
  log10: { fn: Math.log10, arity: 1 },
  log2: { fn: Math.log2, arity: 1 },
  sin: { fn: Math.sin, arity: 1 },
  cos: { fn: Math.cos, arity: 1 },
  tan: { fn: Math.tan, arity: 1 },
  asin: { fn: Math.asin, arity: 1 },
  acos: { fn: Math.acos, arity: 1 },
  atan: { fn: Math.atan, arity: 1 },
  atan2: { fn: Math.atan2, arity: 2 },
  pow: { fn: Math.pow, arity: 2 },
  min: { fn: Math.min, arity: "variadic" },
  max: { fn: Math.max, arity: "variadic" },
  hypot: { fn: Math.hypot, arity: "variadic" },
});

const CONSTANTS: Record<string, number> = Object.assign(Object.create(null), {
  pi: Math.PI,
  e: Math.E,
});

type Token =
  | { type: "number"; value: number }
  | { type: "name"; value: string }
  | { type: "op"; value: string };

function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  const pattern = /\s*(?:(\d+\.?\d*(?:[eE][+-]?\d+)?|\.\d+(?:[eE][+-]?\d+)?)|((?:Math\.)?[A-Za-z_][A-Za-z0-9_]*)|(\*\*|[+\-*/%^(),]))/y;
  let index = 0;
  while (index < input.length) {
    if (/^\s*$/.test(input.slice(index))) break;
    pattern.lastIndex = index;
    const match = pattern.exec(input);
    if (!match) throw new Error(`Unexpected character at position ${index + 1}`);
    if (match[1] !== undefined) tokens.push({ type: "number", value: Number(match[1]) });
    else if (match[2] !== undefined) tokens.push({ type: "name", value: match[2].replace(/^Math\./, "").toLowerCase() });
    else tokens.push({ type: "op", value: match[3] === "**" ? "^" : match[3] });
    index = pattern.lastIndex;
  }
  return tokens;
}

export function evaluateExpression(expression: string): number {
  if (expression.length > MAX_LENGTH) throw new Error(`Expression is too long (max ${MAX_LENGTH} characters)`);
  const tokens = tokenize(expression);
  let position = 0;
  let depth = 0;

  const peek = () => tokens[position];
  const isOp = (value: string) => peek()?.type === "op" && peek()?.value === value;
  const expectOp = (value: string) => {
    if (!isOp(value)) throw new Error(`Expected "${value}"`);
    position++;
  };

  function parseExpression(): number {
    if (++depth > MAX_DEPTH) throw new Error("Expression is nested too deeply");
    let value = parseTerm();
    while (isOp("+") || isOp("-")) {
      const op = tokens[position++].value;
      const right = parseTerm();
      value = op === "+" ? value + right : value - right;
    }
    depth--;
    return value;
  }

  function parseTerm(): number {
    let value = parsePower();
    while (isOp("*") || isOp("/") || isOp("%")) {
      const op = tokens[position++].value;
      const right = parsePower();
      value = op === "*" ? value * right : op === "/" ? value / right : value % right;
    }
    return value;
  }

  // Exponentiation is right-associative: 2^3^2 = 2^9.
  function parsePower(): number {
    const base = parseUnary();
    if (isOp("^")) {
      position++;
      return Math.pow(base, parsePower());
    }
    return base;
  }

  function parseUnary(): number {
    if (isOp("-")) {
      position++;
      return -parseUnary();
    }
    if (isOp("+")) {
      position++;
      return parseUnary();
    }
    return parsePrimary();
  }

  function parsePrimary(): number {
    const token = peek();
    if (!token) throw new Error("Unexpected end of expression");

    if (token.type === "number") {
      position++;
      return token.value;
    }

    if (token.type === "name") {
      position++;
      if (isOp("(")) {
        const fn = FUNCTIONS[token.value];
        if (!fn) throw new Error(`Unknown function "${token.value}"`);
        position++;
        const args: number[] = [];
        if (!isOp(")")) {
          args.push(parseExpression());
          while (isOp(",")) {
            position++;
            args.push(parseExpression());
          }
        }
        expectOp(")");
        if (fn.arity !== "variadic" && args.length !== fn.arity) {
          throw new Error(`${token.value}() takes ${fn.arity} argument(s)`);
        }
        if (fn.arity === "variadic" && args.length === 0) {
          throw new Error(`${token.value}() needs at least one argument`);
        }
        return fn.fn(...args);
      }
      const constant = CONSTANTS[token.value];
      if (constant === undefined) throw new Error(`Unknown name "${token.value}"`);
      return constant;
    }

    if (isOp("(")) {
      position++;
      const value = parseExpression();
      expectOp(")");
      return value;
    }

    throw new Error(`Unexpected "${token.value}"`);
  }

  const result = parseExpression();
  if (position < tokens.length) throw new Error(`Unexpected "${tokens[position].value}"`);
  if (!Number.isFinite(result)) throw new Error("Result is not a finite number");
  return result;
}
