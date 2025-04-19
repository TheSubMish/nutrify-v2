"use client"

import { useState, useEffect, use } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Label from "@/components/ui/Label"
import Input from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Button from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { X, Plus } from "lucide-react"
import { toast } from "sonner"
import { useAppStore } from "@/store"

export default function DietaryPreferences({ setActiveSave }) {
  const [loading, setLoading] = useState(true)
  const { user, userPreferences, setUserPreferences } = useAppStore()
  const [initialLoad, setInitialLoad] = useState(true)

  // Replace the entire useEffect for fetching preferences with this updated version
  useEffect(() => {
    async function fetchPreferences() {

      if (userPreferences && Object.keys(userPreferences).length > 0){
        // If userPreferences is already set, skip the API call
        setLoading(false)
        setInitialLoad(false)
        return
      }

      try {
        const response = await fetch("/api/dietary-preference")
        const result = await response.json()

        if (result.data) {
          // Update the global state with API data
          setUserPreferences({
            dietType: result.data.diet_type || "balanced",
            restrictions: result.data.restrictions || [],
            allergies: result.data.allergies || [],
            dislikedFoods: result.data.disliked_foods || [],
            mealFrequency: result.data.meal_frequency || {
              breakfast: true,
              lunch: true,
              dinner: true,
              snacks: true,
            },
          })

          // Also update local state directly to ensure it's set correctly
          setAllergies(result.data.allergies || [])
          setDislikedFoods(result.data.disliked_foods || [])
          setDietType(result.data.diet_type || "balanced")
          setRestriction(
            Array.isArray(result.data.restrictions) && result.data.restrictions.length > 0
              ? result.data.restrictions[0]
              : "",
          )
          setMealFrequency(
            result.data.meal_frequency || {
              breakfast: true,
              lunch: true,
              dinner: true,
              snacks: true,
            },
          )
        }
      } catch (error) {
        toast.error("Failed to load your preferences")
      } finally {
        setLoading(false)
        setInitialLoad(false)
      }
    }

    fetchPreferences()
  }, [])

  // Initialize local state from userPreferences
  const [allergies, setAllergies] = useState([])
  const [newAllergy, setNewAllergy] = useState("")
  const [dislikedFoods, setDislikedFoods] = useState([])
  const [newDislikedFood, setNewDislikedFood] = useState("")
  const [dietType, setDietType] = useState("balanced")
  const [restriction, setRestriction] = useState("")
  const [mealFrequency, setMealFrequency] = useState({
    breakfast: true,
    lunch: true,
    dinner: true,
    snacks: true,
  })

  // Handle changes to preferences and update the save button state
  const handlePreferenceChange = () => {
    const updatedPreferences = {
      dietType,
      restrictions: restriction ? [restriction] : [],
      allergies,
      dislikedFoods,
      mealFrequency,
    }

    setUserPreferences(updatedPreferences)
    setActiveSave(true)
  }

  // Add and remove allergies
  const addAllergy = () => {
    if (newAllergy && !allergies.includes(newAllergy)) {
      const newAllergies = [...allergies, newAllergy]
      setAllergies(newAllergies)
      setNewAllergy("")
    }
  }

  const removeAllergy = (item) => {
    setAllergies(allergies.filter((a) => a !== item))
  }

  // Add and remove disliked foods
  const addDislikedFood = () => {
    if (newDislikedFood && !dislikedFoods.includes(newDislikedFood)) {
      const newDislikedFoodsList = [...dislikedFoods, newDislikedFood]
      setDislikedFoods(newDislikedFoodsList)
      setNewDislikedFood("")
    }
  }

  const removeDislikedFood = (item) => {
    setDislikedFoods(dislikedFoods.filter((f) => f !== item))
  }

  // Handle meal frequency changes
  const toggleMealFrequency = (meal) => {
    const updatedMealFrequency = {
      ...mealFrequency,
      [meal]: !mealFrequency[meal],
    }
    setMealFrequency(updatedMealFrequency)
  }

  // Handle diet type change
  const handleDietTypeChange = (value) => {
    setDietType(value)
  }

  // Handle restriction change
  const handleRestrictionChange = (value) => {
    setRestriction(value)
  }

  useEffect(() => {
    handlePreferenceChange()
  },[dislikedFoods, restriction, dietType, mealFrequency, allergies])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dietary Preferences</CardTitle>
        <CardDescription>Customize your meal plans based on your dietary needs and preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="dietType" className="font-bold">
              Diet Type
            </Label>
            <Select value={dietType} onValueChange={handleDietTypeChange}>
              <SelectTrigger id="dietType">
                <SelectValue placeholder="Select diet type" />
              </SelectTrigger>
              <SelectContent className="background">
                <SelectItem value="balanced">Balanced</SelectItem>
                <SelectItem value="low-carb">Low Carb</SelectItem>
                <SelectItem value="high-protein">High Protein</SelectItem>
                <SelectItem value="keto">Ketogenic</SelectItem>
                <SelectItem value="vegetarian">Vegetarian</SelectItem>
                <SelectItem value="vegan">Vegan</SelectItem>
                <SelectItem value="paleo">Paleo</SelectItem>
                <SelectItem value="mediterranean">Mediterranean</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="restrictions" className="font-bold">
              Dietary Restrictions
            </Label>
            <Select value={restriction} onValueChange={handleRestrictionChange}>
              <SelectTrigger id="restrictions">
                <SelectValue placeholder="Select restrictions" />
              </SelectTrigger>
              <SelectContent className="background">
                <SelectItem value="low-sodium">Low Sodium</SelectItem>
                <SelectItem value="low-sugar">Low Sugar</SelectItem>
                <SelectItem value="gluten-free">Gluten Free</SelectItem>
                <SelectItem value="dairy-free">Dairy Free</SelectItem>
                <SelectItem value="nut-free">Nut Free</SelectItem>
                <SelectItem value="halal">Halal</SelectItem>
                <SelectItem value="kosher">Kosher</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <Label className="font-bold">Allergies & Intolerances</Label>
          <div className="flex flex-wrap gap-2">
            {allergies.map((allergy, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1 secondary-bg">
                {allergy}
                <button onClick={() => removeAllergy(allergy)} className="ml-1 rounded-full hover:bg-muted">
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove {allergy}</span>
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Add allergy or intolerance"
              value={newAllergy}
              onChange={(e) => setNewAllergy(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addAllergy()}
            />
            <Button type="button" size="sm" onClick={addAllergy}>
              <Plus className="h-4 w-4" />
              <span className="sr-only">Add</span>
            </Button>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <Label className="font-bold">Disliked Foods</Label>
          <div className="flex flex-wrap gap-2">
            {dislikedFoods.map((food, index) => (
              <Badge key={index} variant="outline" className="flex items-center gap-1 secondary-bg">
                {food}
                <button onClick={() => removeDislikedFood(food)} className="ml-1 rounded-full hover:bg-muted">
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove {food}</span>
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Add disliked food"
              value={newDislikedFood}
              onChange={(e) => setNewDislikedFood(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addDislikedFood()}
            />
            <Button type="button" size="sm" onClick={addDislikedFood}>
              <Plus className="h-4 w-4" />
              <span className="sr-only">Add</span>
            </Button>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <Label className="font-bold">Meal Frequency</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="breakfast"
                className="rounded border-gray-300"
                checked={mealFrequency.breakfast}
                onChange={() => toggleMealFrequency("breakfast")}
              />
              <Label htmlFor="breakfast" className="text-sm font-normal">
                Breakfast
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="lunch"
                className="rounded border-gray-300"
                checked={mealFrequency.lunch}
                onChange={() => toggleMealFrequency("lunch")}
              />
              <Label htmlFor="lunch" className="text-sm font-normal">
                Lunch
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="dinner"
                className="rounded border-gray-300"
                checked={mealFrequency.dinner}
                onChange={() => toggleMealFrequency("dinner")}
              />
              <Label htmlFor="dinner" className="text-sm font-normal">
                Dinner
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="snacks"
                className="rounded border-gray-300"
                checked={mealFrequency.snacks}
                onChange={() => toggleMealFrequency("snacks")}
              />
              <Label htmlFor="snacks" className="text-sm font-normal">
                Snacks
              </Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

