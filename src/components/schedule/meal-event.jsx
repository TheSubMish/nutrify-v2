"use client"

import { cn } from "@/lib/utils"
import { Utensils, Coffee, Apple, Drumstick, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Button from "@/components/ui/button"

// Map meal types to icons and colors
const mealTypeConfig = {
  breakfast: {
    icon: Coffee,
    bgColor: "bg-[#f3e6ff] dark:bg-[#6a0dad]/10", // soft violet background
    borderColor: "border-[#c084fc] dark:border-[#6a0dad]",
    textColor: "text-[#6a0dad]",
  },
  lunch: {
    icon: Utensils,
    bgColor: "bg-[#d4f3ef] dark:bg-[#147870]/30", // soft teal background
    borderColor: "border-[#60cfc7] dark:border-[#147870]",
    textColor: "text-[#147870]",
  },
  dinner: {
    icon: Drumstick,
    bgColor: "bg-[#fce4ec] dark:bg-[#ff4081]/30", // soft pink background
    borderColor: "border-[#f48fb1] dark:border-[#ff4081]",
    textColor: "text-[#ff4081]",
  },
  snack: {
    icon: Apple,
    bgColor: "bg-[#e0e0e0] dark:bg-[#374151]/30", // muted neutral
    borderColor: "border-[#9e9e9e] dark:border-[#374151]",
    textColor: "text-[#374151]",
  },
}

export default function MealEvent({ event, isDetailView = false, onEdit, onDuplicate, onDelete }) {
  const { title, type, starttime, endtime, calories, protein, carbs, fat } = event

  // Get the configuration for this meal type
  const config = mealTypeConfig[type] || {
    icon: Utensils,
    bgColor: "bg-gray-100 dark:bg-gray-800",
    borderColor: "border-gray-300 dark:border-gray-700",
    textColor: "text-gray-700 dark:text-gray-300",
  }

  const Icon = config.icon

  // Handle dropdown menu actions
  const handleEdit = (e) => {
    e.stopPropagation() // Prevent event bubbling
    onEdit(event)
  }

  const handleDuplicate = (e) => {
    e.stopPropagation() // Prevent event bubbling
    onDuplicate(event)
  }

  const handleDelete = (e) => {
    e.stopPropagation() // Prevent event bubbling
    onDelete(event)
  }

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
              {/* <Button variant="secondary" size="icon" className="h-6 w-6 ml-1 -mr-1"> */}
                <MoreHorizontal className="h-6 w-6 text-black" />
              {/* </Button> */}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
              {/* <DropdownMenuItem onClick={handleDuplicate}>Duplicate</DropdownMenuItem> */}
              <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="text-xs text-muted-foreground">
          {starttime} - {endtime}
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

