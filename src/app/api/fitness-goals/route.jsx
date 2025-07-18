import { supabase } from '@/supabase.config.mjs';
import { NextResponse } from 'next/server';
import { parse } from 'cookie';
import { getFitnessGoals } from '@/utils/getFitnessGoals.mjs';
import { useAppStore } from '@/store';

export async function GET(request) {
    const cookies = parse(request.headers.get('cookie') || '');
    const sessionCookie = JSON.parse(cookies['sb-tsttcdnsxisaewbtricp-auth-token'] || '{}');
    const { userMetrics } = useAppStore.getState();

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

    // Get the user's fitness goals
    let { data: fitnessGoals, error: fitnessError } = await supabase
        .from('fitness_goals')
        .select('*')
        .eq('user_id', user.id)
        .single()

    if (fitnessError && fitnessError.code !== 'PGRST116') {
        return NextResponse.json({ error: 'Failed to fetch fitness goals' }, { status: 500 })
    }

    const defaultGoals = {
        target_weight: 0,
        weekly_weight_change: 0,
        activity_level: "moderate",
        calorie_goal: 0,
        protein_goal: 0,
        carbs_goal: 0,
        fat_goal: 0,
        fiber_goal: 0,
        sugar_goal: 0
    }

    // Get the user's weight history (sorted by date ascending)
    const { data: weightHistory, error: weightError } = await supabase
        .from('weight_history')
        .select('*')
        .eq('user_id', user.id)
        .order('recorded_at', { ascending: true });

    let message = null;
    // if (!fitnessGoals) {
    //     fitnessGoals = await getFitnessGoals(userMetrics, weightHistory, defaultGoals)
    //     message = "Please update your fitness goals"
    // }

    if (weightError) {
        return NextResponse.json({ error: 'Failed to fetch weight history' }, { status: 500 })
    }

    return NextResponse.json({
        success: true,
        message: message,
        data: {
            fitnessGoals,
            weightHistory
        }
    });
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