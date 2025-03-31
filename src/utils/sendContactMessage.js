export async function sendContactMessage(name, email, message) {
    // Validate input
    if (!name || !email || !message) {
        return { success: false, message: "All fields are required" };
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { success: false, message: "Please enter a valid email address" };
    }
    
    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                email,
                message
            }),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            return { 
            success: false, 
            message: data.error || "Failed to send message" 
            };
        }
        
        return { 
            success: true, 
            message: data.message || "Message sent successfully" 
        };
    } catch (error) {
        console.error("Error sending contact message:", error);
        return { 
            success: false, 
            message: "An error occurred. Please try again." 
        };
    }
}