"use client"

import { useEffect, useState } from "react"
import ProfileHeader from "./profile-header"
import HealthMetrics from "./health-metrics"
import DietaryPreferences from "./dietary-preferences"
import FitnessDashboard from "./fitness-dashboard"
import AccountSettings from "./account-settings"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Button from "@/components/ui/button"
import { Save, RefreshCw } from "lucide-react"
import { useAppStore } from "@/store"
import { formatDate } from "@/utils/formatDate"
import { supabase } from "@/supabase.config.mjs"
import { toast } from "sonner"
import { saveHealthMetrics } from "@/utils/savehealthMetrics"
import { useRouter } from "next/navigation"

export default function Profile() {
  const [activeTab, setActiveTab] = useState("personal")
  const { user, userMetrics, setUserMetrics, userPreferences, userGoals, userSettings } = useAppStore()
  const [userData, setUser] = useState({})
  const router = useRouter()
  const [activeSave, setActiveSave] = useState(false)
  const [isLoading, setIsLoading] = useState(false) // for save changes loading state
  const [loading, setLoading] = useState(true) // for initial loading state

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
      toast.error("Please log in to access your profile.");
      return;
    }

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

  }, [user]);

  const handleSaveChanges = async () => {
    setIsLoading(true)

    const { id, ...metrics } = userMetrics;

    let result;
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
      case "diet":
        const dietResponse = await fetch('/api/dietary-preference', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userData.id,
            preferences: userPreferences
          }),
        });

        result = await dietResponse.json();

        if (!result.success) {
          toast.error(result.message);
        } else {
          setActiveSave(false)
          toast.success("Dietary preferences updated successfully!");
        }
        break;

        case "goals":
          
          const fitnessGoalsResponse = await fetch('/api/fitness-goals', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: userData.id,
              fitness_goals: userGoals
            }),
          });
  
          result = await fitnessGoalsResponse.json();
  
          if (!result.success) {
            toast.error(result.message);
          } else {
            setActiveSave(false)
            toast.success("Dietary preferences updated successfully!");
          }
          break;
        
      case "account":
        const accountResponse = await fetch('/api/account-setting', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userData.id,
            user_setting: userSettings
          }),
        });

        result = await accountResponse.json();

        if (!result.success) {
          toast.error(result.message);
        } else {
          setActiveSave(false)
          toast.success("Account settings updated successfully!");
        }
        break;

      default:
        break;
    }
    setIsLoading(false)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const handleTabChange = (value) => {
    if (activeSave) {
      const confirmLeave = window.confirm("You have unsaved changes. Do you want to leave without saving?");
      
      if (confirmLeave) {
        setActiveTab(value);
        setActiveSave(false);
      } else {
        setActiveTab(activeTab);
        setActiveSave(true);
        toast.error("Please save your changes before switching tabs.");
      }
    } else {
      setActiveTab(value);
    }
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
            <Button size="sm" onClick={handleSaveChanges} disabled={!activeSave || isLoading} >
              <Save className="mr-2 h-4 w-4" />
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        <ProfileHeader user={userData} setUser={setUser} />

        <Tabs value={activeTab} onValueChange={(activeTab) => { handleTabChange(activeTab) }} className="mt-8">
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
            <DietaryPreferences setActiveSave={setActiveSave} />
          </TabsContent>

          <TabsContent value="goals" className="space-y-6">
            <FitnessDashboard setActiveSave={setActiveSave} />
          </TabsContent>

          <TabsContent value="account" className="space-y-6">
            <AccountSettings user={userData} setActiveSave={setActiveSave} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

