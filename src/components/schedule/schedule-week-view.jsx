"use client"
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from "date-fns"
import { cn } from "@/lib/utils"
import MealEvent from "./meal-event"

// Time slots from 6am to 10pm in 30 minute intervals
const timeSlots = Array.from({ length: 33 }, (_, i) => {
  const hour = Math.floor(i / 2) + 6
  const minutes = (i % 2) * 30
  return `${hour.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
})

export default function ScheduleWeekView({
  currentDate,
  mealEvents,
  onAddMeal,
  onEditMeal,
  onDuplicateMeal,
  onDeleteMeal,
}) {
  const startDate = startOfWeek(currentDate, { weekStartsOn: 0 })
  const endDate = endOfWeek(currentDate, { weekStartsOn: 0 })
  const days = eachDayOfInterval({ start: startDate, end: endDate })

  const handleCellClick = (day, time) => {
    onAddMeal({ date: day, time })
  }

  const getEventsForSlot = (day, timeSlot) => {
    const currentSlotIndex = timeSlots.indexOf(timeSlot)
    const nextSlotTime = timeSlots[currentSlotIndex + 1]

    return mealEvents.filter((event) => {
      const eventDate = typeof event.date === "string" ? new Date(event.date) : event.date
      const eventStartTime = event.startTime || event.starttime

      // First check if the event is on the correct day
      if (!isSameDay(eventDate, day)) return false

      // If the event time exactly matches the slot time, include it
      if (eventStartTime === timeSlot) return true

      // If this is the last time slot, include any remaining events
      if (!nextSlotTime) return currentSlotIndex === timeSlots.length - 1

      // Find the closest time slot
      if (eventStartTime) {
        // Convert times to comparable format (minutes since 00:00)
        const [eventHours, eventMinutes] = eventStartTime.split(":").map(Number)
        const eventTotalMinutes = eventHours * 60 + eventMinutes

        const [slotHours, slotMinutes] = timeSlot.split(":").map(Number)
        const slotTotalMinutes = slotHours * 60 + slotMinutes

        const [nextSlotHours, nextSlotMinutes] = nextSlotTime.split(":").map(Number)
        const nextSlotTotalMinutes = nextSlotHours * 60 + nextSlotMinutes

        // Check if event time falls between current slot and next slot
        return eventTotalMinutes >= slotTotalMinutes && eventTotalMinutes < nextSlotTotalMinutes
      }

      return false
    })
  }

  return (
    <div className="overflow-auto">
      <div className="min-w-[800px]">
        {/* Header with days */}
        <div className="grid grid-cols-8 border-b">
          <div className="p-2 border-r text-center font-medium">Time</div>
          {days.map((day, i) => (
            <div key={i} className={cn("p-2 text-center border-2 font-medium", isSameDay(day, new Date()))}>
              <div>{format(day, "EEE")}</div>
              <div className="text-sm">{format(day, "MMM d")}</div>
            </div>
          ))}
        </div>

        {/* Time grid */}
        <div>
          {timeSlots.map((time, timeIndex) => (
            <div key={time} className="grid grid-cols-8 border-b">
              <div className="p-2 border-r text-xs text-center">{time}</div>

              {days.map((day, dayIndex) => {
                const events = getEventsForSlot(day, time)
                return (
                  <div
                    key={dayIndex}
                    className={cn(
                      "p-1 min-h-[60px] border-r relative",
                      isSameDay(day, new Date()),
                      timeIndex % 2 === 0 && "border-b border-dashed",
                    )}
                    onClick={() => handleCellClick(day, time)}
                  >
                    {events.map((event) => (
                      <MealEvent
                        key={event.id}
                        event={event}
                        onEdit={onEditMeal}
                        onDuplicate={onDuplicateMeal}
                        onDelete={onDeleteMeal}
                      />
                    ))}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

