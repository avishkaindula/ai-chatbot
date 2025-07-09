"use client"

import type React from "react"
import Link from "next/link"

import { useChat } from "@ai-sdk/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Send, Bot, User, Brain, Calculator, Lightbulb, CheckCircle, ArrowLeft, Search, FileText } from "lucide-react"

export default function ProblemSolverPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/solver",
    maxSteps: 10,
    initialMessages: [
      {
        id: "1",
        role: "assistant",
        content: "🧠 **Advanced Problem Solver** at your service!\n\nI can help you with:\n• Complex mathematical problems\n• Step-by-step analysis\n• Business calculations\n• Logic puzzles\n• Research questions\n\n**Try these examples:**\n\n📊 *Business:* \"Calculate the break-even point for a product that costs $25 to make, sells for $40, with $50,000 fixed costs\"\n\n🧮 *Math:* \"If I invest $10,000 at 7% annual compound interest for 5 years, what will it be worth?\"\n\n🤔 *Logic:* \"A farmer has chickens and cows. Together they have 50 heads and 140 legs. How many of each animal?\"\n\n🔬 *Analysis:* \"Compare the pros and cons of remote work vs office work for software development teams\"\n\nJust describe your problem and I'll break it down systematically!",
      },
    ],
  })

  const renderToolInvocation = (toolInvocation: any) => {
    const getToolIcon = (toolName: string) => {
      switch (toolName) {
        case 'calculate':
          return <Calculator className="w-3 h-3" />
        case 'problemSolver':
          return <Brain className="w-3 h-3" />
        case 'researchAssistant':
          return <Search className="w-3 h-3" />
        case 'weather':
          return <Lightbulb className="w-3 h-3" />
        default:
          return <CheckCircle className="w-3 h-3" />
      }
    }

    const getToolColor = (toolName: string) => {
      switch (toolName) {
        case 'calculate':
          return 'border-green-400 bg-green-900/20'
        case 'problemSolver':
          return 'border-purple-400 bg-purple-900/20'
        case 'researchAssistant':
          return 'border-blue-400 bg-blue-900/20'
        case 'weather':
          return 'border-yellow-400 bg-yellow-900/20'
        default:
          return 'border-gray-400 bg-gray-900/20'
      }
    }

    return (
      <div className={`p-3 rounded-lg border ${getToolColor(toolInvocation.toolName)} mt-2`}>
        <div className="flex items-center gap-2 mb-2">
          {getToolIcon(toolInvocation.toolName)}
          <Badge variant="outline" className="text-xs">
            {toolInvocation.toolName}
          </Badge>
        </div>
        
        {toolInvocation.state === 'call' && (
          <div className="text-xs text-gray-300">
            <div className="font-medium mb-1">Calling with parameters:</div>
            <pre className="text-xs text-gray-400 whitespace-pre-wrap">
              {JSON.stringify(toolInvocation.args, null, 2)}
            </pre>
          </div>
        )}
        
        {toolInvocation.state === 'result' && (
          <div className="text-xs text-gray-300">
            <div className="font-medium mb-1">Result:</div>
            {toolInvocation.toolName === 'problemSolver' ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {toolInvocation.result.problemType}
                  </Badge>
                  <span className="text-xs text-gray-400">
                    {toolInvocation.result.confidence}% confidence
                  </span>
                </div>
                <div className="text-green-300 font-medium">Problem: {toolInvocation.result.problem}</div>
                <div className="space-y-2">
                  {toolInvocation.result.steps?.map((step: any, idx: number) => (
                    <div key={idx} className="border-l-2 border-gray-600 pl-3 py-1">
                      <div className="text-yellow-300 text-xs font-medium">
                        Step {step.stepNumber}: {step.title}
                      </div>
                      <div className="text-gray-300 text-xs mb-1">{step.description}</div>
                      <div className="text-gray-400 text-xs italic mb-1">{step.reasoning}</div>
                      {step.calculation && (
                        <div className="text-blue-300 text-xs font-mono bg-blue-900/20 p-1 rounded">
                          {step.calculation}
                        </div>
                      )}
                      <div className="text-green-300 text-xs font-medium">→ {step.result}</div>
                    </div>
                  ))}
                </div>
                <div className="bg-green-900/30 p-3 rounded border border-green-600">
                  <div className="text-green-300 font-medium text-sm">Final Answer:</div>
                  <div className="text-green-200 text-sm mt-1">{toolInvocation.result.finalAnswer}</div>
                </div>
                {toolInvocation.result.assumptions && toolInvocation.result.assumptions.length > 0 && (
                  <div className="bg-yellow-900/20 p-2 rounded border border-yellow-600">
                    <div className="text-yellow-300 font-medium text-xs">Assumptions:</div>
                    <ul className="text-yellow-200 text-xs mt-1 space-y-1">
                      {toolInvocation.result.assumptions.map((assumption: string, idx: number) => (
                        <li key={idx}>• {assumption}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : toolInvocation.toolName === 'calculate' ? (
              <div className="space-y-2">
                <div className="bg-green-900/20 p-2 rounded border border-green-600">
                  <div className="text-green-300 font-medium text-xs">Expression:</div>
                  <div className="text-green-200 text-sm font-mono">{toolInvocation.result.expression}</div>
                </div>
                <div className="bg-blue-900/20 p-2 rounded border border-blue-600">
                  <div className="text-blue-300 font-medium text-xs">Result:</div>
                  <div className="text-blue-200 text-lg font-mono">{toolInvocation.result.formatted || toolInvocation.result.result}</div>
                </div>
                {toolInvocation.result.error && (
                  <div className="bg-red-900/20 p-2 rounded border border-red-600">
                    <div className="text-red-300 font-medium text-xs">Error:</div>
                    <div className="text-red-200 text-xs">{toolInvocation.result.error}</div>
                    {toolInvocation.result.suggestion && (
                      <div className="text-red-300 text-xs mt-1">Suggestion: {toolInvocation.result.suggestion}</div>
                    )}
                  </div>
                )}
              </div>
            ) : toolInvocation.toolName === 'researchAssistant' ? (
              <div className="space-y-2">
                <div className="text-blue-300 font-medium">Topic: {toolInvocation.result.topic}</div>
                <div className="text-gray-300 text-xs">Approach: {toolInvocation.result.approach}</div>
                <div className="space-y-1">
                  <div className="text-yellow-300 text-xs font-medium">Key Points:</div>
                  {toolInvocation.result.keyPoints?.map((point: string, idx: number) => (
                    <div key={idx} className="text-gray-300 text-xs">• {point}</div>
                  ))}
                </div>
                <div className="bg-blue-900/30 p-2 rounded border border-blue-600">
                  <div className="text-blue-300 font-medium text-xs">Conclusion:</div>
                  <div className="text-blue-200 text-xs">{toolInvocation.result.conclusion}</div>
                </div>
              </div>
            ) : (
              <pre className="text-xs text-gray-400 whitespace-pre-wrap">
                {JSON.stringify(toolInvocation.result, null, 2)}
              </pre>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-5xl h-[85vh] bg-gray-900/50 border-purple-800/50 backdrop-blur-sm">
        <CardHeader className="border-b border-purple-800/50">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-white">
              <Brain className="w-6 h-6 text-purple-400" />
              Advanced Problem Solver
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-purple-300 border-purple-500">
                Multi-Step AI Agent
              </Badge>
              <Link href="/">
                <Button variant="outline" size="sm" className="bg-gray-600/20 border-gray-500 text-gray-300 hover:bg-gray-600/30">
                  <ArrowLeft className="w-3 h-3 mr-1" />
                  Back to Chat
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0 flex-1">
          <ScrollArea className="h-[calc(85vh-160px)] p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.role === "user" ? "bg-purple-600" : "bg-gray-700"
                    }`}
                  >
                    {message.role === "user" ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Brain className="w-4 h-4 text-purple-400" />
                    )}
                  </div>

                  <div className={`flex-1 max-w-[85%] ${message.role === "user" ? "text-right" : "text-left"}`}>
                    <div
                      className={`inline-block p-4 rounded-lg ${
                        message.role === "user" 
                          ? "bg-purple-600 text-white" 
                          : "bg-gray-800/70 text-gray-100 border border-gray-700/50"
                      }`}
                    >
                      <div className="text-sm leading-relaxed whitespace-pre-wrap space-y-2">
                        {message.content && <div className="markdown-content">{message.content}</div>}
                        {message.toolInvocations && message.toolInvocations.map((toolInvocation, index) => (
                          <div key={index}>
                            {renderToolInvocation(toolInvocation)}
                          </div>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{new Date().toLocaleTimeString()}</p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                    <Brain className="w-4 h-4 text-purple-400 animate-pulse" />
                  </div>
                  <div className="flex-1">
                    <div className="inline-block p-3 rounded-lg bg-gray-800/70 border border-gray-700/50">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                        <span className="text-xs text-gray-400 ml-2">Analyzing problem...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>

        <CardFooter className="border-t border-purple-800/50 p-4 min-h-[72px] flex items-center">
          <form onSubmit={handleSubmit} className="flex w-full gap-2 items-center">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Describe your complex problem here... (e.g., 'Calculate the ROI of a $50k investment over 5 years at 7% interest')"
              className="flex-1 bg-gray-800/50 border-purple-700/50 text-white placeholder-gray-400 focus:border-purple-500 h-10"
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-purple-600 hover:bg-purple-700 text-white flex-shrink-0 h-10 w-10"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}
