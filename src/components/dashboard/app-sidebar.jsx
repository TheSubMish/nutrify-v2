"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Calendar, ChevronDown, ChevronRight, Home, MessageSquare, LogOut, User2, Utensils } from "lucide-react"
import { usePathname, useSearchParams } from "next/navigation"
import { format } from "date-fns"
import { useAuth } from "@/contexts/AuthContext"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { toast } from "sonner"
import HamburgerMenu from "@/components/HamburgerMenu"

const defaultUserData = {
  weekDays: [
    { day: "Monday", isActive: false },
    { day: "Tuesday", isActive: false },
    { day: "Wednesday", isActive: false },
    { day: "Thursday", isActive: false },
    { day: "Friday", isActive: false },
    { day: "Saturday", isActive: false },
    { day: "Sunday", isActive: false },
  ],
  mealTypes: [
    { name: "Breakfast", time: "8:00 AM", completed: true },
    { name: "Lunch", time: "1:00 PM", completed: true },
    { name: "Snack", time: "4:00 PM", completed: false },
    { name: "Dinner", time: "7:00 PM", completed: false },
  ],
}

export function AppSidebar({ userData = defaultUserData }) {
  const [weeklyScheduleOpen, setWeeklyScheduleOpen] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const { signOut } = useAuth()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const today = format(new Date(), "yyyy-MM-dd")
  const isSchedulePage = pathname === "/dashboard/schedule"
  const currentView = isSchedulePage ? searchParams.get("view") || "week" : "week"
  const currentDate = isSchedulePage ? searchParams.get("date") || today : today

  useEffect(() => {
    if (isSchedulePage && currentDate) {
      const dayOfWeek = format(new Date(currentDate), "EEEE")
      // Update weekDays logic here if needed
    }
  }, [isSchedulePage, currentDate, userData.weekDays])

  const toggleMenu = () => setIsOpen((prev) => !prev)
  const closeMenu = () => setIsOpen(false)

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      toast.error("Failed to sign out")
    }
  }

  const buildScheduleUrl = (params = {}) => {
    const urlParams = new URLSearchParams()
    urlParams.set("date", params.date || currentDate)
    urlParams.set("view", params.view || currentView)
    if (params.type) urlParams.set("type", params.type)
    return `/dashboard/schedule?${urlParams.toString()}`
  }

  return (
    <>
      {/* Hamburger Menu */}
      <div
        className="md:hidden fixed top-7 right-6 cursor-pointer z-50"
        onClick={toggleMenu}
        aria-expanded={isOpen}
      >
        <HamburgerMenu isOpen={isOpen} />
      </div>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-30 transition-opacity md:hidden ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        onClick={closeMenu}
      />

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-[280px] bg-background border-r z-40 transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 md:relative`}
      >
        <div className="p-6 flex justify-center">
          <Link
            href="/"
            className="text-2xl md:text-3xl lg:text-4xl font-bold gabarito-uniquifier"
            onClick={closeMenu}
          >
            <span className="slackey-regular secondary">Nutrifyme</span>
          </Link>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-200px)]">
          {/* Navigation Menu */}
          <div className="px-4 py-2">
            <Link
              href="/dashboard"
              className={`flex items-center p-2 rounded-lg ${pathname === "/dashboard" ? "bg-accent" : ""
                }`}
              onClick={closeMenu}
            >
              <Home className="h-4 w-4 mr-3" />
              Dashboard
            </Link>
            <Link
              href="/dashboard/chat"
              className={`flex items-center p-2 rounded-lg ${pathname === "/dashboard" ? "bg-accent" : ""
                }`}
              onClick={closeMenu}
            >
              <MessageSquare className="h-4 w-4 mr-3" />
              Nutrition Coach
            </Link>
            <Link
              href="/dashboard/profile"
              className={`flex items-center p-2 rounded-lg ${pathname === "/dashboard" ? "bg-accent" : ""
                }`}
              onClick={closeMenu}
            >
              <User2 className="h-4 w-4 mr-3" />
              Profile
            </Link>
            {/* Add other menu items similarly */}
          </div>
          {/* Today's Meals */}
          <div className="px-4 py-2">
            <h3 className="text-sm font-semibold text-muted-foreground px-2 mb-2">
              Today's Meals
            </h3>
            {userData.mealTypes.map((meal) => (
              <Link
                key={meal.name}
                href={buildScheduleUrl({ type: meal.name.toLowerCase(), date: today, view: "day" })}
                className={`flex items-center p-2 rounded-lg ${isSchedulePage && searchParams.get("type") === meal.name.toLowerCase()
                  ? "bg-accent"
                  : ""
                  }`}
                onClick={closeMenu}
              >
                <Utensils className="h-4 w-4 mr-3" />
                {meal.name}
              </Link>
            ))}
          </div>

          {/* Weekly Schedule */}
          <Collapsible
            open={weeklyScheduleOpen}
            onOpenChange={setWeeklyScheduleOpen}
            className="px-4 py-2"
          >
            <CollapsibleTrigger className="w-full flex justify-between items-center p-2 rounded-lg">
              <span className="text-sm font-semibold text-muted-foreground">
                Weekly Schedule
              </span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${weeklyScheduleOpen ? "rotate-180" : ""
                  }`}
              />
            </CollapsibleTrigger>
            <CollapsibleContent>
              {userData.weekDays.map((day) => (
                <Link
                  key={day.day}
                  href={buildScheduleUrl({ date: today, view: "day" })}
                  className="flex items-center p-2 rounded-lg"
                  onClick={closeMenu}
                >
                  <Calendar className="h-4 w-4 mr-3" />
                  {day.day}
                </Link>
              ))}
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 w-full border-t p-4">
          <button
            onClick={handleSignOut}
            className="flex items-center w-full p-2 rounded-lg"
          >
            <LogOut className="h-4 w-4 mr-3" />
            Sign Out
          </button>
        </div>
      </div>
    </>
  )
}
