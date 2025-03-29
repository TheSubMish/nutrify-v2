import { supabase } from "@/supabase.config.mjs";
import { parse } from 'cookie';

export async function POST(request) {
    try {
        const cookies = parse(request.headers.get('cookie') || '');
        const sessionCookie = JSON.parse(cookies['sb-tsttcdnsxisaewbtricp-auth-token']);
        
        if (!sessionCookie) {
            return new Response(JSON.stringify({
                success: false,
                message: "Session cookie is missing"
            }), { status: 401 });
        }
        console.log("Session cookie:", sessionCookie);
        console.log(sessionCookie[0])
        const { data: session, error: sessionError } = await supabase.auth.setSession({
            access_token: sessionCookie[0],
            refresh_token: sessionCookie[1]
        });
        
        console.log(session);
        
        if (sessionError || !session) {
            return new Response(JSON.stringify({
                success: false,
                message: "Session is missing or expired"
            }), { status: 401 });
        }
        
        const formData = await request.formData();
        console.log(formData);

        // Validate required fields
        const userId = formData.get("userId");
        const name = formData.get("name");
        const email = formData.get("email");
        const file = formData.get("file");

        if (!userId) {
            return new Response(JSON.stringify({ 
                success: false, 
                message: "User ID is required" 
            }), { status: 400 });
        }

        // Validate email format if provided
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return new Response(JSON.stringify({
                success: false,
                message: "Invalid email format"
            }), { status: 400 });
        }

        let imageUrl = null;

        // Handle file upload (if provided)
        if (file && file.size > 0) {
            const fileName = `${userId}/${Date.now()}-${file.name}`;
            const { error: uploadError } = await supabase.storage
                .from("avatars")
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${fileName}`;
        }

        // Prepare update payload
        const updatePayload = {
            email: email || undefined,  // Only update if provided
            user_metadata: {
                full_name: name || undefined,  // Only update if provided
                avatar_url: imageUrl || undefined  // Only update if uploaded
            }
        };

        // Remove undefined properties (Supabase doesn't allow undefined fields)
        Object.keys(updatePayload).forEach(key => updatePayload[key] === undefined && delete updatePayload[key]);
        Object.keys(updatePayload.user_metadata).forEach(key => updatePayload.user_metadata[key] === undefined && delete updatePayload.user_metadata[key]);

        if (Object.keys(updatePayload).length === 0) {
            return new Response(JSON.stringify({
                success: false,
                message: "No valid fields to update"
            }), { status: 400 });
        }

        // Update user in authentication
        const { data: updatedUser, error: updateError } = await supabase.auth.updateUser(updatePayload);

        if (updateError) throw updateError;

        console.log("User authentication updated:", updatedUser);

        return new Response(JSON.stringify({
            success: true,
            imageUrl,
            user: updatedUser
        }), { status: 200 });

    } catch (error) {
        console.error("Profile update error:", error);
        return new Response(JSON.stringify({
            success: false,
            message: error.message || "Failed to update user",
            error: error.code || "server_error"
        }), { status: 500 });
    }
}
