import { callAi } from "./callAi";

export const getFitnessGoals = async (userMetrics, weightHistory, defaultGoals) => {
    let prompt;

    if (userMetrics?.weight === 0) {
        prompt = `Recommend a general fitness goal in this format: ${JSON.stringify(defaultGoals, null, 2)}`;
    } else {
        prompt = `
        Based on the user's weight history and current metrics, suggest personalized fitness goals.
        Weight history: ${JSON.stringify(weightHistory, null, 2)}
        User metrics: ${JSON.stringify(userMetrics, null, 2)}
        Return in this format: ${JSON.stringify(defaultGoals, null, 2)}
        `;
    }

    // Call the AI API to get fitness goals
    const response = await callAi(prompt);

    console.log("AI Response: ", response);

    // Parse the AI response to extract the JSON object
    try {
        // Look for JSON pattern in the response
        const jsonMatch = response.match(/```json\s*({[\s\S]*?})\s*```/) ||
            response.match(/\{[\s\S]*?"target_weight"[\s\S]*?\}/);

        if (jsonMatch) {
            // Parse the extracted JSON
            const parsedData = JSON.parse(jsonMatch[1] || jsonMatch[0]);

            // Validate that we have all required fields
            const requiredFields = ['target_weight', 'weekly_weight_change', 'activity_level', 'calorie_goal',
                'protein_goal', 'carbs_goal', 'fat_goal', 'fiber_goal', 'sugar_goal'];

            const isValid = requiredFields.every(field => field in parsedData);

            if (isValid) {
                return parsedData;
            }
        }

        // If parsing fails or validation fails, return default goals
        console.error("Failed to parse AI response, using default goals");
        return defaultGoals;
    } catch (error) {
        console.error("Error parsing AI response:", error);
        return defaultGoals;
    }
}