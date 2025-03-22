"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Button from "@/components/ui/button"
import Input from "@/components/ui/input"
import { Search } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

// Sample meal templates - would come from API in real implementation
const mealTemplates = [
  {
    id: 1,
    title: "Greek Yogurt Bowl",
    type: "breakfast",
    calories: 320,
    protein: 22,
    carbs: 40,
    fat: 8,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 2,
    title: "Avocado Toast",
    type: "breakfast",
    calories: 350,
    protein: 15,
    carbs: 35,
    fat: 18,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 3,
    title: "Grilled Chicken Salad",
    type: "lunch",
    calories: 450,
    protein: 35,
    carbs: 25,
    fat: 15,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 4,
    title: "Quinoa Bowl",
    type: "lunch",
    calories: 420,
    protein: 20,
    carbs: 50,
    fat: 12,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 5,
    title: "Salmon with Roasted Vegetables",
    type: "dinner",
    calories: 520,
    protein: 40,
    carbs: 30,
    fat: 22,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 6,
    title: "Apple & Almond Butter",
    type: "snack",
    calories: 200,
    protein: 5,
    carbs: 25,
    fat: 10,
    image: "/placeholder.svg?height=80&width=80",
  },
]

export default function MealTemplateSelector({ isOpen, onClose, onSelect }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("all")

  // Filter templates based on search query and selected type
  const filteredTemplates = mealTemplates.filter((template) => {
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === "all" || template.type === selectedType
    return matchesSearch && matchesType
  })

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Select Meal Template</DialogTitle>
        </DialogHeader>

        <div className="flex items-center space-x-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search meals..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex space-x-1">
            <Button
              size="sm"
              variant={selectedType === "all" ? "default" : "outline"}
              onClick={() => setSelectedType("all")}
            >
              All
            </Button>
            <Button
              size="sm"
              variant={selectedType === "breakfast" ? "default" : "outline"}
              onClick={() => setSelectedType("breakfast")}
            >
              Breakfast
            </Button>
            <Button
              size="sm"
              variant={selectedType === "lunch" ? "default" : "outline"}
              onClick={() => setSelectedType("lunch")}
            >
              Lunch
            </Button>
            <Button
              size="sm"
              variant={selectedType === "dinner" ? "default" : "outline"}
              onClick={() => setSelectedType("dinner")}
            >
              Dinner
            </Button>
            <Button
              size="sm"
              variant={selectedType === "snack" ? "default" : "outline"}
              onClick={() => setSelectedType("snack")}
            >
              Snack
            </Button>
          </div>
        </div>

        <ScrollArea className="h-[300px] pr-4">
          <div className="grid grid-cols-2 gap-4">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className={cn(
                  "flex items-center p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors",
                )}
                onClick={() => onSelect(template)}
              >
                <img
                  src={template.image || "/placeholder.svg"}
                  alt={template.title}
                  className="w-16 h-16 rounded-md object-cover mr-3"
                />
                <div>
                  <div className="font-medium">{template.title}</div>
                  <div className="text-xs text-muted-foreground capitalize">{template.type}</div>
                  <div className="flex items-center gap-2 mt-1 text-xs">
                    <span>{template.calories} kcal</span>
                    <span>•</span>
                    <span>P: {template.protein}g</span>
                    <span>•</span>
                    <span>C: {template.carbs}g</span>
                    <span>•</span>
                    <span>F: {template.fat}g</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

