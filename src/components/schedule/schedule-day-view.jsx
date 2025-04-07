"use client"

import { format, isSameDay } from "date-fns"
import { cn } from "@/lib/utils"
import MealEvent from "./meal-event"

// Time slots from 6am to 10pm in 30 minute intervals
const timeSlots = Array.from({ length: 33 }, (_, i) => {
  const hour = Math.floor(i / 2) + 6
  const minutes = (i % 2) * 30
  return `${hour.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
})

export default function ScheduleDayView({
  currentDate,
  mealEvents,
  onAddMeal,
  onEditMeal,
  onDuplicateMeal,
  onDeleteMeal,
}) {
  // Get events for the current day
  const dayEvents = mealEvents.filter((event) => {
    const eventDate = typeof event.date === "string" ? new Date(event.date) : event.date
    return isSameDay(eventDate, currentDate)
  })

  const handleCellClick = (time) => {
    onAddMeal({ date: currentDate, time })
  }

  // Get events for a specific time slot
  const getEventsForSlot = (timeSlot) => {
    return dayEvents.filter((event) => {
      const eventStartTime = event.startTime || event.starttime
      return eventStartTime === timeSlot
    })
  }

  return (
    <div className="overflow-auto">
      <div className="min-w-[600px]">
        {/* Header */}
        <div className="grid grid-cols-1 border-b p-4 bg-muted/50 text-center font-medium">
          <div>{format(currentDate, "EEEE, MMMM d, yyyy")}</div>
        </div>

        {/* Time grid */}
        <div>
          {timeSlots.map((time, timeIndex) => {
            const events = getEventsForSlot(time)
            return (
              <div
                key={time}
                className={cn("grid grid-cols-[100px_1fr] border-b", timeIndex % 2 === 0 && "bg-muted/5")}
              >
                <div className="p-2 border-r bg-muted/50 text-xs text-center">{time}</div>
                <div className="p-2 min-h-[80px] relative" onClick={() => handleCellClick(time)}>
                  {events.map((event) => (
                    <MealEvent
                      key={event.id}
                      event={event}
                      isDetailView={true}
                      onEdit={onEditMeal}
                      onDuplicate={onDuplicateMeal}
                      onDelete={onDeleteMeal}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

