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
          // Ensure data is an array before setting state
          if (Array.isArray(data)) {
            setUserMeals(data)
          } else {
            console.error("API returned non-array data:", data)
            setUserMeals([]) // Set to empty array as fallback
          }
          setLoading(false)
        }
      } catch (error) {
        console.error("Error fetching meals:", error)
        if (isMounted) {
          setUserMeals([]) // Set to empty array on error
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
    // Ensure userMeals is an array before filtering
    if (!Array.isArray(userMeals) || userMeals.length === 0) {
      console.log("userMeals is not an array or is empty:", userMeals)
      return []
    }

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0] // "2025-04-12"
    console.log("Today's date for comparison:", today)

    return userMeals.filter((meal) => {
      if (!meal || !meal.date) {
        console.log("Invalid meal object:", meal)
        return false
      }
      // Extract just the date part from the meal date
      const mealDate = typeof meal.date === "string" ? meal.date.split("T")[0] : ""
      console.log(`Comparing meal "${meal.title || meal.name}": ${mealDate} with today: ${today}`)
      return mealDate === today
    })
  }, [userMeals])

  // Calculate nutrition totals from today's meals
  // Goals include ALL meals for the day (logged or not)
  const nutritionGoals = useMemo(() => {
    if (!Array.isArray(todayMeals) || todayMeals.length === 0) {
      return {
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
        breakfastCalories: 0,
        lunchCalories: 0,
        dinnerCalories: 0,
        snackCalories: 0,
      }
    }

    // Initialize totals
    let totalCalories = 0
    let totalProtein = 0
    let totalCarbs = 0
    let totalFat = 0
    let breakfastCalories = 0
    let lunchCalories = 0
    let dinnerCalories = 0
    let snackCalories = 0

    // Sum up all values for ALL meals (this is the goal)
    todayMeals.forEach((meal) => {
      // Add to total macros
      totalCalories += meal.calories || 0
      totalProtein += meal.protein || 0
      totalCarbs += meal.carbs || 0
      totalFat += meal.fat || 0

      // Add to meal type calories
      switch ((meal.type || "").toLowerCase()) {
        case "breakfast":
          breakfastCalories += meal.calories || 0
          break
        case "lunch":
          lunchCalories += meal.calories || 0
          break
        case "dinner":
          dinnerCalories += meal.calories || 0
          break
        case "snack":
          snackCalories += meal.calories || 0
          break
        default:
          break
      }
    })

    return {
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
      breakfastCalories,
      lunchCalories,
      dinnerCalories,
      snackCalories,
    }
  }, [todayMeals])

  // Calculate consumed nutrition from LOGGED meals only
  const consumedNutrition = useMemo(() => {
    if (!Array.isArray(todayMeals) || todayMeals.length === 0) {
      return {
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
        breakfastCalories: 0,
        lunchCalories: 0,
        dinnerCalories: 0,
        snackCalories: 0,
      }
    }

    // Initialize totals
    let totalCalories = 0
    let totalProtein = 0
    let totalCarbs = 0
    let totalFat = 0
    let breakfastCalories = 0
    let lunchCalories = 0
    let dinnerCalories = 0
    let snackCalories = 0

    // Filter for logged meals only and sum up their values
    const loggedMeals = todayMeals.filter((meal) => Boolean(meal.logged_at))

    loggedMeals.forEach((meal) => {
      // Add to total macros
      totalCalories += meal.calories || 0
      totalProtein += meal.protein || 0
      totalCarbs += meal.carbs || 0
      totalFat += meal.fat || 0

      // Add to meal type calories
      switch ((meal.type || "").toLowerCase()) {
        case "breakfast":
          breakfastCalories += meal.calories || 0
          break
        case "lunch":
          lunchCalories += meal.calories || 0
          break
        case "dinner":
          dinnerCalories += meal.calories || 0
          break
        case "snack":
          snackCalories += meal.calories || 0
          break
        default:
          break
      }
    })

    return {
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
      breakfastCalories,
      lunchCalories,
      dinnerCalories,
      snackCalories,
    }
  }, [todayMeals])

  // Calculate remaining calories
  const remainingCalories = Math.max(0, nutritionGoals.totalCalories - consumedNutrition.totalCalories)

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
                consumed={consumedNutrition.totalCalories}
                goal={nutritionGoals.totalCalories}
                remaining={remainingCalories}
                breakfast={consumedNutrition.breakfastCalories}
                lunch={consumedNutrition.lunchCalories}
                snack={consumedNutrition.snackCalories}
                dinner={consumedNutrition.dinnerCalories}
              />
              <NutritionChart
                protein={consumedNutrition.totalProtein}
                carbs={consumedNutrition.totalCarbs}
                fat={consumedNutrition.totalFat}
                proteinGoal={nutritionGoals.totalProtein}
                carbsGoal={nutritionGoals.totalCarbs}
                fatGoal={nutritionGoals.totalFat}
              />
              <WaterIntake initialConsumed={5} goal={8} />
              {/* <AirQualityIndex /> */}
            </div>

            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Today's Meals</h2>
                <div className="flex gap-2">
                  {/* <div className="text-sm text-muted-foreground">
                    <span className="font-medium">{consumedNutrition.totalCalories}</span> /{" "}
                    {nutritionGoals.totalCalories} kcal consumed
                  </div> */}
                  <Button variant="outline" size="sm" onClick={() => setIsModalOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Meal
                  </Button>
                </div>
              </div>

              {Array.isArray(todayMeals) && todayMeals.length > 0 ? (
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
          if (Array.isArray(newMeals) && newMeals.length > 0) {
            setUserMeals((prevMeals) => {
              // Ensure prevMeals is an array
              const currentMeals = Array.isArray(prevMeals) ? prevMeals : []
              return [...currentMeals, ...newMeals]
            })
          }
        }}
      />
    </div>
  )
}

