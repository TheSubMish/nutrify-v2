import { cn } from "@/lib/utils"
import { Utensils, Coffee, Apple, Drumstick, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Button from "@/components/ui/button"

// Map meal types to icons and colors
const mealTypeConfig = {
  breakfast: {
    icon: Coffee,
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    borderColor: "border-blue-300 dark:border-blue-700",
    textColor: "text-blue-700 dark:text-blue-300",
  },
  lunch: {
    icon: Utensils,
    bgColor: "bg-green-100 dark:bg-green-900/30",
    borderColor: "border-green-300 dark:border-green-700",
    textColor: "text-green-700 dark:text-green-300",
  },
  dinner: {
    icon: Drumstick,
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
    borderColor: "border-purple-300 dark:border-purple-700",
    textColor: "text-purple-700 dark:text-purple-300",
  },
  snack: {
    icon: Apple,
    bgColor: "bg-amber-100 dark:bg-amber-900/30",
    borderColor: "border-amber-300 dark:border-amber-700",
    textColor: "text-amber-700 dark:text-amber-300",
  },
}

export default function MealEvent({ event, isDetailView = false }) {
  const { title, type, startTime, endTime, calories, protein, carbs, fat } = event

  // Get the configuration for this meal type
  const config = mealTypeConfig[type] || {
    icon: Utensils,
    bgColor: "bg-gray-100 dark:bg-gray-800",
    borderColor: "border-gray-300 dark:border-gray-700",
    textColor: "text-gray-700 dark:text-gray-300",
  }

  const Icon = config.icon

  return (
    <div
      className={cn(
        "rounded-md border p-2 mb-1 cursor-pointer",
        config.bgColor,
        config.borderColor,
        isDetailView ? "flex items-start gap-3" : "text-xs",
      )}
    >
      <div className={cn("flex items-center gap-1", isDetailView ? "mt-0.5" : "")}>
        <Icon className={cn("shrink-0", config.textColor, isDetailView ? "h-5 w-5" : "h-3 w-3")} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <div className={cn("font-medium truncate", config.textColor)}>{title}</div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6 ml-1 -mr-1">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuItem>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="text-xs text-muted-foreground">
          {startTime} - {endTime}
        </div>

        {isDetailView && (
          <div className="grid grid-cols-4 gap-2 mt-2 text-xs">
            <div>
              <div className="font-medium">Calories</div>
              <div>{calories}</div>
            </div>
            <div>
              <div className="font-medium">Protein</div>
              <div>{protein}g</div>
            </div>
            <div>
              <div className="font-medium">Carbs</div>
              <div>{carbs}g</div>
            </div>
            <div>
              <div className="font-medium">Fat</div>
              <div>{fat}g</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

