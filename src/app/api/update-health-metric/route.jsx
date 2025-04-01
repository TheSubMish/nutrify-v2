import { supabase } from "@/supabase.config.mjs";

export async function POST(request) {

    try {

        const {
            id,
            age,
            height,
            weight,
            bmi,
            bodyFat,
            chest,
            waist,
            hips
        } = await request.json();

        console.log(
            id,
            age,
            height,
            weight,
            bmi,
            bodyFat,
            chest,
            waist,
            hips
        );
        

        if (!id) {
            return Response.json({ error: "User ID is required" }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('profiles')
            .update({
                age,
                height,
                weight,
                bmi,
                body_fat: bodyFat,
                chest,
                waist,
                hips,
            })
            .eq('id', id);
            console.log(await supabase.from('profiles').select('*').eq('id', id));
            
        if (error) {
            console.error('Error updating profile:', error);
            return Response.json({ error: error.message }, { status: 400 });
        }

        console.log(data);
        

        return Response.json({
            success: true,
            message: 'Health metrics updated successfully',
            data
        },{status: 200});

    } catch (error) {
        console.error('Server error:', error);
        return Response.json({ error: 'Internal server error' }, { status: 500 });
    }
}