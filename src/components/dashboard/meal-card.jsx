import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import Button from "@/components/ui/button"
import { Check, Clock, Edit, CheckCircle } from 'lucide-react'
import LogMealModal from "./log-meal-modal"
import { useState } from "react"
import { format } from "date-fns"

export default function MealCard({ meal }) {
  const [isLogModalOpen, setIsLogModalOpen] = useState(false)

  // Check if meal is already logged
  const isLogged = Boolean(meal.logged_at)

  // Format the logged time if available
  const loggedTime = isLogged ? format(new Date(meal.logged_at), "h:mm a") : null

  return (
    <>
      <Card className={`overflow-hidden ${isLogged ? "border-primary/30" : ""}`}>
        {isLogged && (
          <div className="bg-primary/10 text-primary text-xs py-1 px-3 flex items-center justify-center">
            <CheckCircle className="h-3 w-3 mr-1" />
            Logged at {loggedTime}
          </div>
        )}
        <CardHeader className="p-3 pb-0">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-xl font-medium bg-primary/10 text-primary py-0.5 rounded-full capitalize">{meal.type}</span>
              <span className="text-xl text-muted-foreground ml-2 flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {meal.starttime || meal.time}
              </span>
            </div>
          </div>
          <h3 className="font-medium mt-2">{meal.title || meal.name}</h3>
        </CardHeader>
        <CardContent className="p-3 pt-1">
          <div className="grid grid-cols-3 gap-2 text-xs mt-1">
            <div className="flex flex-col">
              <span className="text-muted-foreground">Calories</span>
              <span className="font-medium">{meal.calories}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground">Protein</span>
              <span className="font-medium">{meal.protein}g</span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground">Carbs</span>
              <span className="font-medium">{meal.carbs}g</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-3 pt-0 flex justify-between">
          {isLogged ? (
            <Button variant="outline" size="sm" className="h-8 text-xs text-primary" disabled>
              <CheckCircle className="h-3 w-3 mr-1" />
              Logged
            </Button>
          ) : (
            <Button size="sm" className="h-8 text-xs" onClick={() => setIsLogModalOpen(true)}>
              <Check className="h-3 w-3 mr-1" />
              Log Meal
            </Button>
          )}
        </CardFooter>
      </Card>
      <LogMealModal isOpen={isLogModalOpen} onClose={() => setIsLogModalOpen(false)} meal={meal} />
    </>
  )
}

