import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import Button from "@/components/ui/button"
import EditProfileDialog from "./edit-profile-dialog"
import { useState } from "react"
import { Edit } from "lucide-react"
import { formatDate } from "@/utils/formatDate"
import { useAppStore } from "@/store"

export default function ProfileHeader({ user, setUser }) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const { user: storeUser, setUser: setStoreUser } = useAppStore();

  console.log(user);
  

  const handleProfileUpdate = (updatedUser) => {
    setUser((prevUser) => ({
      id: updatedUser?.id || prevUser.id,
      name: updatedUser?.full_name || prevUser.name,
      email: updatedUser?.email || prevUser.email,
      avatar: updatedUser?.avatar_url || prevUser.avatar,
      created_at: updatedUser?.created_at ? formatDate(updatedUser.created_at) : prevUser.created_at,
      preferences: {
        dietType: updatedUser?.diet_type || prevUser.preferences.dietType,
        allergies: updatedUser?.allergies || prevUser.preferences.allergies,
        restrictions: updatedUser?.dietary_restrictions || prevUser.preferences.restrictions,
        dislikedFoods: prevUser.preferences.dislikedFoods,
      },
      goals: {
        targetWeight: updatedUser?.target_weight ?? prevUser.goals.targetWeight,
        weeklyLoss: updatedUser?.weekly_weight_loss ?? prevUser.goals.weeklyLoss,
        calorieGoal: updatedUser?.calorie_goal ?? prevUser.goals.calorieGoal,
        proteinGoal: updatedUser?.protein_goal ?? prevUser.goals.proteinGoal,
        carbsGoal: prevUser.goals.carbsGoal,
        fatGoal: prevUser.goals.fatGoal,
        activityLevel: updatedUser?.activity_level || prevUser.goals.activityLevel,
      },
    }));

    setStoreUser({
      id: updatedUser?.id || storeUser?.id,
      name: updatedUser?.full_name || storeUser?.name,
      email: updatedUser?.email || storeUser?.email,
      avatar: updatedUser?.avatar_url || storeUser?.avatar,
      created_at: storeUser?.created_at,
    });
  };
  

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="tertiary-bg">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            {/* <div size="icon" variant="secondary" className="absolute top-10 left-10 h-8 w-8 rounded-full">
              <Camera className="h-4 w-4" />
            </div> */}
            {/* <Button size="icon" variant="secondary" className="absolute bottom-0 right-0 h-8 w-8 rounded-full"> */}
              {/* <span className="sr-only">Change profile picture</span>
            </Button> */}
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <Button variant="ghost" size="sm" className="h-8 gap-1" onClick={() => setIsEditDialogOpen(true)}>
                <Edit className="h-3.5 w-3.5" />
                Edit Profile
              </Button>
            </div>
            <p className="text-muted-foreground">{user.email}</p>
            <p className="text-sm text-muted-foreground mt-1">Member since {user.created_at}</p>
          </div>

          {/* <div className="flex flex-col items-center gap-2 bg-muted p-4 rounded-lg">
            <div className="text-sm text-muted-foreground">Current Plan</div>
            <div className="font-semibold">Premium</div>
            <Button variant="outline" size="sm">
              Manage Plan
            </Button>
          </div> */}
          <EditProfileDialog
            user={user}
            isOpen={isEditDialogOpen}
            onClose={() => setIsEditDialogOpen(false)}
            onSuccess={handleProfileUpdate}
          />
        </div>
      </CardContent>
    </Card>
  )
}

