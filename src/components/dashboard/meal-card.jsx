import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import Button from "@/components/ui/button"
import { Check, Clock, Edit } from "lucide-react"

export default function MealCard({ meal }) {
  return (
    <Card className="overflow-hidden">
      {/* <div className="h-32 bg-cover bg-center" style={{ backgroundImage: `url(${meal.image})` }} /> */}
      <CardHeader className="p-3 pb-0">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-xl font-medium bg-primary/10 text-primary py-0.5 rounded-full">{meal.type}</span>
            <span className="text-xl text-muted-foreground ml-2 flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {meal.time}
            </span>
          </div>
        </div>
        <h3 className="font-medium mt-2">{meal.name}</h3>
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
        <Button variant="outline" size="sm" className="h-8 text-xs">
          <Edit className="h-3 w-3 mr-1" />
          Edit
        </Button>
        <Button size="sm" className="h-8 text-xs">
          <Check className="h-3 w-3 mr-1" />
          Log Meal
        </Button>
      </CardFooter>
    </Card>
  )
}

