import { supabase } from "@/supabase.config.mjs";

export async function POST(request) {
    const { userId, oldPassword, newPassword } = await request.json();
    
    if (!userId || !oldPassword || !newPassword) {
        return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        });
    }
    
    try {
        const { error } = await supabase.auth.updateUser({
            password: newPassword,
            old_password: oldPassword,
        });
    
        if (error) {
            return new Response.json(
                { error: error.message }, 
                { status: 400,}
            );
        }
    
        return new Response.json(
            { message: "Password updated successfully" },
            { status: 200 }
        );

    } catch (error) {
        return new Response.json(
            { error: "An error occurred while updating the password" },
            { status: 500 }
        );
    }
}