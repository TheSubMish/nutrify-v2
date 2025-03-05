"use client"

import { useState } from "react"
import { AppSidebar } from "./app-sidebar"
import MealCard from "./meal-card"
import NutritionChart from "./nutrition-chart"
import AIRecommendation from "./ai-recommendation"
import CalorieTracker from "./calorie-tracker"
import WaterIntake from "./water-intake"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import Button from "@/components/ui/button"
import { PlusCircle, RefreshCw, Zap } from "lucide-react"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  // Sample data - would come from API in real implementation
  const meals = [
    {
      id: 1,
      type: "Breakfast",
      time: "8:00 AM",
      name: "Greek Yogurt Bowl",
      calories: 320,
      protein: 22,
      carbs: 40,
      fat: 8,
      image: "/placeholder.svg?height=100&width=150",
    },
    {
      id: 2,
      type: "Lunch",
      time: "1:00 PM",
      name: "Grilled Chicken Salad",
      calories: 450,
      protein: 35,
      carbs: 25,
      fat: 15,
      image: "/placeholder.svg?height=100&width=150",
    },
    {
      id: 3,
      type: "Snack",
      time: "4:00 PM",
      name: "Apple & Almond Butter",
      calories: 200,
      protein: 5,
      carbs: 25,
      fat: 10,
      image: "/placeholder.svg?height=100&width=150",
    },
    {
      id: 4,
      type: "Dinner",
      time: "7:00 PM",
      name: "Salmon with Roasted Vegetables",
      calories: 520,
      protein: 40,
      carbs: 30,
      fat: 22,
      image: "/placeholder.svg?height=100&width=150",
    },
  ]

  const recommendations = [
    {
      id: 1,
      title: "Increase protein intake",
      description: "Based on your activity level, we recommend increasing your protein intake by 10g per day.",
      impact: "high",
    },
    {
      id: 2,
      title: "Try intermittent fasting",
      description: "Your metabolism pattern suggests intermittent fasting could help with your weight loss goals.",
      impact: "medium",
    },
    {
      id: 3,
      title: "Add more fiber",
      description: "Your current diet is low in fiber. Try adding more vegetables and whole grains.",
      impact: "high",
    },
  ]

  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 overflow-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Your Diet Plan</h1>
            <p className="text-muted-foreground">Monday, March 1, 2025</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Plan
            </Button>
            <Button size="sm">
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
              <WaterIntake consumed={5} goal={8} />
            </div>

            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Today's Meals</h2>
                <Button variant="outline" size="sm">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Meal
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {meals.map((meal) => (
                  <MealCard key={meal.id} meal={meal} />
                ))}
              </div>
            </div>

            {/* <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">AI Recommendations</h2>
              <div className="space-y-4">
                {recommendations.map((rec) => (
                  <AIRecommendation key={rec.id} recommendation={rec} />
                ))}
              </div>
            </div> */}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

