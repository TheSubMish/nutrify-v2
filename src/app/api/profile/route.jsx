import { supabase } from "@/supabase.config.mjs";
import { parse } from 'cookie';

export async function POST(request) {
    try {
        const cookies = parse(request.headers.get('cookie') || '');
        const sessionCookie = JSON.parse(cookies['sb-tsttcdnsxisaewbtricp-auth-token']);
        
        if (!sessionCookie) {
            return Response.json({
                success: false,
                message: "Session cookie is missing"
            }, { status: 401 });
        }
        const { data: session, error: sessionError } = await supabase.auth.setSession({
            access_token: sessionCookie[0],
            refresh_token: sessionCookie[1]
        });
        
        if (sessionError || !session) {
            return Response.json({
                success: false,
                message: "Session is missing or expired"
            }, { status: 401 });
        }
        
        const formData = await request.formData();

        // Validate required fields
        const userId = formData.get("userId");
        const name = formData.get("name");
        const email = formData.get("email");
        const file = formData.get("file");

        if (!userId) {
            return Response.json({ 
                success: false, 
                message: "User ID is required" 
            }, { status: 400 });
        }

        // Validate email format if provided
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return Response.json({
                success: false,
                message: "Invalid email format"
            }, { status: 400 });
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

        // Prepare update payload for auth user
        const updatePayload = {
            email: email || undefined,  // Only update if provided
            user_metadata: {
                full_name: name || undefined,  // Only update if provided
                avatar_url: imageUrl || undefined  // Only update if uploaded
            }
        };

        // Remove undefined properties (Supabase doesn't allow undefined fields)
        Object.keys(updatePayload).forEach(key => updatePayload[key] === undefined && delete updatePayload[key]);
        
        if (updatePayload.user_metadata) {
            Object.keys(updatePayload.user_metadata).forEach(key => 
                updatePayload.user_metadata[key] === undefined && delete updatePayload.user_metadata[key]
            );
            
            // Remove user_metadata if empty
            if (Object.keys(updatePayload.user_metadata).length === 0) {
                delete updatePayload.user_metadata;
            }
        }

        if (Object.keys(updatePayload).length === 0) {
            return Response.json({
                success: false,
                message: "No valid fields to update"
            }, { status: 400 });
        }

        // Update user in authentication
        const { data: updatedUser, error: updateError } = await supabase.auth.updateUser(updatePayload);

        if (updateError) throw updateError;

        // Prepare profiles table update payload
        const profilesUpdatePayload = {};
        
        if (name) profilesUpdatePayload.full_name = name;
        if (email) profilesUpdatePayload.email = email;
        if (imageUrl) profilesUpdatePayload.avatar_url = imageUrl;
        
        let updatedProfile = null;
        
        // Only update profiles table if we have fields to update
        if (Object.keys(profilesUpdatePayload).length > 0) {
            // Update profiles table
            const { data: profileData, error: profileUpdateError } = await supabase
                .from('profiles')
                .update(profilesUpdatePayload)
                .eq('id', userId)
                .select();

            if (profileUpdateError) {
                console.error("Profile table update error:", profileUpdateError);
                return Response.json({
                    success: true,
                    imageUrl,
                    user: updatedUser,
                    warning: "Auth user updated but profile table update failed",
                    profileError: profileUpdateError.message
                }, { status: 200 });
            }
            
            updatedProfile = profileData?.[0] || null;
        } else {
            // If no profile updates needed, fetch the current profile
            const { data: profileData } = await supabase
                .from('profiles')
                .select()
                .eq('id', userId)
                .single();
                
            updatedProfile = profileData;
        }

        return Response.json({
            success: true,
            imageUrl,
            user: updatedUser,
            profile: updatedProfile
        }, { status: 200 });

    } catch (error) {
        console.error("Profile update error:", error);
        return Response.json({
            success: false,
            message: error.message || "Failed to update user",
            error: error.code || "server_error"
        }, { status: 500 });
    }
}