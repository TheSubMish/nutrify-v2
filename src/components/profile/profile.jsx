"use client"

import { useEffect, useState } from "react"
import ProfileHeader from "./profile-header"
import HealthMetrics from "./health-metrics"
import DietaryPreferences from "./dietary-preferences"
import FitnessGoals from "./fitness-goals"
import ProgressTracker from "./progress-tracker"
import AccountSettings from "./account-settings"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Button from "@/components/ui/button"
import { Save, RefreshCw } from "lucide-react"
import { useAppStore } from "@/store"
import { formatDate } from "@/utils/formatDate"
import { supabase } from "@/supabase.config.mjs"
import { toast } from "sonner"
import { saveHealthMetrics } from "@/utils/savehealthMetrics"

export default function Profile() {
  const [activeTab, setActiveTab] = useState("personal")
  const { user } = useAppStore()
  const [userData, setUser] = useState({})
  const [userMetrics, setUserMetrics] = useState({})

  const [activeSave, setActiveSave] = useState(false)
  const [isLoading, setIsLoading] = useState(false) // for save changes loading state
  const [loading, setLoading] = useState(true) // for initial loading state

  useEffect(() => {
    if (!user) {
      toast.error("Please log in to access your profile.");
      return;
    }
    console.log(user);
    
    const fetchProfile = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        toast.error("Error fetching user data.");
      } else {
        setUser({
          id: user?.id || null,
          name: user?.name || "Full Name",
          email: user?.email || "youremail@mail.com",
          avatar: user?.avatar || null,
          created_at: user?.created_at ? formatDate(user.created_at) : formatDate(),
          preferences: {
            dietType: "balanced",
            allergies: ["peanuts", "shellfish"],
            restrictions: ["low-sodium"],
            dislikedFoods: ["mushrooms", "olives"],
          },
          goals: {
            targetWeight: 72,
            weeklyLoss: 0.5,
            calorieGoal: 2000,
            proteinGoal: 120,
            carbsGoal: 150,
            fatGoal: 65,
            activityLevel: "moderate",
          },
        });

        setUserMetrics({
          age: data?.age || undefined,
          height: data?.height || undefined,
          weight: data?.weight || undefined,
          bmi: data?.bmi || undefined,
          bodyFat: data?.body_fat || undefined,
          chest: data?.chest || undefined,
          waist: data?.waist || undefined,
          hips: data?.hips || undefined,
          weightHistory: [
            { date: "2025-01-01", value: 82 },
            { date: "2025-01-15", value: 80 },
            { date: "2025-02-01", value: 79 },
            { date: "2025-02-15", value: 78 },
            { date: "2025-03-01", value: 78 },
          ],
        });
      }

      setLoading(false);
    
    };

    fetchProfile();
    console.log("User profile fetched");

  }, [user]);

  const handleSaveChanges = async () => {
    setIsLoading(true)

    const { id, ...metrics } = userMetrics;

    switch (activeTab) {

      case "personal":
        const response = await saveHealthMetrics(userData.id, metrics);
        if (!response.success) {
          toast.error(response.message);
        } else {
          setActiveSave(false)
          toast.success("Health metrics updated successfully!");
        }
        break;

      default:
        break;
    }
    setIsLoading(false)
    console.log("Saving profile changes...")
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-xl font-medium">Loading Profile...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background overflow-y-auto max-h-screen scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
      {/* <AppSidebar /> */}
      <main className="flex-1  p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Your Profile</h1>
            <p className="text-muted-foreground">Manage your personal information and preferences</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button size="sm" onClick={handleSaveChanges} disabled={!activeSave} >
              <Save className="mr-2 h-4 w-4" />
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        <ProfileHeader user={userData} setUser={setUser} />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
          <TabsList className="grid grid-cols-4 mb-6 bg-gray-200">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="diet">Diet Preferences</TabsTrigger>
            <TabsTrigger value="goals">Goals & Progress</TabsTrigger>
            <TabsTrigger value="account">Account Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-6">
            <HealthMetrics
              initialMetrics={userMetrics} setActiveSave={setActiveSave} setMetricsInProfile={setUserMetrics}
            />
          </TabsContent>

          <TabsContent value="diet" className="space-y-6">
            <DietaryPreferences preferences={userData.preferences} setActiveSave={setActiveSave} />
          </TabsContent>

          <TabsContent value="goals" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FitnessGoals goals={userData.goals} setActiveSave={setActiveSave} />
              {userMetrics?.weightHistory && userData?.goals?.targetWeight ? (
                <ProgressTracker
                  weightHistory={userMetrics.weightHistory}
                  targetWeight={userData.goals.targetWeight}
                  setActiveSave={setActiveSave}
                />
              ) :
                <></>
              }
            </div>
          </TabsContent>

          <TabsContent value="account" className="space-y-6">
            <AccountSettings user={userData} setActiveSave={setActiveSave} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

