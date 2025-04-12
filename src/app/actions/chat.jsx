"use server"

import { supabase } from "@/supabase.config"

export async function fetchConversations(userId) {
  try {
    const { data, error } = await supabase
      .from("conversations")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true })

    if (error) {
      return { error: "Failed to fetch conversations" }
    }

    return { data }
  } catch (error) {
    return { error: "Failed to fetch conversations" }
  }
}

