# AI Chatbot

A modern, feature-rich AI chatbot application built with Next.js, TypeScript, and OpenAI's GPT-4. The application features a dual-mode interface with a general chat assistant and an advanced problem solver.

## Features

### 🤖 General Chat Assistant

- Interactive chat interface with OpenAI GPT-4
- Weather checking capabilities
- Temperature conversion (Fahrenheit ↔ Celsius)
- Real-time streaming responses
- Dark-themed UI with smooth animations

### 🧠 Advanced Problem Solver

- Step-by-step mathematical problem solving
- Business and financial analysis
- Logic puzzle solving
- Research assistance
- Structured problem breakdown with:
  - Mathematical expression evaluation
  - Multi-step analysis framework
  - Confidence scoring
  - Assumption tracking

## Tech Stack

- **Framework**: Next.js 15.2.4 with App Router
- **Language**: TypeScript
- **AI SDK**: Vercel AI SDK with OpenAI integration
- **UI Framework**: Tailwind CSS + Radix UI components
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation
- **Styling**:
  - Tailwind CSS for utility-first styling
  - Custom dark theme
  - Responsive design
  - Component animations

## Project Structure

```text
ai-chatbot/
├── app/
│   ├── api/
│   │   ├── chat/           # General chat API endpoint
│   │   └── solver/         # Problem solver API endpoint
│   ├── solver/             # Advanced problem solver page
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Main chat page
├── components/
│   ├── ui/                 # Reusable UI components (Radix UI based)
│   └── theme-provider.tsx  # Dark theme provider
├── lib/
│   └── utils.ts            # Utility functions
└── hooks/                  # Custom React hooks
```

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd ai-chatbot
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Run the development server**

   ```bash
   pnpm dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### General Chat

- Start a conversation with the AI assistant
- Ask for weather information: *"What's the weather in New York?"*
- Request temperature conversions: *"Convert 75°F to Celsius"*
- General questions and assistance

### Problem Solver

Click the "Problem Solver" button or navigate to `/solver` for advanced capabilities:

**Business Analysis Example:**

```text
Calculate the break-even point for a product that costs $25 to make, 
sells for $40, with $50,000 fixed costs
```

**Mathematical Problems:**

```text
If I invest $10,000 at 7% annual compound interest for 5 years, 
what will it be worth?
```

**Logic Puzzles:**

```text
A farmer has chickens and cows. Together they have 50 heads and 140 legs. 
How many of each animal?
```

## API Endpoints

### `/api/chat`

- **Method**: POST
- **Purpose**: General chat conversations
- **Tools**: Weather checking, temperature conversion
- **Model**: GPT-4

### `/api/solver`

- **Method**: POST
- **Purpose**: Advanced problem solving
- **Tools**: Mathematical calculator, problem solver, research assistant
- **Model**: GPT-4 with specialized system prompt

## Available Scripts

```bash
# Development
pnpm dev          # Start development server

# Production
pnpm build        # Build for production
pnpm start        # Start production server

# Code Quality
pnpm lint         # Run ESLint
```

## Key Dependencies

- **AI & Chat**: `@ai-sdk/openai`, `@ai-sdk/react`, `ai`
- **UI Components**: Radix UI primitives
- **Styling**: `tailwindcss`, `class-variance-authority`, `clsx`
- **Forms**: `react-hook-form`, `@hookform/resolvers`, `zod`
- **Icons**: `lucide-react`
- **Theme**: `next-themes`

## Features in Detail

### AI Tools Integration

The application uses structured AI tools for enhanced functionality:

1. **Weather Tool**: Provides location-based weather information
2. **Temperature Converter**: Converts between Fahrenheit and Celsius
3. **Mathematical Calculator**: Evaluates complex mathematical expressions
4. **Problem Solver**: Structured multi-step problem analysis
5. **Research Assistant**: Information analysis and research support

### UI/UX Features

- Responsive design for all screen sizes
- Dark theme with elegant styling
- Real-time message streaming
- Loading states and smooth animations
- Intuitive navigation between chat modes
- Accessibility-first component design

### Performance Optimizations

- Server-side rendering with Next.js App Router
- Optimized bundle with tree-shaking
- Lazy loading of UI components
- Efficient state management with React hooks

## Development

### Adding New AI Tools

1. Define the tool in the appropriate API route (`/api/chat` or `/api/solver`)
2. Add the tool configuration with Zod schema validation
3. Implement the execute function
4. Update the UI to handle tool responses

### Customizing Themes

- Modify `app/globals.css` for global styles
- Update `tailwind.config.ts` for design tokens
- Use `next-themes` for theme switching

### Adding New Pages

1. Create new page in the `app/` directory
2. Add navigation links in existing components
3. Follow the established design patterns

## License

This project is private and proprietary.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

For questions and support, please open an issue in the repository.

---

Built with ❤️ using Next.js and OpenAI
