import { supabase } from "@/supabase.config.mjs"
import { NextResponse } from "next/server"
import { parse } from "cookie"

export async function POST(request) {
    try {
        // Get the session from cookies
        const cookies = parse(request.headers.get("cookie") || "")
        const sessionCookie = JSON.parse(cookies["sb-tsttcdnsxisaewbtricp-auth-token"] || "{}")

        if (!sessionCookie?.[0]) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Session cookie is missing",
                },
                { status: 401 },
            )
        }

        // Set the session on the server
        const { data: session, error } = await supabase.auth.setSession({
            access_token: sessionCookie[0],
            refresh_token: sessionCookie[1],
        })

        if (error || !session) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Session is missing or expired",
                },
                { status: 401 },
            )
        }

        // Sign out from Supabase
        await supabase.auth.signOut()

        // Create a response that will clear the cookies
        const response = NextResponse.json({ success: true })

        // Clear the Supabase cookie
        response.cookies.set("sb-tsttcdnsxisaewbtricp-auth-token", "", {
            expires: new Date(0),
            path: "/",
        })

        // Clear any other auth-related cookies you might have
        response.cookies.set("supabase-auth-token", "", {
            expires: new Date(0),
            path: "/",
        })

        return response
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: error.message || "Failed to sign out",
            },
            { status: 500 },
        )
    }
}
