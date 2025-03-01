import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Droplets, Plus, Minus } from "lucide-react"
import Button from "@/components/ui/button"

export default function WaterIntake({ consumed, goal }) {
  const percentage = (consumed / goal) * 100

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-md">Water Intake</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center mb-4">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 rounded-full border-4 border-blue-100"></div>
            <div
              className="absolute bottom-0 left-0 right-0 bg-blue-500 rounded-b-full transition-all duration-500"
              style={{ height: `${percentage}%`, borderRadius: percentage === 100 ? "9999px" : "0 0 9999px 9999px" }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <Droplets className="h-6 w-6 text-blue-500 mb-1" />
              <span className="font-bold text-lg">
                {consumed}/{goal}
              </span>
            </div>
          </div>
        </div>

        <div className="text-center mb-4">
          <p className="text-sm text-muted-foreground">
            {consumed < goal ? `${goal - consumed} more cups to reach your goal` : "Daily goal reached! Great job!"}
          </p>
        </div>

        <div className="flex justify-center gap-4">
          <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
            <Minus className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

