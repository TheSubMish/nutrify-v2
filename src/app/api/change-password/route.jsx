import { supabase } from "@/supabase.config.mjs";
import { parse } from 'cookie';


export async function POST(request) {
    const { userId, currentPassword, newPassword } = await request.json();
    
    if (!userId || !currentPassword || !newPassword) {
        return Response.json({ error: "Missing required fields" }, {
            status: 400,
        });
    }
    
    try {

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

        const { error } = await supabase.auth.updateUser({
            password: newPassword,
            old_password: currentPassword,
        });
    
        if (error) {
            return Response.json({ error: error.message }, { 
                status: 400,
            });
        }
    
        return Response.json({ message: "Password updated successfully" }, {
            status: 200
        });

    } catch (error) {
        return Response.json({ error: "An error occurred while updating the password" }, {
            status: 500
        });
    }
}