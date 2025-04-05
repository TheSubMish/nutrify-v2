import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Input from "@/components/ui/input"
import Label from "@/components/ui/Label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { useAppStore } from "@/store"
import { toast } from "sonner"
import { useState, useEffect } from "react"

export default function FitnessGoals({ setActiveSave }) {
  const [loading, setLoading] = useState(true)
  const { userGoals, setUserGoals, user } = useAppStore()

  useEffect(() => {
    if (!user) {
      toast.error("Please log in to view your fitness goals.")
      setLoading(true)
      return
    }

    if (userGoals && Object.keys(userGoals).length > 0) {
      setLoading(false)
      return
    }

    const fetchUserGoals = async () => {

      const response = await fetch(`/api/fitness-goals`)

      if (response.ok) {

        const data = await response.json()

        const defaultGoals = {
          targetWeight: 0,
          weeklyLoss: 0.5,
          calorieGoal: 0,
          proteinGoal: 0,
          carbsGoal: 0,
          fatGoal: 0,
          fiberGoal: 0,
          sugarGoal: 0,
          activityLevel: "moderate"
        };

        if (data.data) {
          const goalsData = data.data;

          setUserGoals({
            targetWeight: goalsData.target_weight ?? defaultGoals.targetWeight,
            weeklyLoss: goalsData.weekly_loss ?? defaultGoals.weeklyLoss,
            calorieGoal: goalsData.calorie_goal ?? defaultGoals.calorieGoal,
            proteinGoal: goalsData.protein_goal ?? defaultGoals.proteinGoal,
            carbsGoal: goalsData.carbs_goal ?? defaultGoals.carbsGoal,
            fatGoal: goalsData.fat_goal ?? defaultGoals.fatGoal,
            fiberGoal: goalsData.fiber_goal ?? defaultGoals.fiberGoal,
            sugarGoal: goalsData.sugar_goal ?? defaultGoals.sugarGoal,
            activityLevel: goalsData.activity_level ?? defaultGoals.activityLevel,
          });

        } else {
          // If no data at all, use all defaults
          setUserGoals(defaultGoals);
        }
        setLoading(false)

      } else {
        setLoading(false)
        toast.error("Failed to fetch fitness goals")
      }
    }
    fetchUserGoals()
  }, [])

  const handleInputChange = (e) => {
    const { id, value } = e.target
    const currentGoals = userGoals;
    const updatedGoals = { ...currentGoals, [id]: value };
    setUserGoals(updatedGoals);
    setActiveSave(true)
  }

  const handleSliderChange = (value) => {
    const weeklyLoss = value[0] / 10
    const currentGoals = userGoals;
    const updatedGoals = { ...currentGoals, weeklyLoss: weeklyLoss };
    setUserGoals(updatedGoals);
    setActiveSave(true)
    console.log(userGoals);
    
  }

  const handleSelectChange = (value) => {
    const currentGoals = userGoals;
    const updatedGoals = { ...currentGoals, activityLevel: value };
    setUserGoals(updatedGoals);
    setActiveSave(true)
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-xl font-medium">Loading Fitness Goals...</p>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fitness Goals</CardTitle>
        <CardDescription>Set your health and fitness objectives</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="targetWeight" className="font-bold">Target Weight (kg)</Label>
          <Input id="targetWeight" value={userGoals.targetWeight} type="number" onChange={handleInputChange} />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="weeklyLoss" className="font-bold">Weekly Weight Change (kg)</Label>
            <span className="text-sm text-muted-foreground">{userGoals.weeklyLoss} kg/week</span>
          </div>
          <Slider id="weeklyLoss" value={[userGoals.weeklyLoss * 10]} max={10} step={1} className="py-4" onValueChange={handleSliderChange} />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>-1.0 kg</span>
            <span>-0.5 kg</span>
            <span>Maintain</span>
            <span>+0.5 kg</span>
            <span>+1.0 kg</span>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <Label htmlFor="activityLevel" className="font-bold">Activity Level</Label>
          <Select value={userGoals.activityLevel} onValueChange={handleSelectChange} >
            <SelectTrigger id="activityLevel">
              <SelectValue placeholder="Select activity level" />
            </SelectTrigger>
            <SelectContent className="background">
              <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
              <SelectItem value="light">Lightly active (light exercise 1-3 days/week)</SelectItem>
              <SelectItem value="moderate">Moderately active (moderate exercise 3-5 days/week)</SelectItem>
              <SelectItem value="active">Active (hard exercise 6-7 days/week)</SelectItem>
              <SelectItem value="very-active">Very active (very hard exercise & physical job)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        <div className="space-y-4">
          <Label className="font-bold">Daily Nutrient Goals</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="calorieGoal" className="text-sm font-bold">
                Calories (kcal)
              </Label>
              <Input id="calorieGoal" value={userGoals.calorieGoal} type="number" onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="proteinGoal" className="text-sm font-bold">
                Protein (g)
              </Label>
              <Input id="proteinGoal" value={userGoals.proteinGoal} type="number" onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="carbsGoal" className="text-sm font-bold">
                Carbs (g)
              </Label>
              <Input id="carbsGoal" value={userGoals.carbsGoal} type="number" onChange={handleInputChange} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fatGoal" className="text-sm font-bold">
                Fat (g)
              </Label>
              <Input id="fatGoal" value={userGoals.fatGoal} type="number" onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fiberGoal" className="text-sm font-bold">
                Fiber (g)
              </Label>
              <Input id="fiberGoal" value={userGoals.fiberGoal} type="number" onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sugarGoal" className="text-sm font-bold">
                Sugar (g)
              </Label>
              <Input id="sugarGoal" value={userGoals.sugarGoal} type="number" onChange={handleInputChange} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

