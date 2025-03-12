"use client"

import { useState, useRef, useEffect } from "react"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { Send, User, Bot, Sparkles } from "lucide-react"

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "bot",
      content: "Hello! I'm your nutrition assistant. How can I help you with your diet and health goals today?",
      timestamp: new Date().toISOString(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const suggestions = [
    "How many calories should I eat?",
    "What foods are high in protein?",
    "How can I reduce sugar cravings?",
    "Best pre-workout meals?",
    "How much water should I drink daily?",
    "Benefits of intermittent fasting",
  ]

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      role: "user",
      content: inputValue,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    // Simulate bot response after a delay
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        role: "bot",
        content: generateResponse(inputValue),
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, botResponse])
      setIsLoading(false)
    }, 1000)
  }

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion)
    // Focus the input after setting the value
    document.getElementById("chat-input").focus()
  }

  // Simple response generator - in a real app, this would be an API call
  const generateResponse = (message) => {
    const lowerMessage = message.toLowerCase()

    if (lowerMessage.includes("calorie")) {
      return "Your daily calorie needs depend on your age, gender, weight, height, and activity level. For an average adult, it's around 2000-2500 calories for men and 1600-2000 for women. Would you like me to calculate a more personalized estimate for you?"
    } else if (lowerMessage.includes("protein")) {
      return "Great sources of protein include: chicken breast, turkey, fish, eggs, Greek yogurt, cottage cheese, tofu, lentils, chickpeas, and quinoa. For most active adults, aim for 0.8-1g of protein per pound of body weight daily."
    } else if (lowerMessage.includes("sugar") || lowerMessage.includes("cravings")) {
      return "To reduce sugar cravings: 1) Stay hydrated, 2) Eat regular balanced meals with protein, 3) Get enough sleep, 4) Try fruit when craving sweets, 5) Include healthy fats in your diet, and 6) Consider supplements like chromium or glutamine after consulting with a healthcare provider."
    } else if (lowerMessage.includes("pre-workout") || lowerMessage.includes("before workout")) {
      return "Good pre-workout meals include: banana with peanut butter, oatmeal with berries, Greek yogurt with granola, or a small turkey sandwich. Aim to eat 1-3 hours before exercising, with a focus on carbs for energy and some protein."
    } else if (lowerMessage.includes("water")) {
      return "The general recommendation is to drink about 8 cups (64 ounces) of water daily, but your needs may vary based on activity level, climate, and overall health. A good rule is to drink enough so your urine is pale yellow."
    } else if (lowerMessage.includes("fasting") || lowerMessage.includes("intermittent")) {
      return "Intermittent fasting benefits may include weight loss, improved metabolic health, reduced inflammation, and potentially increased longevity. Common methods include 16:8 (16 hours fasting, 8 hour eating window) or 5:2 (5 normal days, 2 very low calorie days)."
    } else {
      return "That's a great question about nutrition and health. Would you like me to provide more specific information or recommendations based on your personal health goals?"
    }
  }

  return (
    <div className="flex h-screen bg-background">
      {/* <AppSidebar /> */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <ChatHeader />

        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-3xl mx-auto">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}

            {isLoading && <LoadingIndicator />}

            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="border-t p-4">
          <div className="max-w-3xl mx-auto">
            <ChatSuggestions suggestions={suggestions} onSuggestionClick={handleSuggestionClick} />

            <form onSubmit={handleSendMessage} className="mt-3">
              <ChatInput
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onSubmit={handleSendMessage}
                isLoading={isLoading}
              />
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}

function ChatHeader() {
  return (
    <div className="border-b p-4 flex justify-center">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center">
          <div className="bg-primary/10 p-2 rounded-full">
            <Sparkles className="h-6 w-6 primary" />
          </div>
          <div className="ml-3">
            <h1 className="text-xl font-semibold">Nutrition Coach</h1>
            <p className="text-sm text-muted-foreground">Ask me anything about diet, nutrition, and health</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function ChatMessage({ message }) {
  const isBot = message.role === "bot"

  return (
    <div className={`flex mb-4 ${isBot ? "" : "justify-end"}`}>
      <div className={`flex max-w-[80%] ${isBot ? "items-start" : "items-end flex-row-reverse"}`}>
        <div
          className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${isBot ? "bg-primary/10 text-primary" : "bg-muted"}`}
        >
          {isBot ? <Bot className="h-6 w-6 primary" /> : <User className="h-6 w-6 secondary border border-[#147870] rounded-full p-[2px]" />}
        </div>

        <div className={`mx-2 px-4 py-2 rounded-lg ${isBot ? "bg-muted" : "bg-primary text-primary-foreground"}`}>
          <p className="text-sm">{message.content}</p>
          <span className="text-xs opacity-70 mt-1 block">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
      </div>
    </div>
  )
}

function ChatInput({ value, onChange, onSubmit, isLoading }) {
  return (
    <div className="relative">
      <input
        id="chat-input"
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Ask about nutrition, diet plans, or health tips..."
        className="w-full p-3 pr-12 rounded-full border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        disabled={isLoading}
      />
      <button
        type="submit"
        className="absolute right-1.5 top-1.5 p-1.5 rounded-full bg-primary text-primary-foreground disabled:opacity-50"
        disabled={isLoading || !value.trim()}
      >
        <Send className="h-5 w-5" />
      </button>
    </div>
  )
}

function ChatSuggestions({ suggestions, onSuggestionClick }) {
  return (
    <div className="flex flex-wrap gap-2">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSuggestionClick(suggestion)}
          className="text-xs px-3 py-1.5 rounded-full tertiary-bg hover:bg-muted/80 transition-colors"
        >
          {suggestion}
        </button>
      ))}
    </div>
  )
}

function LoadingIndicator() {
  return (
    <div className="flex mb-4">
      <div className="flex items-start">
        <div className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center bg-primary/10 text-primary">
          <Bot className="h-5 w-5" />
        </div>

        <div className="mx-2 px-4 py-3 rounded-lg bg-muted">
          <div className="flex space-x-2">
            <div className="h-2 w-2 rounded-full bg-current animate-bounce" style={{ animationDelay: "0ms" }}></div>
            <div className="h-2 w-2 rounded-full bg-current animate-bounce" style={{ animationDelay: "150ms" }}></div>
            <div className="h-2 w-2 rounded-full bg-current animate-bounce" style={{ animationDelay: "300ms" }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}

