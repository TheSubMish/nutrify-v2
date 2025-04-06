import { callAi } from "./callAi";

export const getFitnessGoals = async (userMetrics, ) => {

    // Check if user is logged in
    if (!user) {
        throw new Error("User not logged in");
    }

    // Check if weight history is available
    if (!weightHistory || weightHistory.length === 0) {
        throw new Error("Weight history not available");
    }

    // Call the AI API to get fitness goals
    const response = await callAi({
        prompt: `Based on the user's weight history and current metrics, suggest personalized fitness goals.`,
        data: {
            weightHistory,
            userMetrics,
            defaultGoals,
        },
    });

    return response;
}