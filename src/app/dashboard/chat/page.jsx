"use client"

import { useState, useRef, useEffect } from "react"
import { Send, User, Bot, Sparkles, LogOut } from "lucide-react"
import { useAppStore } from "@/store"
import { useRouter } from "next/navigation"
import { supabase } from "@/supabase.config"
import { toast } from "sonner"
import { callAi } from "@/utils/callAi"
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ConversationLoadingSkeleton } from "@/components/chat/loading-skeleton"


const TypingAnimation = ({ text, speed = 10 }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prevText => prevText + text[currentIndex]);
        setCurrentIndex(prevIndex => prevIndex + 1);
      }, speed);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, text, speed]);

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]}>
      {displayedText}
    </ReactMarkdown>
  );
};

export default function ChatPage() {
  const router = useRouter()
  const { user } = useAppStore()
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingConversations, setIsLoadingConversations] = useState(true)
  const messagesEndRef = useRef(null)

  // Redirect to login if no user
  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  useEffect(()=>{
    const fetchConversations = async () => {

      setIsLoadingConversations(true)

      const { data, error } = await supabase
        .from("conversations")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching conversations:", error.message);
        toast.error("Failed to fetch conversations");
      } else {
        console.log("Conversations fetched successfully");
        console.log(data);
        if (data.length > 0){
          setMessages(data.map(msg => ({ ...msg, isFetched: true })));
        } else {
          setMessages([
            {
              id: 1,
              user_id: user?.id,
              role: "bot",
              content: "Hello! I'm your nutrition assistant. How can I help you with your diet and health goals today?",
              timestamp: new Date().toISOString(),
            },
          ]);
        }
      }

      setIsLoadingConversations(false)
    };

    fetchConversations();
  },[])

  const saveConversation = async (role, content) => {
    const { error } = await supabase.from("conversations").insert([
      {
          user_id: user?.id,
          role,
          content,
      },
    ]);

    if (error) {
        console.error("Error saving conversation:", error.message);
        toast.error("Failed to save conversation");
    } else {
        console.log("Conversation saved successfully");
    }
  };

  const suggestions = [
    "How many calories should I eat?",
    "What foods are high in protein?",
    "How can I reduce sugar cravings?",
    "Best pre-workout meals?",
    "How much water should I drink daily?",
    "Benefits of intermittent fasting",
  ]

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

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    const userMessage = {
      id: messages.length + 1,
      user_id: user?.id,
      role: "user",
      content: inputValue,
      created_at: new Date().toISOString(),
    }

    console.log(supabase.auth.getUser())

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)
    saveConversation("user", inputValue)

    // Call AI to generate response
    const prompt = `${inputValue} \n if this is not related to health, nutrition or diet, please ignore this message. send a message "Failed to get response please ask question related to health, nutrition or diet" to get a response related to health, nutrition or diet.`

    const aiResponse = await callAi(prompt);
    console.log("AI Response:", aiResponse);
    
    const botResponse = {
      id: messages.length + 2,
      user_id: user?.id,
      role: "bot",
      content: aiResponse,
      created_at: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, botResponse])
    setIsLoading(false)
    saveConversation("bot", aiResponse)
  }

  if (isLoadingConversations) {
    return <ConversationLoadingSkeleton />
  }

  return (
    <div className="flex h-screen bg-background">
      {/* <AppSidebar /> */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <ChatHeader />

        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-3xl mx-auto">
            {messages.map((message,index) => (
              <ChatMessage key={message.id} message={message} isLastMessage={index === messages.length - 1} />
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

function ChatMessage({ message, isLastMessage }) {
  const isBot = message.role === "bot"
  const [isTyping, setIsTyping] = useState(false);
  const [showFullText, setShowFullText] = useState(false);
  const responseText = typeof message.content === 'string' ? message.content : '';
  const prevMessagesRef = useRef(new Set());

  useEffect(() => {
    if (isBot && responseText && !prevMessagesRef.current.has(responseText)) {
      prevMessagesRef.current.add(responseText);
  
      if (!message.isFetched) {
        setIsTyping(true);
        setShowFullText(false);
        const timer = setTimeout(() => {
          setIsTyping(false);
          setShowFullText(true);
        }, responseText.length * 50 + 500);
  
        return () => clearTimeout(timer);
      } else {
        setIsTyping(false);
        setShowFullText(true);
      }
    }
  }, [responseText, message.isFetched]);
  

  return (
    <div className={`flex mb-4 ${isBot ? "" : "justify-end"}`}>
      <div className={`flex max-w-[80%] ${isBot ? "items-start" : "items-end flex-row-reverse"}`}>
        <div
          className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${isBot ? "bg-primary/10 text-primary" : "bg-muted"}`}
        >
          {isBot ? <Bot className="h-6 w-6 primary" /> : <User className="h-6 w-6 secondary border border-[#147870] rounded-full p-[2px]" />}
        </div>

        <div className={`mx-2 px-4 py-2 rounded-lg ${isBot ? "bg-muted" : "bg-primary text-primary-foreground"}`}>
          <div className="text-sm whitespace-pre-wrap">
            {isTyping ? (
              <TypingAnimation text={responseText} />
            ) : (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
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

