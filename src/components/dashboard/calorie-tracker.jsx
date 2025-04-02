import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Flame } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function CalorieTracker({ consumed, goal, remaining, breakfast, lunch, snack, dinner }) {
  const percentage = Math.round((consumed / goal) * 100)

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-md">Calorie Tracker</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-[#ffe2ec] flex items-center justify-center mr-3">
              <Flame className="h-6 w-6 text-[#FF4081]" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Consumed</p>
              <p className="text-2xl font-bold">{consumed}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Remaining</p>
            <p className="text-2xl font-bold">{remaining}</p>
          </div>
        </div>

        <div className="w-full rounded-full h-3 mb-4">
          <Progress value={percentage} className="h-2 bg-[#ffe2ec]" indicatorClassName="bg-[#FF4081]" />
          {/* <div className="bg-orange-500 h-3 rounded-full" style={{ width: `${percentage}%` }}></div> */}
        </div>

        <div className="text-xs text-center mb-4">
          <span className="text-muted-foreground">Daily Goal: </span>
          <span className="font-medium">{goal} calories</span>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="bg-[#ffe2ec] p-2 rounded-md">
            <p className="text-xs text-muted-foreground">Breakfast</p>
            <p className="font-medium">{breakfast}</p>
          </div>
          <div className="bg-[#ffe2ec] p-2 rounded-md">
            <p className="text-xs text-muted-foreground">Lunch</p>
            <p className="font-medium">{lunch}</p>
          </div>
          <div className="bg-[#ffe2ec] p-2 rounded-md">
            <p className="text-xs text-muted-foreground">Snack</p>
            <p className="font-medium">{snack}</p>
          </div>
          <div className="bg-[#ffe2ec] p-2 rounded-md">
            <p className="text-xs text-muted-foreground">Dinner</p>
            <p className="font-medium">{dinner}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

