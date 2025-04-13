"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Mic, X, Bot, User, ChevronDown, ChevronUp, Sparkles, MessageSquare } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

const AIChatbot = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your farming assistant. How can I help you today?", sender: "ai" },
    { text: "You can ask me about contracts, farming techniques, or market prices.", sender: "ai" },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const messagesEndRef = useRef(null)
  const [isListening, setIsListening] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const inputRef = useRef(null)

  // Categories for suggestions
  const suggestionCategories = [
    {
      name: "General",
      items: [
        "Tell me about the project",
        "How do contracts work?",
        "What crops are available?",
        "How to create a farming contract?",
      ],
    },
  ]

  // Auto-scroll to bottom
  useEffect(() => {
    if (!minimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, minimized])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !minimized) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen, minimized])

  // Function to fetch response from the chatbot API
  const fetchAIResponse = async (userMessage) => {
    try {
      const response = await fetch("http://127.0.0.1:4000/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response from AI")
      }

      const data = await response.json()
      return data.message
    } catch (error) {
      console.error("Error fetching AI response:", error)
      return "Sorry, I'm having trouble connecting to the server. Please try again later."
    }
  }

  const handleSend = async () => {
    if (inputValue.trim()) {
      // Add user message
      setMessages((prev) => [...prev, { text: inputValue, sender: "user" }])
      const userInput = inputValue
      setInputValue("")

      // Set loading state

      try {
        // Get AI response
        const aiResponse = await fetchAIResponse(userInput)
        // First turn off loading, then add the message to prevent both showing at once
        setIsLoading(true)
        setMessages((prev) => [...prev, { text: aiResponse, sender: "ai" }])
      } catch (error) {
        console.error("Error in handleSend:", error)
        setIsLoading(false)
        setMessages((prev) => [
          ...prev,
          {
            text: "Sorry, I couldn't process your request. Please try again.",
            sender: "ai",
          },
        ])
      }
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSuggestion = async (suggestion) => {
    setInputValue("")
    // Add user message
    setMessages((prev) => [...prev, { text: suggestion, sender: "user" }])

    // Set loading state
    setIsLoading(false)

    try {
      // Get AI response
      const aiResponse = await fetchAIResponse(suggestion)
      // First turn off loading, then add the message to prevent both showing at once
      setIsLoading(false)
      setMessages((prev) => [...prev, { text: aiResponse, sender: "ai" }])
    } catch (error) {
      console.error("Error in handleSuggestion:", error)
      setIsLoading(false)
      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, I couldn't process your request. Please try again.",
          sender: "ai",
        },
      ])
    }
  }

  const toggleMinimize = (e) => {
    e.stopPropagation()
    setMinimized(!minimized)
  }

  const clearChat = () => {
    setMessages([
      { text: "Hello! I'm your farming assistant. How can I help you today?", sender: "ai" },
      { text: "You can ask me about contracts, farming techniques, or market prices.", sender: "ai" },
    ])
  }

  const formatMessage = (text) => {
    // Simple formatting for message text
    return text.split("\n").map((line, i) => (
      <span key={i}>
        {line}
        {i < text.split("\n").length - 1 && <br />}
      </span>
    ))
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            className="rounded-full h-14 w-14 bg-green-600 hover:bg-green-700 shadow-lg flex items-center justify-center"
            onClick={() => setIsOpen(!isOpen)}
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: 0, scale: 0.5, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  exit={{ rotate: 0, scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="h-6 w-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="open"
                  initial={{ rotate: 0, scale: 0.5, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  exit={{ rotate: 0, scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <MessageSquare className="h-6 w-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[300px] sm:w-[350px] p-0 mr-4 mb-4 flex flex-col shadow-xl border-green-100 rounded-2xl overflow-hidden"
          sideOffset={10}
        >
          <div className="bg-gradient-to-r from-green-600 to-green-500 text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 border-2 border-white/20">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback className="bg-green-700">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-sm">Farm Assistant</h3>
                <p className="text-xs text-green-100">AI-powered farming expert</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-white hover:bg-white/20 rounded-full"
                      onClick={clearChat}
                    >
                      <Sparkles className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p className="text-xs">New conversation</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-white hover:bg-white/20 rounded-full"
                onClick={toggleMinimize}
              >
                {minimized ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <AnimatePresence>
            {!minimized && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col"
              >
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 h-[300px] max-h-[300px]">
                  <AnimatePresence initial={false}>
                    {messages.map((msg, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} items-end gap-2`}
                      >
                        {msg.sender === "ai" && (
                          <Avatar className="h-6 w-6 flex-shrink-0">
                            <AvatarFallback className="bg-green-600 text-white">
                              <Bot className="h-3 w-3" />
                            </AvatarFallback>
                          </Avatar>
                        )}

                        <div
                          className={cn(
                            "max-w-[75%] rounded-2xl p-3 text-sm",
                            msg.sender === "user"
                              ? "bg-green-600 text-white rounded-tr-none"
                              : "bg-white border border-gray-200 rounded-tl-none",
                          )}
                        >
                          {formatMessage(msg.text)}
                        </div>

                        {msg.sender === "user" && (
                          <Avatar className="h-6 w-6 flex-shrink-0">
                            <AvatarFallback className="bg-gray-700 text-white">
                              <User className="h-3 w-3" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </motion.div>
                    ))}

                    {isLoading && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-start items-end gap-2"
                      >
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="bg-green-600 text-white">
                            <Bot className="h-3 w-3" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="max-w-[75%] rounded-2xl p-3 bg-white border border-gray-200 rounded-tl-none">
                          <div className="flex space-x-2 items-center h-5">
                            <div className="w-2 h-2 rounded-full bg-green-400 animate-bounce"></div>
                            <div
                              className="w-2 h-2 rounded-full bg-green-400 animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                            <div
                              className="w-2 h-2 rounded-full bg-green-400 animate-bounce"
                              style={{ animationDelay: "0.4s" }}
                            ></div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </AnimatePresence>
                </div>

                <div className="p-4 border-t bg-white">
                  <div className="mb-3">
                    <div className="text-xs font-medium text-gray-500 mb-2">Suggested questions:</div>
                    <div className="grid grid-cols-2 gap-2">
                      {suggestionCategories[0].items.map((suggestion, i) => (
                        <Button
                          key={i}
                          variant="outline"
                          size="sm"
                          className="text-xs h-auto py-1.5 px-3 justify-start font-normal border-green-100 hover:bg-green-50 hover:text-green-700 truncate"
                          onClick={() => handleSuggestion(suggestion)}
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 items-center">
                    <Input
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Type your question..."
                      className="flex-1 border-green-100 focus-visible:ring-green-500"
                      disabled={isLoading}
                    />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={isListening ? "destructive" : "outline"}
                            size="icon"
                            onClick={() => setIsListening(!isListening)}
                            disabled={isLoading}
                            className={isListening ? "" : "border-green-100 text-green-600 hover:bg-green-50"}
                          >
                            <Mic className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p className="text-xs">Voice input</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <Button
                      onClick={handleSend}
                      disabled={isLoading || !inputValue.trim()}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default AIChatbot