import { supabase } from '@/supabase.config.mjs';
import { NextResponse } from 'next/server';
import { parse } from 'cookie';

export async function GET(request) {
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

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the user's dietary preferences
    const { data, error } = await supabase
        .from('fitness_goals')
        .select('*')
        .eq('user_id', user.id)
        .single()

    if (error && error.code !== 'PGRST116') {
        return NextResponse.json({ error: 'Failed to fetch fitness goals' }, { status: 500 })
    }

    return NextResponse.json({ data })
}

export async function POST(request) {

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

        const { userId, fitness_goals } = await request.json()

        if (!userId) {
            return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 })
        }

        // Check if user already has preferences
        const { data: existingFitnessGoals } = await supabase
            .from('fitness_goals')
            .select('id')
            .eq('user_id', userId)
            .single()

        let result;

        if (existingFitnessGoals) {
            // Update existing preferences
            const { data, error } = await supabase
                .from('fitness_goals')
                .update({
                    user_id: userId,
                    target_weight: fitness_goals.targetWeight,
                    weekly_weight_change: fitness_goals.weeklyLoss,
                    activity_level: fitness_goals.activityLevel,
                    calorie_goal: fitness_goals.calorieGoal,
                    protein_goal: fitness_goals.proteinGoal,
                    carbs_goal: fitness_goals.carbsGoal,
                    fat_goal: fitness_goals.fatGoal,
                    fiber_goal: fitness_goals.fiberGoal,
                    sugar_goal: fitness_goals.sugarGoal,
                })
                .eq('user_id', userId)
                .select()

            if (error) throw error
            result = data
        } else {
            // Insert new preferences
            const { data, error } = await supabase
                .from('fitness_goals')
                .insert({
                    user_id: userId,
                    target_weight: fitness_goals.targetWeight,
                    weekly_weight_change: fitness_goals.weeklyLoss,
                    activity_level: fitness_goals.activityLevel,
                    calorie_goal: fitness_goals.calorieGoal,
                    protein_goal: fitness_goals.proteinGoal,
                    carbs_goal: fitness_goals.carbsGoal,
                    fat_goal: fitness_goals.fatGoal,
                    fiber_goal: fitness_goals.fiberGoal,
                    sugar_goal: fitness_goals.sugarGoal,
                })
                .select()

            if (error) throw error
            result = data
        }

        return NextResponse.json({
            success: true,
            message: "Fitness goals updated successfully",
            data: result
        })

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error.message || "Failed to update fitness goals"
        }, { status: 500 })
    }
}