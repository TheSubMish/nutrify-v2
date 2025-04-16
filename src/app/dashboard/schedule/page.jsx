"use client"

import React, { useState, useEffect } from "react"
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
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"

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
    router.push(`?${params.toString()}`, { scroll: false })
  }, [currentDate, view, mealTypeFilter, router])

  // Fetch meals
  useEffect(() => {
    if (!user) return
      ; (async () => {
        try {
          const response = await fetch("/api/meals")
          const data = await response.json()
          if (data.success) setMealEvents(data.data)
          else toast.error("Failed to get meals")
        } catch {
          toast.error("Error fetching meals")
        }
      })()
  }, [user])

  // Navigation handlers
  const handlePrevious = () => view === "week" ? setCurrentDate(subWeeks(currentDate, 1)) : setCurrentDate(addDays(currentDate, -1))
  const handleNext = () => view === "week" ? setCurrentDate(addWeeks(currentDate, 1)) : setCurrentDate(addDays(currentDate, 1))
  const handleToday = () => setCurrentDate(new Date())

  // Modal handlers
  const handleAddMeal = (timeSlot) => { setSelectedTimeSlot(timeSlot); setMealToEdit(null); setShowAddMealModal(true) }
  const handleEditMeal = (meal) => { setMealToEdit(meal); setSelectedTimeSlot(null); setShowAddMealModal(true) }
  const handleDuplicateMeal = (meal) => { setMealToEdit({ ...meal, id: null, title: `${meal.title} (Copy)` }); setShowAddMealModal(true) }
  const handleDeleteMeal = async (meal) => {
    const userId = user?.id
    try {
      const res = await fetch("/api/meals", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: meal.id, userId }) })
      const result = await res.json()
      if (result.success) {
        setMealEvents(prev => prev.filter(e => e.id !== meal.id))
        toast.success("Meal deleted successfully")
      } else toast.error("Failed to delete meal")
    } catch {
      toast.error("Failed to delete meal")
    }
  }

  // Save handler
  const handleSaveMeal = async (mealData) => {
    const userId = user?.id
    try {
      const res = await fetch("/api/meals", {
        method: mealData.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, meal: mealData }),
      })
      const result = await res.json()
      if (!result.success) return void toast.error("Failed to save meal")
      const updated = result.data[0]
      setMealEvents(prev => mealData.id ? prev.map(e => e.id === updated.id ? updated : e) : [...prev, updated])
      toast.success("Meal saved successfully")
      setShowAddMealModal(false)
      setMealToEdit(null)
    } catch {
      toast.error("Failed to save meal")
    }
  }

  // New: Move handler
  const handleMoveMeal = async (id, newDate, newStartTime) => {
    const userId = user?.id
    try {
      const res = await fetch("/api/meals", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, meal: { id, date: format(newDate, "yyyy-MM-dd"), startTime: newStartTime } }),
      })
      const result = await res.json()
      if (result.success) {
        const moved = result.data[0]
        setMealEvents(prev => prev.map(e => e.id === moved.id ? moved : e))
        toast.success("Meal moved successfully")
      } else {
        toast.error("Failed to move meal")
      }
    } catch {
      toast.error("Error moving meal")
    }
  }

  // Filters
  const filtered = mealTypeFilter === "all" ? mealEvents : mealEvents.filter(e => e.type === mealTypeFilter)
  const startDate = view === "week" ? startOfWeek(currentDate, { weekStartsOn: 0 }) : currentDate
  const endDate = view === "week" ? endOfWeek(currentDate, { weekStartsOn: 0 }) : currentDate
  const dateFiltered = filtered.filter(meal => {
    const mDate = new Date(meal.date)
    return view === "week"
      ? mDate >= startDate && mDate <= endDate
      : format(mDate, "yyyy-MM-dd") === format(currentDate, "yyyy-MM-dd")
  })

  const dateRangeText = view === "week"
    ? `${format(startDate, "MMMM d")} - ${format(endDate, "MMMM d, yyyy")}`
    : format(currentDate, "EEEE, MMMM d, yyyy")

  return (
    <div className="flex flex-col h-screen bg-background">
      <main className="flex-1 overflow-auto p-6">
        {/* Header & Controls */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Meal Schedule</h1>
            <p className="text-muted-foreground">{dateRangeText}</p>
          </div>
          <Button variant="primary" size="sm" onClick={() => handleAddMeal({ date: currentDate })}>
            <Plus className="mr-2 h-4 w-4" />Add Meal
          </Button>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex items-center gap-2">
            <Button variant="tertiary" size="sm" onClick={handleToday}>Today</Button>
            <Button variant="outline" size="icon" onClick={handlePrevious}><ChevronLeft className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" onClick={handleNext}><ChevronRight className="h-4 w-4" /></Button>
          </div>
          <div className="flex items-center gap-4">
            <Tabs value={view} onValueChange={setView} className="w-[200px]">
              <TabsList className="grid w-full grid-cols-2 gap-x-2">
                <TabsTrigger value="day" className={view === "day" ? "border-primary border-2" : "primary-bg"}>Day</TabsTrigger>
                <TabsTrigger value="week" className={view === "week" ? "border-primary border-2" : "primary-bg"}>Week</TabsTrigger>
              </TabsList>
            </Tabs>
            <Select value={mealTypeFilter} onValueChange={setMealTypeFilter}>
              <SelectTrigger className="w-[180px]"><SelectValue placeholder="Filter by meal type" /></SelectTrigger>
              <SelectContent>
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
          <DndProvider backend={HTML5Backend}>
            <Tabs value={view} defaultValue="week">
              <TabsContent value="week">
                <ScheduleWeekView
                  currentDate={currentDate}
                  mealEvents={dateFiltered}
                  onAddMeal={handleAddMeal}
                  onEditMeal={handleEditMeal}
                  onDuplicateMeal={handleDuplicateMeal}
                  onDeleteMeal={handleDeleteMeal}
                  onMoveMeal={handleMoveMeal}
                />
              </TabsContent>
              <TabsContent value="day">
                <ScheduleDayView
                  currentDate={currentDate}
                  mealEvents={dateFiltered}
                  onAddMeal={handleAddMeal}
                  onEditMeal={handleEditMeal}
                  onDuplicateMeal={handleDuplicateMeal}
                  onDeleteMeal={handleDeleteMeal}
                  onMoveMeal={handleMoveMeal}
                />
              </TabsContent>
            </Tabs>
          </DndProvider>
        </div>
      </main>

      {showAddMealModal && (
        <AddMealModal
          isOpen={showAddMealModal}
          onClose={() => { setShowAddMealModal(false); setMealToEdit(null) }}
          onSave={handleSaveMeal}
          selectedDate={selectedTimeSlot?.date || currentDate}
          selectedTime={selectedTimeSlot?.time}
          mealToEdit={mealToEdit}
        />
      )}
    </div>
  )
}
