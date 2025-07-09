import { openai } from "@ai-sdk/openai";
import { streamText, tool } from "ai";
import { z } from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai("gpt-4o"),
    messages,
    system: `You are an advanced problem-solving AI agent with expertise in:
    • Mathematical analysis and calculations
    • Step-by-step reasoning and problem decomposition
    • Business and financial analysis
    • Logic puzzles and complex reasoning
    • Research and data analysis

    When solving problems:
    1. Break down complex problems into manageable steps
    2. Use the calculate tool for mathematical operations
    3. Use the problemSolver tool to structure your analysis
    4. Provide clear reasoning for each step
    5. Give comprehensive final answers

    Always think step by step and use tools when appropriate.`,
    tools: {
      calculate: tool({
        description: "A tool for evaluating mathematical expressions. Use this for any calculations. Example expressions: '1.2 * (2 + 4.5)', '12.7 * 2.54', 'Math.pow(1.07, 5)', 'Math.sqrt(144)'.",
        parameters: z.object({
          expression: z.string().describe("The mathematical expression to evaluate"),
        }),
        execute: async ({ expression }) => {
          try {
            // Enhanced math evaluation with Math functions
            const safeExpression = expression.replace(/[^0-9+\-*/().,\sMath\w]/g, '');
            const result = Function(`"use strict"; return (${safeExpression})`)();
            return {
              expression: expression,
              result: result,
              formatted: typeof result === 'number' ? result.toLocaleString() : result
            };
          } catch (error) {
            return {
              expression: expression,
              error: "Invalid mathematical expression",
              suggestion: "Try using standard mathematical operators (+, -, *, /) and Math functions like Math.pow(), Math.sqrt(), etc."
            };
          }
        },
      }),
      problemSolver: tool({
        description: "A tool for structured problem-solving and analysis. Use this to break down complex problems into logical steps and provide comprehensive analysis.",
        parameters: z.object({
          problemType: z.enum(['mathematical', 'business', 'logical', 'research', 'analytical']).describe("The type of problem being solved"),
          problem: z.string().describe("The problem or question to analyze"),
          steps: z.array(z.object({
            stepNumber: z.number().describe("The step number"),
            title: z.string().describe("Brief title for this step"),
            description: z.string().describe("Detailed description of what's being done in this step"),
            reasoning: z.string().describe("The reasoning or methodology for this step"),
            calculation: z.string().optional().describe("Any calculations performed in this step"),
            result: z.string().describe("The result or conclusion of this step"),
          })).describe("Array of problem-solving steps"),
          finalAnswer: z.string().describe("The comprehensive final answer"),
          confidence: z.number().min(0).max(100).describe("Confidence level in the solution (0-100)"),
          assumptions: z.array(z.string()).optional().describe("Any assumptions made during the solution"),
        }),
        execute: async ({ problemType, problem, steps, finalAnswer, confidence, assumptions }) => {
          return {
            problemType,
            problem,
            totalSteps: steps.length,
            steps,
            finalAnswer,
            confidence,
            assumptions: assumptions || [],
            timestamp: new Date().toISOString(),
            summary: `Solved ${problemType} problem in ${steps.length} steps with ${confidence}% confidence`
          };
        },
      }),
      researchAssistant: tool({
        description: "A tool for research and information analysis tasks.",
        parameters: z.object({
          topic: z.string().describe("The research topic or question"),
          approach: z.string().describe("The research approach or methodology"),
          keyPoints: z.array(z.string()).describe("Key points or findings"),
          conclusion: z.string().describe("Research conclusion or summary"),
        }),
        execute: async ({ topic, approach, keyPoints, conclusion }) => {
          return {
            topic,
            approach,
            keyPoints,
            conclusion,
            timestamp: new Date().toISOString(),
          };
        },
      }),
    },
  });

  return result.toDataStreamResponse();
}
