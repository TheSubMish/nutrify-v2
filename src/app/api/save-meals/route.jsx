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
        const { userId, meals } = await request.json()

        if (!userId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User ID is required",
                },
                { status: 400 },
            )
        }

        if (!Array.isArray(meals) || meals.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Meals must be a non-empty array",
                },
                { status: 400 },
            )
        }

        // Prepare meals data for insertion
        const mealsToInsert = meals.map((meal) => ({
            user_id: userId,
            title: meal.title,
            date: meal.date,
            starttime: meal.starttime || meal.startTime,
            endtime: meal.endtime || meal.endTime,
            type: meal.type,
            calories: meal.calories,
            protein: meal.protein,
            carbs: meal.carbs,
            fat: meal.fat,
            notes: meal.notes || null,
        }))

        // Insert multiple meals in a single operation
        const { data: savedMeals, error: insertError } = await supabase.from("meals").insert(mealsToInsert).select()

        if (insertError) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Failed to save meals data",
                },
                { status: 500 },
            )
        }

        return NextResponse.json(
            {
                success: true,
                message: "Meals saved successfully",
                data: savedMeals || [],
            },
            { status: 200 },
        )
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: error.message || "Failed to save meals",
            },
            { status: 500 },
        )
    }
}
