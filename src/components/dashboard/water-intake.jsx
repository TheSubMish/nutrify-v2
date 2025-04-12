import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Droplets, Plus, Minus } from "lucide-react"
import { useState, useEffect } from "react"

export default function WaterIntake({ initialConsumed, goal }) {
  // const [consumed, setConsumed] = useState(initialConsumed)
  
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  const [consumed, setConsumed] = useState(() => {
    const saved = JSON.parse(localStorage.getItem('water-consumed'));
    if (saved && Date.now() - saved.timestamp < ONE_DAY_MS) {
      return saved.value;
    }
    return 0;
  });

  useEffect(() => {
    localStorage.setItem('water-consumed', JSON.stringify({
      value: consumed,
      timestamp: Date.now(),
    }));
  }, [consumed]);
  
  const percentage = (consumed / goal) * 100

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-md">Water Intake</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center mb-4">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 rounded-full border-4 border-blue-200 overflow-hidden">
              <div
                className="absolute bottom-0 left-0 right-0 bg-blue-400 rounded-b-full transition-all duration-500"
                style={{ height: `${percentage}%`, borderRadius: percentage === 100 ? "9999px" : "0 0 9999px 9999px" }}
              ></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <Droplets className="h-6 w-6 text-blue-00 mb-1" />
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
          {/* <Button 
            variant="outline"
            size="icon"
            disabled={false}
            className="h-8 w-8 rounded-full"
            onClick={() => setConsumed((prev) => Math.min(prev - 1, goal))}
          > */}
          <Minus
            className="h-8 w-8 text-secondary stroke-[#4A90E2] cursor-pointer font-bold "
            onClick={() => setConsumed((prev) => Math.min(prev - 1, goal))}
          />
          {/* </Button> */}
          {/* <Button 
            variant="outline"
            size="icon"
            disabled={false}
            className="h-8 w-8 rounded-full"
            onClick={() => setConsumed((prev) => Math.max(prev + 1, 0))}
          > */}
          <Plus
            className="h-8 w-8 text-secondary stroke-[#4A90E2] cursor-pointer font-bold "
            onClick={() => setConsumed((prev) => Math.max(prev + 1, 0))}
          />
          {/* </Button> */}
        </div>
      </CardContent>
    </Card>
  )
}

