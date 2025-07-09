"use client"

import type React from "react"
import Link from "next/link"

import { useChat } from "@ai-sdk/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Bot, User, Wrench, Brain, ArrowRight } from "lucide-react"

export default function ChatbotPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    maxSteps: 5,
    initialMessages: [
      {
        id: "1",
        role: "assistant",
        content: "Hello! I'm your AI assistant. How can I help you today? I can check the weather and convert temperatures!\n\n💡 **Tip:** For complex math problems and step-by-step analysis, try the **Problem Solver** (click the button above)!",
      },
    ],
  })

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl h-[80vh] bg-gray-900 border-gray-800">
        <CardHeader className="border-b border-gray-800">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-white">
              <Bot className="w-6 h-6 text-blue-400" />
              AI Chatbot
            </CardTitle>
            <Link href="/solver">
              <Button variant="outline" size="sm" className="bg-purple-600/20 border-purple-500 text-purple-300 hover:bg-purple-600/30">
                <Brain className="w-4 h-4 mr-2" />
                Problem Solver
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          </div>
        </CardHeader>

        <CardContent className="p-0 flex-1">
          <ScrollArea className="h-[calc(80vh-160px)] p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.role === "user" ? "bg-blue-600" : "bg-gray-700"
                    }`}
                  >
                    {message.role === "user" ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-blue-400" />
                    )}
                  </div>

                  <div className={`flex-1 max-w-[80%] ${message.role === "user" ? "text-right" : "text-left"}`}>
                    <div
                      className={`inline-block p-3 rounded-lg ${
                        message.role === "user" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-100"
                      }`}
                    >
                      <div className="text-sm leading-relaxed whitespace-pre-wrap space-y-2">
                        {message.content && <div>{message.content}</div>}
                        {message.toolInvocations && message.toolInvocations.map((toolInvocation, index) => (
                          <div key={index} className="border-l-2 border-blue-400 pl-3 mt-2">
                            <div className="text-xs text-blue-300 font-medium mb-1 flex items-center gap-1">
                              <Wrench className="w-3 h-3" />
                              {toolInvocation.toolName}
                            </div>
                            {toolInvocation.state === 'call' && (
                              <div className="text-xs text-gray-400">
                                Calling with: {JSON.stringify(toolInvocation.args)}
                              </div>
                            )}
                            {toolInvocation.state === 'result' && (
                              <div className="text-xs text-green-300">
                                Result: {JSON.stringify(toolInvocation.result)}
                              </div>
                            )}
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
                    <Bot className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="inline-block p-3 rounded-lg bg-gray-800">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>

        <CardFooter className="border-t border-gray-800 p-4 min-h-[72px] flex items-center">
          <form onSubmit={handleSubmit} className="flex w-full gap-2 items-center">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Type your message here..."
              className="flex-1 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 h-10"
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white flex-shrink-0 h-10 w-10"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}
