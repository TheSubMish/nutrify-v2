"use client"

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/supabase.config.mjs';

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
                if (session?.user) {
                setUser(session.user);
                } else {
                setUser(null);
                }
            } catch (err) {
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