"use client"

import { format, isSameDay } from "date-fns"
import { cn } from "@/lib/utils"
import MealEvent from "./meal-event"
import { useDrop } from "react-dnd"

// Time slots from 6am to 10pm in 30 minute intervals
const dayTimeSlots = Array.from({ length: 33 }, (_, i) => {
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
  onMoveMeal,
}) {
  const dayEvents = mealEvents.filter((event) => {
    const eventDate = typeof event.date === "string" ? new Date(event.date) : event.date
    return isSameDay(eventDate, currentDate)
  })

  const handleCellClick = (time) => onAddMeal({ date: currentDate, time })

  const getEventsForSlot = (timeSlot) => {
    const currentSlotIndex = dayTimeSlots.indexOf(timeSlot)
    const nextSlotTime = dayTimeSlots[currentSlotIndex + 1]

    return dayEvents.filter((event) => {
      const eventStartTime = event.startTime || event.starttime
      if (eventStartTime === timeSlot) return true
      if (!nextSlotTime) return currentSlotIndex === dayTimeSlots.length - 1

      const [eH, eM] = eventStartTime.split(":").map(Number)
      const eventMinutes = eH * 60 + eM
      const [sH, sM] = timeSlot.split(":").map(Number)
      const slotMinutes = sH * 60 + sM
      const [nH, nM] = nextSlotTime.split(":").map(Number)
      const nextMinutes = nH * 60 + nM

      return eventMinutes >= slotMinutes && eventMinutes < nextMinutes
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
          {dayTimeSlots.map((time, timeIndex) => {
            const events = getEventsForSlot(time)
            const [{ isOver }, dropRef] = useDrop({
              accept: 'MEAL_EVENT',
              drop: (item) => onMoveMeal(item.id, currentDate, time),
              collect: (monitor) => ({ isOver: monitor.isOver() }),
            })

            return (
              <div
                key={time}
                className={cn("grid grid-cols-[100px_1fr] border-b", timeIndex % 2 === 0 && "bg-muted/5")}
              >
                <div className="p-2 border-r bg-muted/50 text-xs text-center">{time}</div>
                <div
                  ref={dropRef}
                  className={cn("p-2 min-h-[80px] relative", isOver && "bg-blue-100")}
                  onClick={() => handleCellClick(time)}
                >
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

