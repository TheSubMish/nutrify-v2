"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function NutritionChart({ protein, carbs, fat, proteinGoal, carbsGoal, fatGoal }) {
  const proteinPercentage = (protein / proteinGoal) * 100
  const carbsPercentage = (carbs / carbsGoal) * 100
  const fatPercentage = (fat / fatGoal) * 100

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-md">Macronutrient Balance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                <span>Protein</span>
              </div>
              <span className="font-medium">
                {protein}g / {proteinGoal}g
              </span>
            </div>
            <Progress value={proteinPercentage} className="h-2 bg-blue-100" indicatorClassName="bg-blue-500" />
          </div>

          <div>
            <div className="flex justify-between mb-1 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span>Carbs</span>
              </div>
              <span className="font-medium">
                {carbs}g / {carbsGoal}g
              </span>
            </div>
            <Progress value={carbsPercentage} className="h-2 bg-green-100" indicatorClassName="bg-green-500" />
          </div>

          <div>
            <div className="flex justify-between mb-1 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                <span>Fat</span>
              </div>
              <span className="font-medium">
                {fat}g / {fatGoal}g
              </span>
            </div>
            <Progress value={fatPercentage} className="h-2 bg-amber-100" indicatorClassName="bg-amber-500" />
          </div>

          <div className="pt-2 mt-2 border-t text-xs text-muted-foreground">
            <p>AI recommendation: Increase protein intake by 10g to meet your muscle maintenance goals.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

