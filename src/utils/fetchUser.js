import { supabase } from "@/supabase.config.mjs";
import { toast } from "sonner";

export const fetchUser = async () => {

    try{
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
        return userData;
    } catch (err) {
        return null;
    }
};