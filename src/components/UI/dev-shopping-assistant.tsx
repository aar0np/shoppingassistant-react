'use client'

import { useState, useEffect, useRef } from 'react'
import { Send, Moon, Sun, Code, Terminal } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"
import { Button } from "./button"
import { Card, CardContent, CardFooter, CardHeader } from "./card"
import { Input } from "./input"
import { ScrollArea } from "./scroll-area"
import { Switch } from "./switch"

type Message = {
  id: number
  content: string
  sender: 'user' | 'assistant'
}

export default function DevShoppingAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, content: "Hello, developer! I'm your AI shopping assistant. How can I help you find the perfect tech gear today?", sender: 'assistant' },
  ])
  const [input, setInput] = useState('')
  const [isDarkMode, setIsDarkMode] = useState(true)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = () => {
    if (input.trim()) {
      const newMessage: Message = { id: messages.length + 1, content: input, sender: 'user' }
      setMessages([...messages, newMessage])
      setInput('')
      setTimeout(() => {
        const assistantResponse: Message = {
          id: messages.length + 2,
          content: getAssistantResponse(input),
          sender: 'assistant'
        }
        setMessages(prevMessages => [...prevMessages, assistantResponse])
      }, 1000)
    }
  }

  const getAssistantResponse = (userInput: string): string => {
    const lowercaseInput = userInput.toLowerCase()
    if (lowercaseInput.includes('laptop') || lowercaseInput.includes('computer')) {
      return "For developers, I'd recommend considering factors like CPU power, RAM, and SSD capacity. Are you looking for a specific brand or have any performance requirements in mind?"
    } else if (lowercaseInput.includes('monitor') || lowercaseInput.includes('display')) {
      return "When it comes to monitors for coding, consider factors like resolution, size, and panel type (IPS, VA, etc.). Do you prefer a single large monitor or a multi-monitor setup?"
    } else if (lowercaseInput.includes('keyboard') || lowercaseInput.includes('mouse')) {
      return "Ergonomics are crucial for developers. For keyboards, consider mechanical switches and layout. For mice, think about ergonomic design and programmable buttons. Any specific features you're looking for?"
    } else if (lowercaseInput.includes('headphones') || lowercaseInput.includes('audio')) {
      return "For a distraction-free coding environment, noise-cancelling headphones can be great. Are you interested in over-ear or in-ear options? Any preference for wired or wireless?"
    } else {
      return "As a developer, you might be interested in various tech products. I can help with recommendations for laptops, monitors, keyboards, mice, or other dev tools. What specific category are you looking into?"
    }
  }

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <Card className="w-full max-w-2xl mx-auto h-[600px] flex flex-col bg-zinc-900 text-zinc-300 border-zinc-800">
        <CardHeader className="flex flex-row items-center justify-between p-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=40&width=40" alt="AI" />
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-semibold text-zinc-100">Dev Shopping Assistant</h2>
              <p className="text-sm text-emerald-400">Online</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Sun className="h-4 w-4 text-zinc-400" />
            <Switch
              checked={isDarkMode}
              onCheckedChange={setIsDarkMode}
              className="data-[state=checked]:bg-zinc-700"
              aria-label="Toggle dark mode"
            />
            <Moon className="h-4 w-4 text-zinc-400" />
          </div>
        </CardHeader>
        <CardContent className="flex-grow overflow-hidden p-4" ref={scrollAreaRef}>
          <ScrollArea className="h-full pr-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`rounded-lg p-3 max-w-[80%] ${
                    message.sender === 'user'
                      ? 'bg-zinc-700 text-zinc-200'
                      : 'bg-zinc-800 text-zinc-300'
                  }`}
                >
                  {message.sender === 'assistant' && (
                    <Code className="inline-block mr-2 h-4 w-4 text-emerald-400" />
                  )}
                  {message.content}
                </div>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
        <CardFooter className="p-4 border-t border-zinc-800">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="flex w-full items-center space-x-2"
          >
            <Input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-grow bg-zinc-800 border-zinc-700 text-zinc-300 placeholder-zinc-500 focus:ring-emerald-500 focus:border-emerald-500"
            />
            <Button type="submit" size="icon" className="bg-emerald-600 hover:bg-emerald-700 text-zinc-100">
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}