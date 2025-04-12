"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Calendar, ChevronDown, ChevronRight, Home, MessageSquare, LogOut, User2, Utensils } from "lucide-react"
import { usePathname, useSearchParams } from "next/navigation"
import { format } from "date-fns"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar"
import HamburgerMenu from "@/components/HamburgerMenu"
import { useAppStore } from "@/store"
// import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { supabase } from "@/supabase.config.mjs"

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
  const [hidden, setHidden] = useState(false)
  const { logout } = useAppStore()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Get current date in YYYY-MM-DD format for links
  const today = format(new Date(), "yyyy-MM-dd")

  // Check if we're on the schedule page
  const isSchedulePage = pathname === "/dashboard/schedule"

  // Get current filter values from URL if we're on the schedule page
  const currentView = isSchedulePage ? searchParams.get("view") || "week" : "week"
  const currentDate = isSchedulePage ? searchParams.get("date") || today : today

  // Determine which day of the week is active based on the current date
  useEffect(() => {
    if (isSchedulePage && currentDate) {
      const dayOfWeek = format(new Date(currentDate), "EEEE")

      // Update the weekDays array to mark the current day as active
      const updatedWeekDays = userData.weekDays.map((day) => ({
        ...day,
        isActive: day.day === dayOfWeek,
      }))

      // We can't directly modify userData since it's a prop, but in a real app
      // you would update this in your state management system
    }
  }, [isSchedulePage, currentDate, userData.weekDays])

  const toggleMenu = () => setIsOpen((prev) => !prev)
  const closeMenu = () => setIsOpen(false)

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    logout()
    // Redirect to login page after logout
    window.location.href = "/auth/login"
  }

  // Helper function to build schedule page URLs with the correct parameters
  const buildScheduleUrl = (params = {}) => {
    const urlParams = new URLSearchParams()

    // Add date parameter (default to today if not provided)
    urlParams.set("date", params.date || currentDate)

    // Add view parameter (default to current view or week)
    urlParams.set("view", params.view || currentView)

    // Add type parameter if provided
    if (params.type) {
      urlParams.set("type", params.type)
    }

    return `/dashboard/schedule?${urlParams.toString()}`
  }

  return (
    <SidebarProvider>
      {/* Hamburger Menu for Mobile */}
      <div
        className="md:hidden fixed top-7 right-6 cursor-pointer z-50"
        onClick={toggleMenu}
        aria-expanded={isOpen}
        aria-controls="sidebar-menu"
      >
        <HamburgerMenu isOpen={isOpen} />
      </div>

      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-30 transition-opacity duration-300 md:hidden ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        onClick={closeMenu}
      />

      {/* Sidebar */}
      <div className="relative flex h-screen">
        <div
          className={`fixed inset-y-0 left-0 w-[280px] md:w-auto md:relative md:translate-x-0 transform transition-transform duration-300 ease-in-out z-40 ${isOpen ? "translate-x-0" : "-translate-x-full"
            }`}
        >
          <Sidebar className="border-r h-full bg-background">
            {/* Sidebar Header */}
            <div className="p-6 flex justify-center">
              <Link
                href="/"
                className="items-center text-center gap-2 text-2xl md:text-3xl lg:text-4xl font-bold z-10 gabarito-uniquifier"
                onClick={closeMenu}
              >
                <span className="text-center slackey-regular secondary">Nutrifyme</span>
              </Link>
            </div>

            {/* Sidebar Content */}
            <SidebarContent className="overflow-y-auto max-h-[calc(100vh-200px)] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
              {/* Navigation */}
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={pathname === "/dashboard"} onClick={closeMenu}>
                        <Link href="/dashboard">
                          <Home className="h-4 w-4" />
                          <span>Dashboard</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={pathname === "/dashboard/chat"} onClick={closeMenu}>
                        <Link href="/dashboard/chat">
                          <MessageSquare className="h-4 w-4" />
                          <span>Nutrition Coach</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={pathname === "/dashboard/profile"} onClick={closeMenu}>
                        <Link href="/dashboard/profile">
                          <User2 className="h-4 w-4" />
                          <span>My Profile</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              {/* Today's Meals */}
              <SidebarGroup>
                <SidebarGroupLabel>Today's Meals</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {userData.mealTypes.map((meal) => (
                      <SidebarMenuItem key={meal.name}>
                        <SidebarMenuButton
                          asChild
                          isActive={isSchedulePage && searchParams.get("type") === meal.name.toLowerCase()}
                          onClick={closeMenu}
                        >
                          <Link
                            href={buildScheduleUrl({
                              type: meal.name.toLowerCase(),
                              date: today, // Always use today's date for meal types
                              view: "day", // Use day view for meal types
                            })}
                          >
                            <Utensils className="h-4 w-4" />
                            <span>{meal.name}</span>
                            {/* <span className="ml-auto flex items-center text-xs">
                              {meal.completed ? (
                                <Badge variant="outline" className="bg-[#147870] text-white py-1">
                                  Completed
                                </Badge>
                              ) : (
                                <span className="text-muted-foreground">{meal.time}</span>
                              )}
                            </span> */}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              {/* Weekly Schedule */}
              <SidebarGroup>
                <Collapsible open={weeklyScheduleOpen} onOpenChange={setWeeklyScheduleOpen} className="w-full">
                  <SidebarGroupLabel asChild>
                    <CollapsibleTrigger className="flex w-full items-center justify-between">
                      <span>Weekly Schedule</span>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${weeklyScheduleOpen ? "rotate-180" : ""}`}
                      />
                    </CollapsibleTrigger>
                  </SidebarGroupLabel>
                  <CollapsibleContent>
                    <SidebarGroupContent>
                      <SidebarMenu>
                        {userData.weekDays.map((day) => {
                          // Calculate the date for this day of the week
                          const today = new Date()
                          const dayIndex = [
                            "Sunday",
                            "Monday",
                            "Tuesday",
                            "Wednesday",
                            "Thursday",
                            "Friday",
                            "Saturday",
                          ].indexOf(day.day)
                          const currentDayIndex = today.getDay() // 0 = Sunday, 1 = Monday, etc.
                          const daysToAdd = (dayIndex - currentDayIndex + 7) % 7

                          const dayDate = new Date(today)
                          dayDate.setDate(today.getDate() + daysToAdd)
                          const formattedDate = format(dayDate, "yyyy-MM-dd")

                          return (
                            <SidebarMenuItem key={day.day}>
                              <SidebarMenuButton
                                asChild
                                isActive={isSchedulePage && format(new Date(currentDate), "EEEE") === day.day}
                                onClick={closeMenu}
                              >
                                <Link
                                  href={buildScheduleUrl({
                                    date: formattedDate,
                                    view: "day", // Use day view for specific days
                                  })}
                                >
                                  <Calendar className="h-4 w-4" />
                                  <span>{day.day}</span>
                                  {day.isActive && <ChevronRight className="ml-auto h-4 w-4" />}
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          )
                        })}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarGroup>
            </SidebarContent>

            {/* Sidebar Footer */}
            <SidebarFooter className="border-t border-border p-4 mt-auto">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <div onClick={handleSignOut}>
                      <LogOut className="h-4 w-4" />
                      <span>Sign-Out</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
          </Sidebar>
        </div>
      </div>
    </SidebarProvider>
  )
}

