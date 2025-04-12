"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/supabase.config.mjs"

// Create context
const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        // Set up auth state listener
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
            if (session?.user) {
                setUser(session.user)
            } else {
                setUser(null)
            }
            setLoading(false)
        })

        // Initial session check
        const checkSession = async () => {
            try {
                const {
                    data: { session },
                    error,
                } = await supabase.auth.getSession()
                if (session?.user) {
                    setUser(session.user)
                } else {
                    setUser(null)
                }
            } catch (err) {
                setUser(null)
            } finally {
                setLoading(false)
            }
        }

        checkSession()

        // Clean up subscription
        return () => {
            subscription?.unsubscribe()
        }
    }, [])

    const signOut = async () => {
        try {
            setLoading(true)

            // First, sign out on the client side
            await supabase.auth.signOut()

            // Then call the API to sign out on the server and clear cookies
            const res = await fetch("/api/sign-out", {
                method: "POST",
                credentials: "include",
            })

            const result = await res.json()

            // Clean up local state regardless of API response
            setUser(null)
            localStorage.removeItem("user")

            // Use router for navigation instead of window.location
            if (result.success) {
                // Force a hard refresh to clear any cached state
                window.location.href = "/auth/login"
            } else {
                // Still redirect even if API fails
                router.push("/auth/login")
            }
        } catch (err) {
            // Still redirect on error
            router.push("/auth/login")
        } finally {
            setLoading(false)
        }
    }

    const value = {
        user,
        loading,
        signOut,
        supabase,
    }

    return <AuthContext.Provider value={value}>{loading ? <div>Loading...</div> : children}</AuthContext.Provider>
}

// Hook for using auth context
export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
