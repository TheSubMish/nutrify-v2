"use client"

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Create context
const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkSession = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                console.log("Checked session:", session, "Error:", error);
                if (session?.user) {
                setUser(session.user);
                } else {
                setUser(null);
                }
            } catch (err) {
                console.error("Session check error:", err);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        
        checkSession();
    }, []);
  
    // Sign out function
    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        localStorage.removeItem('sb-access-token');
        router.push('/auth/login');
    };

    const value = {
        user,
        loading,
        signOut,
        supabase
    };

    return (
        <AuthContext.Provider value={value}>
            {loading ? <div></div> : children}
        </AuthContext.Provider>
    );
}

// Hook for using auth context
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}