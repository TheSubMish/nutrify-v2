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
        console.log("mealLog", mealLog)

        if (!mealLog || !mealLog.meal_id) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Meal log data and meal_id are required",
                },
                { status: 400 },
            )
        }

        // Prepare update data
        const updateData = {
            logged_at: new Date().toISOString(),
            // Include portion size and any adjustments to nutritional values
            portion_size: mealLog.portion_size || 100,
            // If portion size is different from 100%, adjust the nutritional values
            calories: mealLog.calories,
            protein: mealLog.protein,
            carbs: mealLog.carbs,
            fat: mealLog.fat,
            notes: mealLog.notes || null,
        }

        // Update the existing meal in the meals table
        const { data: updatedMeal, error: updateError } = await supabase
            .from("meals")
            .update(updateData)
            .eq("id", mealLog.meal_id)
            .eq("user_id", session.user.id)
            .select()

        if (updateError) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Failed to update meal",
                    error: updateError.message,
                },
                { status: 500 },
            )
        }

        if (!updatedMeal || updatedMeal.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Meal not found or you don't have permission to update it",
                },
                { status: 404 },
            )
        }

        return NextResponse.json(
            {
                success: true,
                message: "Meal logged successfully",
                data: updatedMeal,
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
