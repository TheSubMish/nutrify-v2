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

    // Get the user's account settings
    const { data, error: settingError } = await supabase
        .from('user_setting')
        .select('*')
        .eq('user_id', user.id)
        .single()

    if (settingError && settingError.code !== 'PGRST116') {
        return NextResponse.json({ error: 'Failed to fetch account setting' }, { status: 500 })
    }

    return NextResponse.json({
        success: true,
        data: data
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

        const { userId, user_setting } = await request.json()

        if (!userId) {
            return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 })
        }

        // Check if user already has account settings
        const { data: userSettings } = await supabase
            .from('user_setting')
            .select('id')
            .eq('user_id', userId)
            .single()

        let result;

        if (userSettings) {
            // Update existing account settings
            const { data, error } = await supabase
                .from('user_setting')
                .update({
                    user_id: userId,
                    email_notification: user_setting.email_notification,
                    sms_notification: user_setting.sms_notification,
                    push_notification: user_setting.push_notification,
                    meal_reminder: user_setting.meal_reminder,
                    notification_freq: user_setting.notification_freq,
                    data_sharing: user_setting.data_sharing,
                    activity_tracking: user_setting.activity_tracking,
                })
                .eq('user_id', userId)
                .select()

            if (error) throw error
            result = data
        } else {
            // Insert new account settings
            const { data, error } = await supabase
                .from('user_setting')
                .insert({
                    user_id: userId,
                    email_notification: user_setting.email_notification,
                    sms_notification: user_setting.sms_notification,
                    push_notification: user_setting.push_notification,
                    meal_remainder: user_setting.meal_reminder,
                    notification_freq: user_setting.notification_freq,
                    data_sharing: user_setting.data_sharing,
                    activity_tracking: user_setting.activity_tracking,
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