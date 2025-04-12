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
        .from('dietary_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single()

    if (error && error.code !== 'PGRST116') {
        return NextResponse.json({ error: 'Failed to fetch preferences' }, { status: 500 })
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

        const { userId, preferences } = await request.json()

        if (!userId) {
            return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 })
        }

        // Format meal frequency as an object if it's not already
        const mealFrequency = preferences.mealFrequency || {
            breakfast: true,
            lunch: true,
            dinner: true,
            snacks: true
        }

        // Check if user already has preferences
        const { data: existingPreferences } = await supabase
            .from('dietary_preferences')
            .select('id')
            .eq('user_id', userId)
            .single()

        let result

        if (existingPreferences) {
            // Update existing preferences
            const { data, error } = await supabase
                .from('dietary_preferences')
                .update({
                    diet_type: preferences.dietType,
                    restrictions: Array.isArray(preferences.restrictions) ? preferences.restrictions : [preferences.restrictions].filter(Boolean),
                    allergies: preferences.allergies || [],
                    disliked_foods: preferences.dislikedFoods || [],
                    meal_frequency: mealFrequency,
                    updated_at: new Date().toISOString()
                })
                .eq('user_id', userId)
                .select()

            if (error) throw error
            result = data
        } else {
            // Insert new preferences
            const { data, error } = await supabase
                .from('dietary_preferences')
                .insert({
                    user_id: userId,
                    diet_type: preferences.dietType,
                    restrictions: Array.isArray(preferences.restrictions) ? preferences.restrictions : [preferences.restrictions].filter(Boolean),
                    allergies: preferences.allergies || [],
                    disliked_foods: preferences.dislikedFoods || [],
                    meal_frequency: mealFrequency
                })
                .select()

            if (error) throw error
            result = data
        }

        return NextResponse.json({
            success: true,
            message: "Dietary preferences updated successfully",
            data: result
        })

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error.message || "Failed to update dietary preferences"
        }, { status: 500 })
    }
}