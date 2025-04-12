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

    // Get the user's fitness goals
    let { data, error } = await supabase
        .from('meals')
        .select('*')
        .eq('user_id', user.id)

    if (error && error.code !== 'PGRST116') {
        return NextResponse.json({ error: 'Failed to fetch fitness goals' }, { status: 500 })
    }


    return NextResponse.json({
        success: true,
        data: data || []
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

        const { userId, meal } = await request.json()

        if (!userId) {
            return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 })
        }

        const { data: mealData, error: mealError } = await supabase
            .from('meals')
            .insert({
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
            })
            .select()

        if (mealError) {
            return NextResponse.json({ success: false, message: "Failed to save meal data" }, { status: 500 })
        }

        return NextResponse.json({
            success: true,
            message: "Fitness goals updated successfully",
            data: mealData || []
        }, { status: 200 })

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error.message || "Failed to update fitness goals"
        }, { status: 500 })
    }
}

export async function PUT(request) {
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

        const { userId, meal } = await request.json()

        if (!userId || !meal?.id) {
            return NextResponse.json({ success: false, message: "User ID and Meal ID are required" }, { status: 400 })
        }

        const { data: updatedMeal, error: updateError } = await supabase
            .from('meals')
            .update({
                title: meal.title,
                date: meal.date,
                starttime: meal.starttime || meal.startTime,
                endtime: meal.endtime || meal.endTime,
                type: meal.type,
                calories: meal.calories,
                protein: meal.protein,
                carbs: meal.carbs,
                fat: meal.fat,
            })
            .eq('id', meal.id)
            .eq('user_id', userId)
            .select()

        if (updateError) {
            return NextResponse.json({ success: false, message: "Failed to update meal" }, { status: 500 })
        }

        return NextResponse.json({
            success: true,
            message: "Meal updated successfully",
            data: updatedMeal
        })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error.message || "Internal server error"
        }, { status: 500 })
    }
}


export async function DELETE(request) {
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

        const { id, userId } = await request.json();

        if (!id || !userId) {
            return NextResponse.json({ success: false, message: "Meal ID and User ID are required" }, { status: 400 });
        }

        const { error: deleteError } = await supabase
            .from('meals')
            .delete()
            .eq('id', id)
            .eq('user_id', userId);

        if (deleteError) {
            return NextResponse.json({ success: false, message: "Failed to delete meal" }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: "Meal deleted successfully"
        });

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error.message || "Internal server error"
        }, { status: 500 });
    }
}
