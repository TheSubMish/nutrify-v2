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

export default function ScheduleWeekView({ currentDate, mealEvents, onAddMeal }) {
  const startDate = startOfWeek(currentDate, { weekStartsOn: 0 })
  const endDate = endOfWeek(currentDate, { weekStartsOn: 0 })
  const days = eachDayOfInterval({ start: startDate, end: endDate })

  const handleCellClick = (day, time) => {
    onAddMeal({ date: day, time })
  }

  // Get events for a specific day and time slot
  const getEventsForSlot = (day, timeSlot) => {
    return mealEvents.filter((event) => {
      return isSameDay(event.date, day) && event.startTime === timeSlot
    })
  }

  return (
    <div className="overflow-auto">
      <div className="min-w-[800px]">
        {/* Header with days */}
        <div className="grid grid-cols-8 border-b">
          <div className="p-2 border-r bg-muted/50 text-center font-medium">Time</div>
          {days.map((day, i) => (
            <div key={i} className={cn("p-2 text-center font-medium", isSameDay(day, new Date()) && "bg-primary/10")}>
              <div>{format(day, "EEE")}</div>
              <div className="text-sm">{format(day, "MMM d")}</div>
            </div>
          ))}
        </div>

        {/* Time grid */}
        <div>
          {timeSlots.map((time, timeIndex) => (
            <div key={time} className="grid grid-cols-8 border-b">
              <div className="p-2 border-r bg-muted/50 text-xs text-center">{time}</div>

              {days.map((day, dayIndex) => {
                const events = getEventsForSlot(day, time)
                return (
                  <div
                    key={dayIndex}
                    className={cn(
                      "p-1 min-h-[60px] border-r relative",
                      isSameDay(day, new Date()) && "bg-primary/5",
                      timeIndex % 2 === 0 && "border-b border-dashed",
                    )}
                    onClick={() => handleCellClick(day, time)}
                  >
                    {events.map((event) => (
                      <MealEvent key={event.id} event={event} />
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

