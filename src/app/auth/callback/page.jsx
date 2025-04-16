"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/supabase.config.mjs";
import { toast } from "sonner";
import { useAppStore } from "@/store";

export default function Callback() {
    const router = useRouter();
    const { setUser } = useAppStore();

    useEffect(() => {
        let mounted = true;
        let timeoutId;

        const handleAuth = async () => {
            try {
                // Wait for Supabase to process the OAuth code
                const { data: { session }, error } = await supabase.auth.getSession();

                if (!mounted) return;

                if (error || !session?.user) {
                    toast.error("No session found");
                    // throw new Error(error?.message || "No session found");
                }

                // Store user data
                const userData = {
                    id: session.user.id,
                    email: session.user.email,
                    name: session.user.user_metadata?.full_name || "User",
                    avatar: session.user.user_metadata?.avatar_url || null,
                };

                // localStorage.setItem("user", JSON.stringify(userData));
                setUser(userData);
                router.push("/dashboard/profile");

            } catch (err) {
                if (!mounted) return;
                console.error("Auth error:", err);
                toast.error("Authentication failed");
                router.push("/auth/login");
            }
        };

        // Set up a proper waiting mechanism
        const waitForAuth = async () => {
            // Give Supabase time to process the OAuth code
            await new Promise(resolve => setTimeout(resolve, 500));

            // First check existing session
            // await handleAuth();

            // Set up listener for auth state changes
            const { data: { subscription } } = supabase.auth.onAuthStateChange(
                async (event) => {
                    if (event === "SIGNED_IN") {
                        await handleAuth();
                    }
                }
            );

            // Fallback timeout
            timeoutId = setTimeout(() => {
                if (!mounted) return;
                toast.error("Authentication timed out");
                router.push("/auth/login");
            }, 10000); // 10 seconds timeout

            return () => {
                subscription?.unsubscribe();
            };
        };

        waitForAuth();

        return () => {
            mounted = false;
            clearTimeout(timeoutId);
        };
    }, [router, setUser]);

    return <div className="text-center p-8">Completing authentication...</div>;
}