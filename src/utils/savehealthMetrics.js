export async function saveHealthMetrics(userId, metrics) {
    // Validate input
    if (!userId || !metrics) {
        return { success: false, message: "User ID and metrics are required" };
    }

    try {
        const response = await fetch('/api/update-health-metric', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: userId,
                ...metrics,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                message: data.error || "Failed to save health metrics"
            };
        }

        return {
            success: true,
            message: data.message || "Health metrics saved successfully"
        };
    } catch (error) {
        console.error("Health metrics save error:", error);
        return {
            success: false,
            message: "An error occurred. Please try again."
        };
    }
}