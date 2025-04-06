"use client"

import { useState } from "react"
import { format, set } from "date-fns"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import Button from "@/components/ui/button"
import Input from "@/components/ui/input"
import Label from "@/components/ui/Label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { callAi } from "@/utils/callAi"
import { toast } from "sonner"

export default function AddMealModal({ isOpen, onClose, onSave, selectedDate, selectedTime }) {
  // State to manage meal data
  const [findActivate, setFindActivate] = useState(false)
  const [finding, setFinding] = useState(false)
  const [mealData, setMealData] = useState({
    title: "",
    date: selectedDate || new Date(),
    startTime: selectedTime || "08:00",
    endTime: selectedTime
      ? `${Number.parseInt(selectedTime.split(":")[0])}:${(Number.parseInt(selectedTime.split(":")[1]) + 30) % 60}`.padStart(
        5,
        "0",
      )
      : "08:30",
    type: "breakfast",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
  })

  const handleChange = (field, value) => {

    if (field === "title") {
      setFindActivate(true)
    }

    if (field === "title" && value === "") {
      setFindActivate(false)
    }

    setMealData({
      ...mealData,
      [field]: value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(mealData)
  }


  const handleFindCalorie = async () => {
    setFinding(true);
    setFindActivate(false);

    const prompt = `Find the calories, protein, carbs, and fat for the meal "${mealData.title}" in format: {calories: 0, protein: 0, carbs: 0, fat: 0} if ${mealData.title} is a valid meal. If not, return {calories: "", protein: "", carbs: "", fat: ""}. provide the answer in JSON format. if valid meal, return the values in kcal and grams but only number without any text. If not valid meal return simply false string.`;
    const response = await callAi(prompt);

    try {
      // Extract JSON from the response
      const jsonMatch = response.match(/```json\s*({[\s\S]*?})\s*```/) ||
        response.match(/\{[\s\S]*?"calories"[\s\S]*?\}/);

      if (jsonMatch) {
        // Parse the extracted JSON
        const nutrition = JSON.parse(jsonMatch[1] || jsonMatch[0]);

        // Update the meal data with the parsed nutrition info
        setMealData(prev => ({
          ...prev,
          calories: nutrition.calories || "",
          protein: nutrition.protein || "",
          carbs: nutrition.carbs || "",
          fat: nutrition.fat || "",
        }));

        setFindActivate(false);
        setFinding(false);

      } else if (response.includes("false") || response.toLowerCase().includes("could not find")) {
        toast.error("Meal not found");
        setFinding(false);
      }
    } catch (error) {
      toast.error("Failed to get nutrition info")
      console.error("Failed to parse AI response:", error, response);
    }

  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Meal</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <div>
              <Label htmlFor="title">Meal Name</Label>
              <Input
                id="title"
                value={mealData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="e.g., Greek Yogurt Bowl"
                required
              />
            </div>
            <Button type="button" variant="secondary" disabled={!findActivate} onClick={handleFindCalorie}>{finding ? "Finding..." : "Find Calorie"}</Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start text-left font-normal background">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(mealData.date, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={mealData.date}
                    onSelect={(date) => handleChange("date", date)}
                    initialFocus
                    className="background"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="type">Meal Type</Label>
              <Select value={mealData.type} onValueChange={(value) => handleChange("type", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select meal type" />
                </SelectTrigger>
                <SelectContent className="background">
                  <SelectItem value="breakfast">Breakfast</SelectItem>
                  <SelectItem value="lunch">Lunch</SelectItem>
                  <SelectItem value="dinner">Dinner</SelectItem>
                  <SelectItem value="snack">Snack</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={mealData.startTime}
                onChange={(e) => handleChange("startTime", e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={mealData.endTime}
                onChange={(e) => handleChange("endTime", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="calories">Calories</Label>
              <Input
                id="calories"
                type="number"
                value={mealData.calories}
                onChange={(e) => handleChange("calories", e.target.value)}
                placeholder="kcal"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="protein">Protein</Label>
              <Input
                id="protein"
                type="number"
                value={mealData.protein}
                onChange={(e) => handleChange("protein", e.target.value)}
                placeholder="g"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="carbs">Carbs</Label>
              <Input
                id="carbs"
                type="number"
                value={mealData.carbs}
                onChange={(e) => handleChange("carbs", e.target.value)}
                placeholder="g"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="fat">Fat</Label>
              <Input
                id="fat"
                type="number"
                value={mealData.fat}
                onChange={(e) => handleChange("fat", e.target.value)}
                placeholder="g"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Meal</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

