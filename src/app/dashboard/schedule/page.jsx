"use client"

import { useState, useEffect } from "react"
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
  const [mealEvents, setMealEvents] = useState([])
  const [mealToEdit, setMealToEdit] = useState(null)
  const [mealTypeFilter, setMealTypeFilter] = useState("all")

  useEffect(() => {
    const fetchMeals = async () => {
      const response = await fetch("/api/meals")
      const data = await response.json()

      if (data.success) {
        setMealEvents(data.data)
      } else {
        console.error("Failed to fetch meals:", data.message)
      }
    }
    fetchMeals()
  }, [])

  useEffect(() => {
    console.log("Updated meals:", mealEvents)
  }, [mealEvents])

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
    setMealToEdit(null) // Ensure we're not in edit mode
    setShowAddMealModal(true)
  }

  const handleEditMeal = (meal) => {
    setMealToEdit(meal)
    setSelectedTimeSlot(null) // Clear any selected time slot
    setShowAddMealModal(true)
  }

  const handleDuplicateMeal = (meal) => {
    // Create a duplicate meal without an ID (will be assigned when saved)
    const duplicatedMeal = {
      ...meal,
      id: null,
      title: `${meal.title} (Copy)`,
    }
    setMealToEdit(duplicatedMeal)
    setShowAddMealModal(true)
  }

  const handleDeleteMeal = (meal) => {
    // Filter out the meal to delete
    setMealEvents(mealEvents.filter((event) => event.id !== meal.id))

    // In a real app, you would also make an API call to delete from the database
    // Example:
    // fetch(`/api/meals/${meal.id}`, { method: 'DELETE' })
    //   .then(response => response.json())
    //   .then(data => {
    //     if (data.success) {
    //       setMealEvents(mealEvents.filter(event => event.id !== meal.id))
    //     } else {
    //       console.error("Failed to delete meal:", data.message)
    //     }
    //   })
  }

  const handleSaveMeal = (mealData) => {
    if (mealData.id) {
      // Update existing meal
      setMealEvents(mealEvents.map((event) => (event.id === mealData.id ? mealData : event)))
    } else {
      // Add new meal
      const newMeal = {
        id: mealEvents.length + 1,
        ...mealData,
      }
      setMealEvents([...mealEvents, newMeal])
    }

    setShowAddMealModal(false)
    setMealToEdit(null)
  }

  const handleFilterChange = (value) => {
    setMealTypeFilter(value)
  }

  // Filter meals based on selected meal type
  const filteredMealEvents =
    mealTypeFilter === "all" ? mealEvents : mealEvents.filter((event) => event.type === mealTypeFilter)

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
            <Button variant="primary" size="sm" onClick={() => handleAddMeal({ date: currentDate })}>
              <Plus className="mr-2 h-4 w-4" />
              Add Meal
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex items-center gap-2">
            <Button variant="tertiary" size="sm" onClick={handleToday}>
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
                <TabsTrigger value="day" className={`border-primary border-2 ${view === "day" ? "primary-bg" : ""}`}>
                  Day
                </TabsTrigger>
                <TabsTrigger value="week" className={`border-primary border-2 ${view === "week" ? "primary-bg" : ""}`}>
                  Week
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <Select value={mealTypeFilter} onValueChange={handleFilterChange}>
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
              <ScheduleWeekView
                currentDate={currentDate}
                mealEvents={filteredMealEvents}
                onAddMeal={handleAddMeal}
                onEditMeal={handleEditMeal}
                onDuplicateMeal={handleDuplicateMeal}
                onDeleteMeal={handleDeleteMeal}
              />
            </TabsContent>
            <TabsContent value="day" className="mt-0">
              <ScheduleDayView
                currentDate={currentDate}
                mealEvents={filteredMealEvents}
                onAddMeal={handleAddMeal}
                onEditMeal={handleEditMeal}
                onDuplicateMeal={handleDuplicateMeal}
                onDeleteMeal={handleDeleteMeal}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {showAddMealModal && (
        <AddMealModal
          isOpen={showAddMealModal}
          onClose={() => {
            setShowAddMealModal(false)
            setMealToEdit(null)
          }}
          onSave={handleSaveMeal}
          selectedDate={selectedTimeSlot?.date || currentDate}
          selectedTime={selectedTimeSlot?.time}
          mealToEdit={mealToEdit}
        />
      )}
    </div>
  )
}
