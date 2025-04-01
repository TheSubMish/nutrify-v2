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
  const [userData, setUser] = useState({
    id: user?.id || "",
    name: user?.name || "Full Name",
    email: user?.email || "youremail@mail.com",
    avatar: user?.avatar,
    joinDate: user?.created_at ? formatDate(user.created_at) : formatDate(),
    metrics: {
      age: 32,
      height: 175,
      weight: 78,
      bmi: 25.5,
      bodyFat: 18.2,
      chest: undefined,
      waist: undefined,
      hips: undefined,
      weightHistory: [
        { date: "2025-01-01", value: 82 },
        { date: "2025-01-15", value: 80 },
        { date: "2025-02-01", value: 79 },
        { date: "2025-02-15", value: 78 },
        { date: "2025-03-01", value: 78 },
      ],
    },
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
  })

  const [activeSave, setActiveSave] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!user) {
      toast.error("Please log in to access your profile.");
      return;
    }

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        toast.error("Error fetching profile data.");
      } else {
        setUser((prev) => ({
          ...prev,
          ...data,
          name: data.full_name || prev.name,
          avatar: data.avatar_url || prev.avatar,
          joinDate: data.created_at ? formatDate(data.created_at) : prev.joinDate,
          metrics: {
            ...prev.metrics,
            age: data.age ?? prev.metrics.age,
            height: data.height ?? prev.metrics.height,
            weight: data.weight ?? prev.metrics.weight,
            bmi: data.bmi ?? prev.metrics.bmi,
            bodyFat: data.body_fat ?? prev.metrics.bodyFat,
          },
          preferences: {
            ...prev.preferences,
            dietType: data.diet_type || prev.preferences.dietType,
            allergies: data.allergies || prev.preferences.allergies,
            restrictions: data.dietary_restrictions || prev.preferences.restrictions,
          },
          goals: {
            ...prev.goals,
            targetWeight: data.target_weight ?? prev.goals.targetWeight,
            weeklyLoss: data.weekly_weight_loss ?? prev.goals.weeklyLoss,
            calorieGoal: data.calorie_goal ?? prev.goals.calorieGoal,
            proteinGoal: data.protein_goal ?? prev.goals.proteinGoal,
            activityLevel: data.activity_level || prev.goals.activityLevel,
          },
        }));
      }
    };
    console.log(userData);

    fetchProfile();
    console.log("user profile fetched");

  }, []);

  const handleSaveChanges = async () => {
    setIsLoading(true)

    const { id, ...metrics } = userData.metrics

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
              Save Changes
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
              initialMetrics={userData.metrics} setActiveSave={setActiveSave} setMetrics={(newMetrics) => setUser(prev => ({
                ...prev,
                metrics: newMetrics
              }))} 
            />
          </TabsContent>

          <TabsContent value="diet" className="space-y-6">
            <DietaryPreferences preferences={userData.preferences} setActiveSave={setActiveSave} />
          </TabsContent>

          <TabsContent value="goals" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FitnessGoals goals={userData.goals} setActiveSave={setActiveSave} />
              {userData?.metrics?.weightHistory && userData?.goals?.targetWeight ? (
                <ProgressTracker
                  weightHistory={userData.metrics.weightHistory}
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

