import { supabase } from "@/supabase.config.mjs";
import { parse } from 'cookie';

export async function POST(request) {
    try {
        // Get and validate session
        const cookies = parse(request.headers.get('cookie') || '');
        const sessionCookie = JSON.parse(cookies['sb-tsttcdnsxisaewbtricp-auth-token'] || '{}');
        
        if (!sessionCookie?.[0]) {
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

        // Prepare update payloads for both auth and profiles table
        const authUpdatePayload = {
            email: email || undefined,
            user_metadata: {
                full_name: name || undefined,
                avatar_url: imageUrl || undefined
            }
        };

        const profilesUpdatePayload = {
            ...(name && { full_name: name }),
            ...(email && { email }),
            ...(imageUrl && { avatar_url: imageUrl })
        };

        // Remove undefined properties
        Object.keys(authUpdatePayload).forEach(key => 
            authUpdatePayload[key] === undefined && delete authUpdatePayload[key]
        );
        
        if (authUpdatePayload.user_metadata) {
            Object.keys(authUpdatePayload.user_metadata).forEach(key => 
                authUpdatePayload.user_metadata[key] === undefined && delete authUpdatePayload.user_metadata[key]
            );
            
            if (Object.keys(authUpdatePayload.user_metadata).length === 0) {
                delete authUpdatePayload.user_metadata;
            }
        }

        if (Object.keys(authUpdatePayload).length === 0 && Object.keys(profilesUpdatePayload).length === 0) {
            return Response.json({
                success: false,
                message: "No valid fields to update"
            }, { status: 400 });
        }

        // Perform both operations in parallel if needed
        const promises = [];
        let authPromise, profilePromise;

        if (Object.keys(authUpdatePayload).length > 0) {
            authPromise = supabase.auth.updateUser(authUpdatePayload);
            promises.push(authPromise);
        }

        if (Object.keys(profilesUpdatePayload).length > 0) {
            profilePromise = supabase
                .from('profiles')
                .update(profilesUpdatePayload)
                .eq('id', userId)
                .select();
            promises.push(profilePromise);
        } else {
            // Only select profile if we're not updating it
            profilePromise = supabase
                .from('profiles')
                .select()
                .eq('id', userId)
                .single();
            promises.push(profilePromise);
        }

        // Wait for all operations to complete
        const results = await Promise.all(promises);
        
        // Process results
        const authResult = authPromise ? results[promises.indexOf(authPromise)] : null;
        const profileResult = profilePromise ? results[promises.indexOf(profilePromise)] : null;

        const authError = authResult?.error;
        const profileError = profileResult?.error;
        
        if (authError && profileError) {
            throw new Error(`Auth error: ${authError.message}, Profile error: ${profileError.message}`);
        }
        
        const updatedUser = authResult?.data;
        const updatedProfile = profileResult?.data?.[0] || profileResult?.data;

        if (authError) {
            return Response.json({
                success: false,
                message: `Auth update failed: ${authError.message}`,
                profile: updatedProfile
            }, { status: 500 });
        }
        
        if (profileError) {
            return Response.json({
                success: true,
                imageUrl,
                user: updatedUser,
                warning: "Auth user updated but profile table update failed",
                profileError: profileError.message
            }, { status: 200 });
        }

        return Response.json({
            success: true,
            imageUrl,
            user: updatedUser,
            profile: updatedProfile
        }, { status: 200 });

    } catch (error) {
        return Response.json({
            success: false,
            message: error.message || "Failed to update user",
            error: error.code || "server_error"
        }, { status: 500 });
    }
}