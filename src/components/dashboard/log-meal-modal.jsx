"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import Button from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Check, Clock, Calendar, Utensils, X } from "lucide-react"
import { Textarea } from "@/components/ui/TextArea"
import { toast } from "sonner"
import { format } from "date-fns"

export default function LogMealModal({ isOpen, onClose, meal }) {
    const [isLogging, setIsLogging] = useState(false)
    const [portionSize, setPortionSize] = useState(100)
    const [notes, setNotes] = useState("")

    // Calculate adjusted nutritional values based on portion size
    const adjustedCalories = Math.round((meal?.calories || 0) * (portionSize / 100))
    const adjustedProtein = Math.round((meal?.protein || 0) * (portionSize / 100))
    const adjustedCarbs = Math.round((meal?.carbs || 0) * (portionSize / 100))
    const adjustedFat = Math.round((meal?.fat || 0) * (portionSize / 100))

    const handleLogMeal = async () => {
        try {
            setIsLogging(true)

            // Create the meal log object
            const mealLog = {
                meal_id: meal?.id,
                title: meal?.title || meal?.name,
                type: meal?.type,
                date: new Date().toISOString().split("T")[0],
                time: format(new Date(), "HH:mm"),
                portion_size: portionSize,
                calories: adjustedCalories,
                protein: adjustedProtein,
                carbs: adjustedCarbs,
                fat: adjustedFat,
                notes: notes,
            }

            // Call API to log the meal
            const response = await fetch("/api/log-meal", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ mealLog }),
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.message || "Failed to log meal")
            }

            toast.success("Meal logged successfully!")
            onClose()
        } catch (error) {
            console.error("Error logging meal:", error)
            toast.error(error.message || "Failed to log meal")
        } finally {
            setIsLogging(false)
        }
    }

    if (!meal) return null

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold flex items-center">
                        <Utensils className="mr-2 h-5 w-5" />
                        Log Meal
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <Card className="border-primary/20">
                        <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-medium text-lg">{meal.title || meal.name}</h3>
                                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                                        <span className="capitalize mr-3">{meal.type}</span>
                                        <Clock className="h-3 w-3 mr-1" />
                                        <span>{meal.time || (meal.startTime && `${meal.startTime} - ${meal.endTime}`)}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-3">
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-sm font-medium">Today's Date</label>
                                <div className="text-sm text-muted-foreground flex items-center">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    {format(new Date(), "MMMM d, yyyy")}
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-sm font-medium">Portion Size: {portionSize}%</label>
                            </div>
                            <Slider
                                value={[portionSize]}
                                onValueChange={(value) => setPortionSize(value[0])}
                                min={25}
                                max={200}
                                step={5}
                            />
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                <span>25%</span>
                                <span>100%</span>
                                <span>200%</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-2 mt-4 text-center">
                            <div className="bg-primary/5 rounded-md p-2">
                                <div className="text-xs text-muted-foreground">Calories</div>
                                <div className="font-bold">{adjustedCalories}</div>
                            </div>
                            <div className="bg-primary/5 rounded-md p-2">
                                <div className="text-xs text-muted-foreground">Protein</div>
                                <div className="font-bold">{adjustedProtein}g</div>
                            </div>
                            <div className="bg-primary/5 rounded-md p-2">
                                <div className="text-xs text-muted-foreground">Carbs</div>
                                <div className="font-bold">{adjustedCarbs}g</div>
                            </div>
                            <div className="bg-primary/5 rounded-md p-2">
                                <div className="text-xs text-muted-foreground">Fat</div>
                                <div className="font-bold">{adjustedFat}g</div>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium block mb-2">Notes</label>
                            <Textarea
                                placeholder="Add any notes about this meal..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="resize-none"
                                rows={3}
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter className="flex space-x-2">
                    <Button variant="tertiary" onClick={onClose} disabled={isLogging}>
                        <X className="h-4 w-4 mr-1" />
                        Cancel
                    </Button>
                    <Button onClick={handleLogMeal} disabled={isLogging}>
                        {isLogging ? (
                            <>
                                <div className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full"></div>
                                Logging...
                            </>
                        ) : (
                            <>
                                <Check className="h-4 w-4 mr-1" />
                                Log Meal
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

