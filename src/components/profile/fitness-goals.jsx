import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Input from "@/components/ui/input"
import Label from "@/components/ui/Label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"

export default function FitnessGoals({ goals, setActiveSave }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fitness Goals</CardTitle>
        <CardDescription>Set your health and fitness objectives</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="targetWeight" className="font-bold">Target Weight (kg)</Label>
          <Input id="targetWeight" defaultValue={goals.targetWeight} type="number" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="weeklyLoss" className="font-bold">Weekly Weight Change (kg)</Label>
            <span className="text-sm text-muted-foreground">{goals.weeklyLoss} kg/week</span>
          </div>
          <Slider id="weeklyLoss" defaultValue={[goals.weeklyLoss * 10]} max={10} step={1} className="py-4" />
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
          <Select defaultValue={goals.activityLevel}>
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
              <Input id="calorieGoal" defaultValue={goals.calorieGoal} type="number" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="proteinGoal" className="text-sm font-bold">
                Protein (g)
              </Label>
              <Input id="proteinGoal" defaultValue={goals.proteinGoal} type="number" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="carbsGoal" className="text-sm font-bold">
                Carbs (g)
              </Label>
              <Input id="carbsGoal" defaultValue={goals.carbsGoal} type="number" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fatGoal" className="text-sm font-bold">
                Fat (g)
              </Label>
              <Input id="fatGoal" defaultValue={goals.fatGoal} type="number" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fiberGoal" className="text-sm font-bold">
                Fiber (g)
              </Label>
              <Input id="fiberGoal" defaultValue="25" type="number" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sugarGoal" className="text-sm font-bold">
                Sugar (g)
              </Label>
              <Input id="sugarGoal" defaultValue="50" type="number" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

