"use client"

import { useState, useRef, useEffect } from "react"
import { Send, User, Bot, Sparkles } from "lucide-react"
import { useAppStore } from "@/store"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { ConversationLoadingSkeleton } from "@/components/chat/loading-skeleton"
import { fetchConversations } from "@/app/actions/chat"

const TypingAnimation = ({ text, speed = 10 }) => {
  const [displayedText, setDisplayedText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prevText) => prevText + text[currentIndex])
        setCurrentIndex((prevIndex) => prevIndex + 1)
      }, speed)

      return () => clearTimeout(timer)
    }
  }, [currentIndex, text, speed])

  return <ReactMarkdown remarkPlugins={[remarkGfm]}>{displayedText}</ReactMarkdown>
}


const defaultSuggestions = [
  "How many calories should I eat?",
  "What foods are high in protein?",
  "How can I reduce sugar cravings?",
  "Best pre-workout meals?",
  "How much water should I drink daily?",
  "Benefits of intermittent fasting",
];

export default function ChatPage() {
  const router = useRouter()
  const { user } = useAppStore()
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingConversations, setIsLoadingConversations] = useState(true)
  const [retryAfter, setRetryAfter] = useState(0)
  const [remainingRequests, setRemainingRequests] = useState(10)
  const messagesEndRef = useRef(null)
  const [suggestions, setSuggestions] = useState(() => {
    const storedSuggestions = localStorage.getItem("suggestions");
    return storedSuggestions ? JSON.parse(storedSuggestions) : defaultSuggestions;
  });

  // Redirect to login if no user
  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  // Store suggestions in local storage whenever they change
  useEffect(() => {
    localStorage.setItem("suggestions", JSON.stringify(suggestions));
  }, [suggestions]);

  useEffect(() => {
    const loadConversations = async () => {
      if (!user?.id) return

      setIsLoadingConversations(true)

      try {
        const { data, error } = await fetchConversations(user.id)

        if (error) {
          toast.error(error)
        } else if (data && data.length > 0) {
          setMessages(data.map((msg) => ({ ...msg, isFetched: true })))
        } else {
          setMessages([
            {
              id: 1,
              user_id: user?.id,
              role: "bot",
              content: "Hello! I'm your nutrition assistant. How can I help you with your diet and health goals today?",
              timestamp: new Date().toISOString(),
              created_at: new Date().toISOString(),
            },
          ])
        }
      } catch (error) {
        toast.error("Failed to fetch conversations")
      } finally {
        setIsLoadingConversations(false)
      }
    }

    loadConversations()
  }, [user])

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion)
    // Focus the input after setting the value
    document.getElementById("chat-input").focus()
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Countdown timer for rate limit
  useEffect(() => {
    if (retryAfter <= 0) return

    const timer = setInterval(() => {
      setRetryAfter((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [retryAfter])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!inputValue.trim() || isLoading || retryAfter > 0) return

    const userMessage = {
      id: Date.now(),
      user_id: user?.id,
      role: "user",
      content: inputValue,
      created_at: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.id,
          message: inputValue,
          generateSuggestions: true,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 429) {
          setRetryAfter(data.retryAfter || 60)
          toast.error(`Rate limit exceeded. Please try again in ${data.retryAfter} seconds.`)
        } else {
          toast.error(data.error || "Failed to get response")
        }
        return
      }

      const botResponse = {
        id: Date.now() + 1,
        user_id: user?.id,
        role: "bot",
        content: data.response,
        created_at: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, botResponse])

      if (data.suggestions && data.suggestions.length > 0) {
        setSuggestions(data.suggestions)
      }

      if (data.remainingRequests !== undefined) {
        setRemainingRequests(data.remainingRequests)
      }
    } catch (error) {
      toast.error("Failed to communicate with the server")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingConversations) {
    return <ConversationLoadingSkeleton />
  }

  return (
    <div className="flex h-screen bg-background">
      <main className="flex-1 flex flex-col overflow-hidden">
        <ChatHeader />

        <div className="flex-1 overflow-y-auto p-4">
          <div className="">
            {messages.map((message, index) => (
              <ChatMessage key={message.id} message={message} isLastMessage={index === messages.length - 1} />
            ))}

            {isLoading && <LoadingIndicator />}

            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="border-t p-4">
          <div className="">
            <ChatSuggestions suggestions={suggestions} onSuggestionClick={handleSuggestionClick} />

            <form onSubmit={handleSendMessage} className="mt-3">
              <ChatInput
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onSubmit={handleSendMessage}
                isLoading={isLoading}
                isRateLimited={retryAfter > 0}
                retryAfter={retryAfter}
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

function ChatMessage({ message, isLastMessage }) {
  const isBot = message.role === "bot"
  const [isTyping, setIsTyping] = useState(false)
  const [showFullText, setShowFullText] = useState(false)
  const responseText = typeof message.content === "string" ? message.content : ""
  const prevMessagesRef = useRef(new Set())

  useEffect(() => {
    if (isBot && responseText && !prevMessagesRef.current.has(responseText)) {
      prevMessagesRef.current.add(responseText)

      if (!message.isFetched) {
        setIsTyping(true)
        setShowFullText(false)
        const timer = setTimeout(
          () => {
            setIsTyping(false)
            setShowFullText(true)
          },
          responseText.length * 50 + 500,
        )

        return () => clearTimeout(timer)
      } else {
        setIsTyping(false)
        setShowFullText(true)
      }
    }
  }, [responseText, message.isFetched])

  return (
    <div className={`flex mb-4 ${isBot ? "" : "justify-end"}`}>
      <div className={`flex max-w-[80%] ${isBot ? "items-start" : "items-end flex-row-reverse"}`}>
        <div
          className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${isBot ? "bg-muted" : "bg-primary text-primary-foreground"}`}
        >
          {isBot ? (
            <Bot className="h-6 w-6 primary" />
          ) : (
            <User className="h-6 w-6 secondary border border-[#147870] rounded-full p-[2px]" />
          )}
        </div>

        <div className={`mx-2 px-4 py-2 rounded-lg ${isBot ? "bg-muted" : "bg-primary text-primary-foreground"}`}>
          <div className="text-sm whitespace-pre-wrap">
            {isTyping ? (
              <TypingAnimation text={responseText} />
            ) : (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
            )}
          </div>
          <span className="text-xs opacity-70 mt-1 block">
            {new Date(message.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
      </div>
    </div>
  )
}

function ChatInput({ value, onChange, onSubmit, isLoading, isRateLimited, retryAfter }) {
  return (
    <div className="relative">
      <input
        id="chat-input"
        type="text"
        value={value}
        onChange={onChange}
        placeholder={
          isRateLimited
            ? `Rate limited. Try again in ${retryAfter}s...`
            : "Ask about nutrition, diet plans, or health tips..."
        }
        className="w-full p-3 pr-12 rounded-full border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        disabled={isLoading || isRateLimited}
      />
      <button
        type="submit"
        className="absolute right-1.5 top-1.5 p-1.5 rounded-full bg-primary text-primary-foreground disabled:opacity-50"
        disabled={isLoading || !value.trim() || isRateLimited}
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

