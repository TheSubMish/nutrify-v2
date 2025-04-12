"use client"

import { useEffect, useState, useMemo } from "react"
import MealCard from "./meal-card"
import NutritionChart from "./nutrition-chart"
import CalorieTracker from "./calorie-tracker"
import WaterIntake from "./water-intake"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import Button from "@/components/ui/button"
import { PlusCircle, Zap } from "lucide-react"
import GeneratePlanModal from "./generate-plan-modal"
import { useAppStore } from "@/store"
import { toast } from "sonner"
// import AirQualityIndex from "./aqi"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { user, userMeals, setUserMeals } = useAppStore()
  const [loading, setLoading] = useState(true)

  // This conditional check should be inside the component body, not at the top level
  // It should also return early to prevent the rest of the component from executing
  if (!user) {
    // This will cause an infinite loop if placed here!
    // toast.error("Please log in to view your dashboard.")
    // return null
  }

  useEffect(() => {
    // Check for user here instead
    if (!user) {
      toast.error("Please log in to view your dashboard.")
      return
    }

    let isMounted = true
    setLoading(true)

    const fetchMeals = async () => {
      try {
        const response = await fetch("/api/meals")
        if (!response.ok) {
          throw new Error("Failed to fetch meals")
        }
        const { data } = await response.json()

        // Only update state if component is still mounted
        if (isMounted) {
          console.log("Fetched meals:", data)
          setUserMeals(data)
          setLoading(false)
        }
      } catch (error) {
        console.error("Error fetching meals:", error)
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchMeals()

    return () => {
      isMounted = false
    }
  }, [user, setUserMeals])

  const todayMeals = useMemo(() => {
    if (!userMeals || userMeals.length === 0) {
      return []
    }

    // Get today's date in YYYY-MM-DD format dynamically
    const today = new Date().toISOString().split("T")[0]
    console.log("Today's date for comparison:", today)

    return userMeals.filter((meal) => {
      const mealDate = new Date(meal.date).toISOString().split("T")[0]
      console.log(`Comparing meal "${meal.title}": ${mealDate} with today: ${today}`)
      return mealDate === today
    })
  }, [userMeals])

  // Early return for loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  // Early return if no user
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <p className="text-muted-foreground">Please log in to view your dashboard.</p>
      </div>
    )
  }

  // Format today's date for display
  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="flex h-screen bg-background">
      {/* <AppSidebar /> */}
      <main className="flex-1 overflow-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Your Diet Plan</h1>
            <p className="text-muted-foreground">{formattedDate}</p>
          </div>
          <div className="flex gap-3">
            <Button size="sm" onClick={() => setIsModalOpen(true)}>
              <Zap className="mr-2 h-4 w-4" />
              Generate New Plan
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <CalorieTracker
                consumed={1490}
                goal={2000}
                remaining={510}
                breakfast={320}
                lunch={450}
                snack={200}
                dinner={520}
              />
              <NutritionChart protein={102} carbs={120} fat={55} proteinGoal={120} carbsGoal={150} fatGoal={65} />
              <WaterIntake initialConsumed={5} goal={8} />
              {/* <AirQualityIndex /> */}
            </div>

            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Today's Meals</h2>
                <Button variant="outline" size="sm" onClick={() => setIsModalOpen(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Meal
                </Button>
              </div>

              {todayMeals.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {todayMeals.map((meal) => (
                    <MealCard key={meal.id} meal={meal} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 border rounded-md bg-muted/10">
                  <p className="text-muted-foreground mb-4">No meals scheduled for today.</p>
                  <Button size="sm" onClick={() => setIsModalOpen(true)}>
                    <Zap className="mr-2 h-4 w-4" />
                    Generate New Plan
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <GeneratePlanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onGeneratePlan={(newMeals) => {
          // Update the meals in the store when new ones are generated
          if (newMeals && newMeals.length > 0) {
            setUserMeals([...userMeals, ...newMeals])
          }
        }}
      />
    </div>
  )
}

