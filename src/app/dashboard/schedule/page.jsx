"use client"

import { useState } from "react"
import { format, startOfWeek, endOfWeek, addDays, addWeeks, subWeeks } from "date-fns"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import Button from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ScheduleWeekView from "@/components/schedule/schedule-week-view"
import ScheduleDayView from "@/components/schedule/schedule-day-view"
import AddMealModal from "@/components/schedule/add-meal-modal"

export default function SchedulePage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState("week")
  const [showAddMealModal, setShowAddMealModal] = useState(false)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null)

  // Sample meal schedule data - would come from API in real implementation
  const [mealEvents, setMealEvents] = useState([
    {
      id: 1,
      title: "Breakfast - Greek Yogurt Bowl",
      date: new Date(2025, 2, 1),
      startTime: "08:00",
      endTime: "08:30",
      type: "breakfast",
      calories: 320,
      protein: 22,
      carbs: 40,
      fat: 8,
    },
    {
      id: 2,
      title: "Lunch - Grilled Chicken Salad",
      date: new Date(2025, 2, 1),
      startTime: "13:00",
      endTime: "13:30",
      type: "lunch",
      calories: 450,
      protein: 35,
      carbs: 25,
      fat: 15,
    },
    {
      id: 3,
      title: "Snack - Apple & Almond Butter",
      date: new Date(2025, 2, 1),
      startTime: "16:00",
      endTime: "16:15",
      type: "snack",
      calories: 200,
      protein: 5,
      carbs: 25,
      fat: 10,
    },
    {
      id: 4,
      title: "Dinner - Salmon with Roasted Vegetables",
      date: new Date(2025, 2, 1),
      startTime: "19:00",
      endTime: "19:30",
      type: "dinner",
      calories: 520,
      protein: 40,
      carbs: 30,
      fat: 22,
    },
    {
      id: 5,
      title: "Breakfast - Avocado Toast",
      date: new Date(2025, 2, 2),
      startTime: "08:00",
      endTime: "08:30",
      type: "breakfast",
      calories: 350,
      protein: 15,
      carbs: 35,
      fat: 18,
    },
    {
      id: 6,
      title: "Lunch - Quinoa Bowl",
      date: new Date(2025, 2, 2),
      startTime: "12:30",
      endTime: "13:00",
      type: "lunch",
      calories: 420,
      protein: 20,
      carbs: 50,
      fat: 12,
    },
  ])

  const handlePrevious = () => {
    if (view === "week") {
      setCurrentDate(subWeeks(currentDate, 1))
    } else {
      setCurrentDate(addDays(currentDate, -1))
    }
  }

  const handleNext = () => {
    if (view === "week") {
      setCurrentDate(addWeeks(currentDate, 1))
    } else {
      setCurrentDate(addDays(currentDate, 1))
    }
  }

  const handleToday = () => {
    setCurrentDate(new Date())
  }

  const handleAddMeal = (timeSlot) => {
    setSelectedTimeSlot(timeSlot)
    setShowAddMealModal(true)
  }

  const handleSaveMeal = (mealData) => {
    const newMeal = {
      id: mealEvents.length + 1,
      ...mealData,
    }
    setMealEvents([...mealEvents, newMeal])
    setShowAddMealModal(false)
  }

  // Get the date range for the header
  const startDate = view === "week" ? startOfWeek(currentDate, { weekStartsOn: 0 }) : currentDate
  const endDate = view === "week" ? endOfWeek(currentDate, { weekStartsOn: 0 }) : currentDate

  const dateRangeText =
    view === "week"
      ? `${format(startDate, "MMMM d")} - ${format(endDate, "MMMM d, yyyy")}`
      : format(currentDate, "EEEE, MMMM d, yyyy")

  return (
    <div className="flex flex-col h-screen bg-background">
      <main className="flex-1 overflow-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Meal Schedule</h1>
            <p className="text-muted-foreground">{dateRangeText}</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={handleAddMeal}>
              <Plus className="mr-2 h-4 w-4" />
              Add Meal
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleToday}>
              Today
            </Button>
            <Button variant="outline" size="icon" onClick={handlePrevious}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <Tabs value={view} onValueChange={setView} className="w-[200px]">
              <TabsList className="grid w-full grid-cols-2 gap-x-2">
                <TabsTrigger value="day" className={`border-primary border-2 ${ view==="day"? "primary-bg": ""}`}>Day</TabsTrigger>
                <TabsTrigger value="week" className={`border-primary border-2 ${ view==="week"? "primary-bg": ""}`}>Week</TabsTrigger>
              </TabsList>
            </Tabs>

            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by meal type" />
              </SelectTrigger>
              <SelectContent className="background">
                <SelectItem value="all">All Meals</SelectItem>
                <SelectItem value="breakfast">Breakfast</SelectItem>
                <SelectItem value="lunch">Lunch</SelectItem>
                <SelectItem value="dinner">Dinner</SelectItem>
                <SelectItem value="snack">Snacks</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="bg-card rounded-lg border shadow-sm">
          <Tabs value={view} defaultValue="week">
            <TabsContent value="week" className="mt-0">
              <ScheduleWeekView currentDate={currentDate} mealEvents={mealEvents} onAddMeal={handleAddMeal} />
            </TabsContent>
            <TabsContent value="day" className="mt-0">
              <ScheduleDayView currentDate={currentDate} mealEvents={mealEvents} onAddMeal={handleAddMeal} />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {showAddMealModal && (
        <AddMealModal
          isOpen={showAddMealModal}
          onClose={() => setShowAddMealModal(false)}
          onSave={handleSaveMeal}
          selectedDate={selectedTimeSlot?.date || currentDate}
          selectedTime={selectedTimeSlot?.time}
        />
      )}
    </div>
  )
}

