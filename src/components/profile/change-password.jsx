import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Label from "@/components/ui/Label";
import { changePassword } from "@/utils/changePassword.js";
import { toast } from "sonner";
import { useAppStore } from "@/store";

export function ChangePasswordModal({ isOpen, onClose }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const user = useAppStore((state) => state.user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("User not found");
      return;
    }

    setIsLoading(true);

    try {
      const result = await changePassword(user?.id, currentPassword, newPassword);
      
      if (result.success) {
        toast.success(result.message || "Password changed successfully");
        setCurrentPassword("");
        setNewPassword("");
        
        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        toast.error(result.message || "Failed to change password");
      }
    } catch (error) {
      toast.error("An error occurred while changing your password");
      console.error("Password change error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Change Password</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword" className="font-bold">Current Password</Label>
            <Input 
              id="currentPassword" 
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword" className="font-bold">New Password</Label>
            <Input 
              id="newPassword" 
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          
          <DialogFooter className="pt-4">
            <Button 
              type="button" 
              variant="secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary"
              className="font-extrabold"
              disabled={isLoading}
            >
              {isLoading ? "Changing..." : "Change Password"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}