"use client"

import { useState, useEffect } from "react"
import { format, startOfWeek, endOfWeek, addDays, addWeeks, subWeeks, parseISO } from "date-fns"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import Button from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ScheduleWeekView from "@/components/schedule/schedule-week-view"
import ScheduleDayView from "@/components/schedule/schedule-day-view"
import AddMealModal from "@/components/schedule/add-meal-modal"
import { useAppStore } from "@/store"
import { toast } from "sonner"
import { useSearchParams, useRouter } from "next/navigation"

export default function SchedulePage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  // Get filter parameters from URL
  const dateParam = searchParams.get("date")
  const viewParam = searchParams.get("view")
  const typeParam = searchParams.get("type")

  const [currentDate, setCurrentDate] = useState(dateParam ? parseISO(dateParam) : new Date())
  const [view, setView] = useState(viewParam || "week")
  const [showAddMealModal, setShowAddMealModal] = useState(false)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null)
  const [mealEvents, setMealEvents] = useState([])
  const [mealToEdit, setMealToEdit] = useState(null)
  const [mealTypeFilter, setMealTypeFilter] = useState(typeParam || "all")
  const { user } = useAppStore()

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams()
    params.set("date", format(currentDate, "yyyy-MM-dd"))
    params.set("view", view)
    if (mealTypeFilter !== "all") {
      params.set("type", mealTypeFilter)
    }

    // Update URL without refreshing the page
    router.push(`?${params.toString()}`, { scroll: false })
  }, [currentDate, view, mealTypeFilter, router])

  useEffect(() => {
    if (!user) {
      return
    }

    const fetchMeals = async () => {
      try {
        const response = await fetch("/api/meals")
        const data = await response.json()

        if (data.success) {
          setMealEvents(data.data)
        } else {
          toast.error("Failed to get meals")
        }
      } catch (error) {
        toast.error("Error fetching meals")
      }
    }
    fetchMeals()
  }, [user])

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
    setMealToEdit(null)
    setShowAddMealModal(true)
  }

  const handleEditMeal = (meal) => {
    setMealToEdit(meal)
    setSelectedTimeSlot(null)
    setShowAddMealModal(true)
  }

  const handleDuplicateMeal = (meal) => {
    const duplicatedMeal = {
      ...meal,
      id: null,
      title: `${meal.title} (Copy)`,
    }
    setMealToEdit(duplicatedMeal)
    setShowAddMealModal(true)
  }

  const handleDeleteMeal = async (meal) => {
    const userId = user?.id

    try {
      const response = await fetch("/api/meals", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: meal.id, userId }),
      })

      const result = await response.json()

      if (result.success) {
        setMealEvents((prev) => prev.filter((event) => event.id !== meal.id))
        toast.success("Meal deleted successfully")
      } else {
        toast.error("Failed to delete meal")
      }
    } catch (err) {
      toast.error("Failed to delete meal")
    }
  }

  const handleSaveMeal = async (mealData) => {
    const userId = user?.id
    const endpoint = "/api/meals"
    const headers = {
      "Content-Type": "application/json",
    }

    try {
      const response = await fetch(endpoint, {
        method: mealData.id ? "PUT" : "POST",
        headers,
        body: JSON.stringify({ userId, meal: mealData }),
      })

      const result = await response.json()

      if (!result.success) {
        toast.error("Failed to save meal")
        return
      }

      const updatedMeal = result.data[0]

      if (mealData.id) {
        setMealEvents((prev) => prev.map((event) => (event.id === updatedMeal.id ? updatedMeal : event)))
      } else {
        setMealEvents((prev) => [...prev, updatedMeal])
      }

      toast.success("Meal saved successfully")

      setShowAddMealModal(false)
      setMealToEdit(null)
    } catch (err) {
      toast.error("Failed to save meal")
    }
  }

  const handleFilterChange = (value) => {
    setMealTypeFilter(value)
  }

  const handleViewChange = (newView) => {
    setView(newView)
  }

  // Filter meals based on selected meal type
  const filteredMealEvents =
    mealTypeFilter === "all" ? mealEvents : mealEvents.filter((event) => event.type === mealTypeFilter)

  // Filter meals based on date range
  const startDate = view === "week" ? startOfWeek(currentDate, { weekStartsOn: 0 }) : currentDate
  const endDate = view === "week" ? endOfWeek(currentDate, { weekStartsOn: 0 }) : currentDate

  // Further filter meals to only show those within the current date range
  const dateFilteredMeals = filteredMealEvents.filter((meal) => {
    const mealDate = new Date(meal.date)

    // For week view, check if meal is within the week
    if (view === "week") {
      return mealDate >= startDate && mealDate <= endDate
    }

    // For day view, check if meal is on the current day
    return format(mealDate, "yyyy-MM-dd") === format(currentDate, "yyyy-MM-dd")
  })

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
            <Tabs value={view} onValueChange={handleViewChange} className="w-[200px]">
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
                mealEvents={dateFilteredMeals}
                onAddMeal={handleAddMeal}
                onEditMeal={handleEditMeal}
                onDuplicateMeal={handleDuplicateMeal}
                onDeleteMeal={handleDeleteMeal}
              />
            </TabsContent>
            <TabsContent value="day" className="mt-0">
              <ScheduleDayView
                currentDate={currentDate}
                mealEvents={dateFilteredMeals}
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
