export async function changePassword(userId, currentPassword, newPassword) {
    // Validate input
    if (!userId || !currentPassword || !newPassword) {
      return { success: false, message: "All fields are required" };
    }
    
    if (newPassword.length < 8) {
      return { success: false, message: "New password must be at least 8 characters long" };
    }
    
    try {
      const response = await fetch('/api/change-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId,
            currentPassword,
            newPassword,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return { 
            success: false, 
            message: data.error || "Failed to change password" 
        };
      }
      
      return { 
            success: true, 
            message: data.message || "Password changed successfully" 
      };
    } catch (error) {
        console.error("Password change error:", error);
        return { 
            success: false, 
            message: "An error occurred. Please try again." 
        };
    }
  }