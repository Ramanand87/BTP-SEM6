"use client"
import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, Mic, ChevronDown } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const AIChatbot = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your farming assistant. How can I help you today?", sender: 'ai' },
    { text: "You can ask me about crop prices, weather forecasts, or farming techniques.", sender: 'ai' }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const messagesEndRef = useRef(null)
  const [isListening, setIsListening] = useState(false)

  // Suggestions for quick questions
  const suggestions = [
    "What's the current price for wheat?",
    "Tell me about organic farming",
    "Weather forecast for my area",
    "How to prevent crop diseases?"
  ]

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Mock AI response
  const getAIResponse = (userMessage) => {
    const responses = {
      "price": "Current market prices: Wheat ₹2100/qtl, Rice ₹1850/qtl, Cotton ₹6500/qtl",
      "weather": "The forecast shows sunny weather for the next 3 days with temperatures around 28-32°C",
      "organic": "Organic farming improves soil health by using natural fertilizers like compost and green manure",
      "diseases": "Common prevention methods include crop rotation, proper spacing, and neem oil sprays"
    }

    if (userMessage.toLowerCase().includes('price')) return responses.price
    if (userMessage.toLowerCase().includes('weather')) return responses.weather
    if (userMessage.toLowerCase().includes('organic')) return responses.organic
    if (userMessage.toLowerCase().includes('disease')) return responses.diseases
    
    return "I'm still learning about farming. For detailed queries, please contact our support team at support@farmconnect.com"
  }

  const handleSend = () => {
    if (inputValue.trim()) {
      // Add user message
      setMessages(prev => [...prev, { text: inputValue, sender: 'user' }])
      
      // Simulate AI thinking
      setTimeout(() => {
        const aiResponse = getAIResponse(inputValue)
        setMessages(prev => [...prev, { text: aiResponse, sender: 'ai' }])
      }, 1000)
      
      setInputValue('')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSuggestion = (suggestion) => {
    setInputValue(suggestion)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button 
            className="rounded-full h-14 w-14 bg-green-600 hover:bg-green-700 shadow-lg"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 h-[500px] p-0 mr-4 mb-4 flex flex-col">
          <div className="bg-green-600 text-white p-3 rounded-t-lg">
            <h3 className="font-semibold">Farm Assistant</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.sender === 'user'
                      ? 'bg-green-600 text-white'
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-3 border-t bg-white">
            <div className="flex flex-wrap gap-2 mb-2">
              {suggestions.map((suggestion, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  className="text-xs h-auto py-1 px-2"
                  onClick={() => handleSuggestion(suggestion)}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your question..."
                className="flex-1"
              />
              <Button
                variant={isListening ? "destructive" : "outline"}
                size="icon"
                onClick={() => setIsListening(!isListening)}
              >
                <Mic className="h-4 w-4" />
              </Button>
              <Button onClick={handleSend}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default AIChatbot