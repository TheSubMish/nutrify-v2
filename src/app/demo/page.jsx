"use client"

import React, { useState } from "react"
import { format, addDays } from "date-fns"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import ScheduleWeekView from "@/components/schedule/schedule-week-view"
import ScheduleDayView from "@/components/schedule/schedule-day-view"
import AddMealModal from "@/components/schedule/add-meal-modal"
import Button from "@/components/ui/button"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import Link from "next/link"


export default function DemoSchedulePage() {
    const today = new Date()
    const [mealEvents, setMealEvents] = useState([
        {
            id: 1,
            title: "Pancakes",
            type: "breakfast",
            date: format(today, "yyyy-MM-dd"),
            starttime: "08:00",
            endtime: "09:00",
            calories: 350,
            protein: 10,
            carbs: 60,
            fat: 5,
        },
        {
            id: 2,
            title: "Salad",
            type: "lunch",
            date: format(today, "yyyy-MM-dd"),
            starttime: "12:30",
            endtime: "13:00",
            calories: 200,
            protein: 5,
            carbs: 15,
            fat: 10,
        },
        {
            id: 3,
            title: "Butter Paneer",
            type: "dinner",
            date: format(addDays(today, 1), "yyyy-MM-dd"),
            starttime: "19:00",
            endtime: "20:00",
            calories: 600,
            protein: 40,
            carbs: 0,
            fat: 50,
        },
    ])

    const [currentDate, setCurrentDate] = useState(today)
    const [view, setView] = useState("week")

    // Modal state
    const [showAddMealModal, setShowAddMealModal] = useState(false)
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null)
    const [mealToEdit, setMealToEdit] = useState(null)

    // Drag-and-drop move
    const handleMoveMeal = (id, newDate, newStartTime) => {
        setMealEvents((prev) =>
            prev.map((e) =>
                e.id === id
                    ? { ...e, date: format(newDate, "yyyy-MM-dd"), starttime: newStartTime, endtime: newStartTime }
                    : e
            )
        )
    }

    // Add/Edit/Delete handlers
    const handleAddMeal = ({ date, time }) => {
        setSelectedTimeSlot({ date, time })
        setMealToEdit(null)
        setShowAddMealModal(true)
    }

    const handleEditMeal = (meal) => {
        setMealToEdit(meal)
        setSelectedTimeSlot(null)
        setShowAddMealModal(true)
    }

    const handleDeleteMeal = (meal) => {
        setMealEvents((prev) => prev.filter((e) => e.id !== meal.id))
    }

    const handleSaveMeal = (mealData) => {
        if (mealData.id) {
            // update existing
            setMealEvents((prev) => prev.map((e) => (e.id === mealData.id ? mealData : e)))
        } else {
            // new meal: assign next id
            const nextId = Math.max(0, ...mealEvents.map((e) => e.id)) + 1
            setMealEvents((prev) => [...prev, { ...mealData, id: nextId }])
        }
        setShowAddMealModal(false)
        setMealToEdit(null)
    }

    return (
        <>
            <Navbar />
            <div className="w-full md:mb-10 lg:px-24 xl:px-40 pt-7 lg:pt-10 pb-5">
                <div className="mb-4 flex gap-2">
                    <Button onClick={() => setView((v) => (v === "week" ? "day" : "week"))}>
                        Toggle to {view === "week" ? "Day" : "Week"} View
                    </Button>
                    <Button onClick={() => handleAddMeal({ date: today, time: "08:00" })}>
                        Add Dummy Meal
                    </Button>
                    <div className="text-center">
                        <div className="w-fit mx-auto mb-10 px-5 py-1 rounded-md border-2 border-muted text-center">
                            This is a demo of the meal scheduler. <Link href="/dashboard" className="underline">Click here</Link> to generate personalized meals.
                        </div>
                    </div>
                </div>

                <DndProvider backend={HTML5Backend}>
                    {view === "week" ? (
                        <ScheduleWeekView
                            currentDate={currentDate}
                            mealEvents={mealEvents}
                            onAddMeal={handleAddMeal}
                            onEditMeal={handleEditMeal}
                            onDuplicateMeal={() => { }}
                            onDeleteMeal={handleDeleteMeal}
                            onMoveMeal={handleMoveMeal}
                        />
                    ) : (
                        <ScheduleDayView
                            currentDate={currentDate}
                            mealEvents={mealEvents}
                            onAddMeal={handleAddMeal}
                            onEditMeal={handleEditMeal}
                            onDuplicateMeal={() => { }}
                            onDeleteMeal={handleDeleteMeal}
                            onMoveMeal={handleMoveMeal}
                        />
                    )}
                </DndProvider>

                {showAddMealModal && (
                    <AddMealModal
                        isOpen={showAddMealModal}
                        onClose={() => {
                            setShowAddMealModal(false)
                            setMealToEdit(null)
                        }}
                        onSave={handleSaveMeal}
                        selectedDate={selectedTimeSlot?.date || today}
                        selectedTime={selectedTimeSlot?.time}
                        mealToEdit={mealToEdit}
                    />
                )}
            </div>
            <Footer />
        </>
    )
}
