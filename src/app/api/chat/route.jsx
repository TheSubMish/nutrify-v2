import { NextResponse } from "next/server"
import { supabase } from "@/supabase.config"
import { callAi } from "@/utils/callAi"

// Create a simple in-memory cache for rate limiting
// Cache to store request counts per user
const requestCache = new Map()
const CACHE_EXPIRY = process.env.NEXT_PUBLIC_CACHE_EXPIRY || 60000
const MAX_REQUESTS =  process.env.NEXT_PUBLIC_MAX_REQUESTS || 10


export async function POST(request) {
  try {
    const { userId, message, generateSuggestions } = await request.json()

    if (!userId || !message) {
      return NextResponse.json({ error: "User ID and message are required" }, { status: 400 })
    }

    // Check rate limit
    const now = Date.now()
    const userCacheKey = `user_${userId}`
    const userCache = requestCache.get(userCacheKey)

    // Clean up expired cache entries
    for (const [key, entry] of requestCache.entries()) {
      if (now - entry.timestamp > CACHE_EXPIRY) {
        requestCache.delete(key)
      }
    }

    if (userCache) {
      // If cache entry exists and hasn't expired
      if (now - userCache.timestamp <= CACHE_EXPIRY) {
        if (userCache.count >= MAX_REQUESTS) {
            const timeToWait = CACHE_EXPIRY - (now - userCache.timestamp);
            
            await new Promise(resolve => setTimeout(resolve, timeToWait)); // Wait until cache expires
        }

        // Increment request count
        userCache.count += 1
        requestCache.set(userCacheKey, userCache)
      } else {
        // Cache expired, create new entry
        requestCache.set(userCacheKey, { count: 1, timestamp: now })
      }
    } else {
      // No cache entry, create new one
      requestCache.set(userCacheKey, { count: 1, timestamp: now })
    }

    // Save user message to database
    await saveConversation(userId, "user", message)

    // Call AI to generate response
    const prompt = `${message} \n If this message is related to health, nutrition, or diet, please provide a detailed response. If it's a general inquiry, such as asking about available assistance, please offer an overview of how you can help. For unrelated topics, respond with: "I'm here to assist with health, nutrition, or diet-related questions. Please ask a question in these areas."`

    const aiResponse = await callAi(prompt)

    // Save bot response to database
    await saveConversation(userId, "bot", aiResponse)

    let suggestions = []

    // Generate suggestions if requested and response is valid
    if (generateSuggestions && !aiResponse.includes("Failed")) {
      const promptSuggestion = `${aiResponse} \n Based on this, create a array of size 6 suggestions for the user to ask. Just provide the suggestions in the array format.`
      const suggestionResponse = await callAi(promptSuggestion)

      suggestions = suggestionResponse.split("\n").filter((s, index) => index !== 0 && s.trim().length > 0)
    }

    return NextResponse.json({
      response: aiResponse,
      suggestions,
      remainingRequests: MAX_REQUESTS - (requestCache.get(userCacheKey)?.count || 0),
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}

async function saveConversation(userId, role, content) {
  const { error } = await supabase.from("conversations").insert([
    {
      user_id: userId,
      role,
      content,
    },
  ])

  if (error) {
    return NextResponse.json({ error: "Failed to save conversation" }, { status: 500 })
  }
}

