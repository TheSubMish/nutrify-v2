import { NextResponse } from "next/server"
import { parse } from "cookie"
import { supabase } from "@/supabase.config.mjs"

export async function POST(request) {
    try {
        // Authenticate user
        const cookies = parse(request.headers.get("cookie") || "")
        const sessionCookie = JSON.parse(cookies["sb-tsttcdnsxisaewbtricp-auth-token"] || "{}")

        if (!sessionCookie?.[0]) {
            return Response.json(
                {
                    success: false,
                    message: "Session cookie is missing",
                },
                { status: 401 },
            )
        }

        const { data: session, error: sessionError } = await supabase.auth.setSession({
            access_token: sessionCookie[0],
            refresh_token: sessionCookie[1],
        })

        if (sessionError || !session) {
            return Response.json(
                {
                    success: false,
                    message: "Session is missing or expired",
                },
                { status: 401 },
            )
        }

        // Extract data from request
        const { mealLog } = await request.json()
        console.log("mealLog", mealLog);
        
        if (!mealLog) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Meal log data is required",
                },
                { status: 400 },
            )
        }

        // Add user ID to the meal log
        const mealLogWithUser = {
            ...mealLog,
            user_id: session.user.id,
            logged_at: new Date().toISOString(),
        }

        // Insert meal log into database
        const { data: loggedMeal, error: logError } = await supabase.from("meal_logs").insert(mealLogWithUser).select()
        console.log("loggedMeal", loggedMeal);
        if (logError && logError.code !== 'PGRST116') {
            console.error("Error logging meal:", logError)
            return NextResponse.json(
                {
                    success: false,
                    message: "Failed to log meal",
                },
                { status: 500 },
            )
        }

        return NextResponse.json(
            {
                success: true,
                message: "Meal logged successfully",
                data: loggedMeal || [],
            },
            { status: 200 },
        )
    } catch (error) {
        console.error("Error in log-meal API:", error)
        return NextResponse.json(
            {
                success: false,
                message: error.message || "Failed to log meal",
            },
            { status: 500 },
        )
    }
}
