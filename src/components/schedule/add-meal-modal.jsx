"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Button from "@/components/ui/button"
import Input from "@/components/ui/input"
import Label from "@/components/ui/Label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/TextArea"
import { toast } from "sonner"
import { callAi } from "@/utils/callAi"

export default function AddMealModal({ isOpen, onClose, onSave, selectedDate, selectedTime, mealToEdit }) {
  const [findActivate, setFindActivate] = useState(false)
  const [finding, setFinding] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    type: "breakfast",
    date: selectedDate || new Date(),
    startTime: selectedTime || "08:00",
    endTime: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    notes: "",
  })

  // Pre-fill form when editing a meal
  useEffect(() => {
    if (mealToEdit) {
      setFormData({
        title: mealToEdit.title || "",
        type: mealToEdit.type || "breakfast",
        date: mealToEdit.date || selectedDate || new Date(),
        startTime: mealToEdit.starttime || selectedTime || "08:00",
        endTime: mealToEdit.endtime || "",
        calories: mealToEdit.calories || "",
        protein: mealToEdit.protein || "",
        carbs: mealToEdit.carbs || "",
        fat: mealToEdit.fat || "",
        notes: mealToEdit.notes || "",
      })
    } else {
      // Calculate end time as 30 minutes after start time
      const calculateEndTime = (startTime) => {
        if (!startTime) return ""
        const [hours, minutes] = startTime.split(":").map(Number)
        let newHours = hours
        let newMinutes = minutes + 30

        if (newMinutes >= 60) {
          newHours = (newHours + 1) % 24
          newMinutes = newMinutes % 60
        }

        return `${newHours.toString().padStart(2, "0")}:${newMinutes.toString().padStart(2, "0")}`
      }

      setFormData({
        title: "",
        type: "breakfast",
        date: selectedDate || new Date(),
        startTime: selectedTime || "08:00",
        endTime: calculateEndTime(selectedTime || "08:00"),
        calories: "",
        protein: "",
        carbs: "",
        fat: "",
        notes: "",
      })
    }
  }, [mealToEdit, selectedDate, selectedTime])

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === "title") {
      setFindActivate(true)
    }

    if (name === "title" && value === "") {
      setFindActivate(false)
    }

    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleStartTimeChange = (value) => {
    // Calculate end time as 30 minutes after start time if not editing
    const calculateEndTime = (startTime) => {
      if (!startTime) return ""
      const [hours, minutes] = startTime.split(":").map(Number)
      let newHours = hours
      let newMinutes = minutes + 30

      if (newMinutes >= 60) {
        newHours = (newHours + 1) % 24
        newMinutes = newMinutes % 60
      }

      return `${newHours.toString().padStart(2, "0")}:${newMinutes.toString().padStart(2, "0")}`
    }

    // Only auto-calculate end time if it's not already set or we're not editing
    const newEndTime = !mealToEdit || !formData.endTime ? calculateEndTime(value) : formData.endTime

    setFormData((prev) => ({
      ...prev,
      startTime: value,
      endTime: newEndTime,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Format the data for saving
    const mealData = {
      id: mealToEdit?.id, // Keep the same ID if editing
      title: formData.title,
      type: formData.type,
      date: formData.date,
      starttime: formData.startTime,
      endtime: formData.endTime,
      calories: formData.calories,
      protein: formData.protein,
      carbs: formData.carbs,
      fat: formData.fat,
      notes: formData.notes,
    }

    onSave(mealData)
  }

  // Add the handleFindCalorie function
  const handleFindCalorie = async () => {
    setFinding(true)
    setFindActivate(false)

    const prompt = `Find the calories, protein, carbs, and fat for the food "${formData.title}" in format: {calories: 0, protein: 0, carbs: 0, fat: 0} if ${formData.title} is a valid food. If not, return {calories: "", protein: "", carbs: "", fat: ""}. provide the answer in JSON format. if valid food, return the values in kcal and grams but only number without any text. If not valid food return simply false string.`

    try {
      const response = await callAi(prompt)

      // Extract JSON from the response
      const jsonMatch =
        response.match(/```json\s*({[\s\S]*?})\s*```/) || response.match(/\{[\s\S]*?"calories"[\s\S]*?\}/)

      if (jsonMatch) {
        // Parse the extracted JSON
        const nutrition = JSON.parse(jsonMatch[1] || jsonMatch[0])

        // Update the form data with the parsed nutrition info
        setFormData((prev) => ({
          ...prev,
          calories: nutrition.calories || "",
          protein: nutrition.protein || "",
          carbs: nutrition.carbs || "",
          fat: nutrition.fat || "",
        }))

        setFindActivate(false)
        setFinding(false)
      } else if (response.includes("false") || response.toLowerCase().includes("could not find")) {
        toast.error("Meal not found")
        setFinding(false)
      }
    } catch (error) {
      toast.error("Failed to get nutrition info")
      setFinding(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{mealToEdit ? "Edit Meal" : "Add New Meal"}</DialogTitle>
          <Button variant="ghost" size="icon" className="absolute right-4 top-4" onClick={onClose}>
            {/* <X className="h-4 w-4" /> */}
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={format(new Date(formData.date), "yyyy-MM-dd")}
                onChange={(e) => handleChange({ target: { name: "date", value: new Date(e.target.value) } })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Meal Type</Label>
              <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select meal type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="breakfast">Breakfast</SelectItem>
                  <SelectItem value="lunch">Lunch</SelectItem>
                  <SelectItem value="dinner">Dinner</SelectItem>
                  <SelectItem value="snack">Snack</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Meal Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter meal title"
              required
            />
            <Button
              type="button"
              variant="secondary"
              disabled={!findActivate || finding}
              onClick={handleFindCalorie}
              className="w-full mt-1"
            >
              {finding ? "Finding..." : "Find Calorie"}
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => handleStartTimeChange(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input id="endTime" type="time" name="endTime" value={formData.endTime} onChange={handleChange} />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <div className="space-y-2">
              <Label htmlFor="calories">Calories</Label>
              <Input
                id="calories"
                name="calories"
                type="number"
                value={formData.calories}
                onChange={handleChange}
                placeholder="kcal"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="protein">Protein</Label>
              <Input
                id="protein"
                name="protein"
                type="number"
                value={formData.protein}
                onChange={handleChange}
                placeholder="g"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="carbs">Carbs</Label>
              <Input
                id="carbs"
                name="carbs"
                type="number"
                value={formData.carbs}
                onChange={handleChange}
                placeholder="g"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fat">Fat</Label>
              <Input id="fat" name="fat" type="number" value={formData.fat} onChange={handleChange} placeholder="g" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add any additional notes"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{mealToEdit ? "Update Meal" : "Add Meal"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

