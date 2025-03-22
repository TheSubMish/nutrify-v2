"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import Button from "@/components/ui/button"
import Label from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Zap } from "lucide-react"

export default function ScheduleTemplateGenerator({ isOpen, onClose, onGenerate }) {
  const [formData, setFormData] = useState({
    goal: "weight-loss",
    calorieTarget: 2000,
    mealsPerDay: 4,
    dietType: "balanced",
    activityLevel: "moderate",
    generateFor: "week",
    includeSnacks: true,
    preferredCuisines: ["mediterranean", "asian"],
    allergies: [],
    excludeIngredients: [],
  })

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onGenerate(formData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Generate Meal Schedule</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 pt-4">
            <div className="grid gap-2">
              <Label htmlFor="goal">Your Goal</Label>
              <Select value={formData.goal} onValueChange={(value) => handleChange("goal", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weight-loss">Weight Loss</SelectItem>
                  <SelectItem value="muscle-gain">Muscle Gain</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="health">General Health</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="activityLevel">Activity Level</Label>
              <Select value={formData.activityLevel} onValueChange={(value) => handleChange("activityLevel", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select activity level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                  <SelectItem value="light">Light (exercise 1-3 days/week)</SelectItem>
                  <SelectItem value="moderate">Moderate (exercise 3-5 days/week)</SelectItem>
                  <SelectItem value="active">Active (exercise 6-7 days/week)</SelectItem>
                  <SelectItem value="very-active">Very Active (intense exercise daily)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="generateFor">Generate For</Label>
              <Select value={formData.generateFor} onValueChange={(value) => handleChange("generateFor", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Single Day</SelectItem>
                  <SelectItem value="week">Full Week</SelectItem>
                  <SelectItem value="month">Full Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="nutrition" className="space-y-4 pt-4">
            <div className="grid gap-2">
              <div className="flex justify-between">
                <Label htmlFor="calorieTarget">Daily Calorie Target: {formData.calorieTarget}</Label>
              </div>
              <Slider
                id="calorieTarget"
                min={1200}
                max={4000}
                step={50}
                value={[formData.calorieTarget]}
                onValueChange={(value) => handleChange("calorieTarget", value[0])}
              />
            </div>

            <div className="grid gap-2">
              <div className="flex justify-between">
                <Label htmlFor="mealsPerDay">Meals Per Day: {formData.mealsPerDay}</Label>
              </div>
              <Slider
                id="mealsPerDay"
                min={3}
                max={6}
                step={1}
                value={[formData.mealsPerDay]}
                onValueChange={(value) => handleChange("mealsPerDay", value[0])}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="dietType">Diet Type</Label>
              <Select value={formData.dietType} onValueChange={(value) => handleChange("dietType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select diet type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="balanced">Balanced</SelectItem>
                  <SelectItem value="high-protein">High Protein</SelectItem>
                  <SelectItem value="low-carb">Low Carb</SelectItem>
                  <SelectItem value="keto">Ketogenic</SelectItem>
                  <SelectItem value="vegetarian">Vegetarian</SelectItem>
                  <SelectItem value="vegan">Vegan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="includeSnacks"
                checked={formData.includeSnacks}
                onCheckedChange={(checked) => handleChange("includeSnacks", checked)}
              />
              <Label htmlFor="includeSnacks">Include Snacks</Label>
            </div>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-4 pt-4">
            <div className="grid gap-2">
              <Label htmlFor="preferredCuisines">Preferred Cuisines</Label>
              <Select
                value={formData.preferredCuisines[0]}
                onValueChange={(value) =>
                  handleChange("preferredCuisines", [value, ...formData.preferredCuisines.slice(1)])
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select primary cuisine" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mediterranean">Mediterranean</SelectItem>
                  <SelectItem value="asian">Asian</SelectItem>
                  <SelectItem value="mexican">Mexican</SelectItem>
                  <SelectItem value="italian">Italian</SelectItem>
                  <SelectItem value="american">American</SelectItem>
                  <SelectItem value="indian">Indian</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="allergies">Allergies</Label>
              <Select
                value={formData.allergies[0] || ""}
                onValueChange={(value) => handleChange("allergies", value ? [value] : [])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select allergies (if any)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="gluten">Gluten</SelectItem>
                  <SelectItem value="dairy">Dairy</SelectItem>
                  <SelectItem value="nuts">Nuts</SelectItem>
                  <SelectItem value="shellfish">Shellfish</SelectItem>
                  <SelectItem value="soy">Soy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            <Zap className="mr-2 h-4 w-4" />
            Generate Schedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

