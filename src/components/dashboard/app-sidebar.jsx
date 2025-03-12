"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Calendar,
  ChevronDown,
  ChevronRight,
  Flame,
  Heart,
  Home,
  MessageSquare,
  Settings,
  Sparkles,
  User2,
  Utensils,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar";
import HamburgerMenu from "@/components/HamburgerMenu";

// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

// Sample dynamic data (replace with API data)
const defaultUserData = {
  user: {
    name: "Sarah Wilson",
    plan: "AI Weight Loss Plan",
    progress: 68,
    avatar: "/placeholder.svg?height=40&width=40",
    streak: 12,
  },
  weekDays: [
    { day: "Monday", isActive: true },
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
  stats: {
    calories: {
      consumed: 1490,
      goal: 2000,
    },
    water: {
      consumed: 5,
      goal: 8,
    },
  },
}

export function AppSidebar({ userData = defaultUserData }) {
  const [weeklyScheduleOpen, setWeeklyScheduleOpen] = useState(false)
  const toggleMenu = () => setIsOpen((prev) => !prev)
  const [isOpen, setIsOpen] = useState(false)
  const [hidden, setHidden] = useState(false);
  const closeMenu = () => setIsOpen(false)

  return (
    <SidebarProvider>
      <Sidebar className="border-r">
        {/* Sidebar Header */}
        <Link
          href="/"
          className="items-center text-center p-6 gap-2 text-2xl md:text-3xl lg:text-4xl font-bold z-10 gabarito-uniquifier"
        >
          {/* <Image
            src="/logo.png"
            alt="Nutrifyme Logo"
            width={48}
            height={48}
            className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12"
          /> */}
          <span className="text-center slackey-regular secondary">Nutrifyme</span>
        </Link>
        <div
          className="md:hidden cursor-pointer z-20"
          onClick={toggleMenu}
          aria-expanded={isOpen}
          aria-controls="navbar-menu"
        >
          <HamburgerMenu isOpen={isOpen} />
        </div>
        {/* <SidebarHeader className="border-b border-border p-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={userData.user.avatar} alt={userData.user.name} />
              <AvatarFallback>{userData.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <div className="flex items-center">
                <h3 className="font-semibold">{userData.user.name}</h3>
                <Badge
                  variant="outline"
                  className="ml-2 bg-amber-100 text-amber-800 border-amber-200 text-xs"
                  aria-label="Streak Count"
                >
                  <Flame className="h-3 w-3 mr-1" />
                  {userData.user.streak} day streak
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground flex items-center">
                <Sparkles className="h-3 w-3 mr-1 text-primary" />
                {userData.user.plan}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-2">
              <span>Weight Loss Progress</span>
              <span>{userData.user.progress}%</span>
            </div>
            <Progress value={userData.user.progress} className="h-2" />
          </div>
        </SidebarHeader> */}

        {/* Sidebar Content */}
        <SidebarContent className="overflow-y-auto max-h-screen scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
          {/* Navigation */}
          <SidebarGroup>
            {/* <SidebarGroupLabel>Navigation</SidebarGroupLabel> */}
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={true}>
                    <a href="/dashboard">
                      <Home className="h-4 w-4" />
                      <span>Dashboard</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="/dashboard/chat">
                      <MessageSquare className="h-4 w-4" />
                      <span>Nutrition Coach</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="/dashboard/profile">
                      <User2 className="h-4 w-4" />
                      <span>My Profile</span>
                    </a>
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
                    <SidebarMenuButton asChild>
                      <a href={`/dashboard/meals/${meal.name.toLowerCase()}`}>
                        <Utensils className="h-4 w-4" />
                        <span>{meal.name}</span>
                        <span className="ml-auto flex items-center text-xs">
                          {meal.completed ? (
                            <Badge variant="outline" className="bg-[#147870] text-white py-1">
                              Completed
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">{meal.time}</span>
                          )}
                        </span>
                      </a>
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
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${weeklyScheduleOpen ? "rotate-180" : ""}`} />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {userData.weekDays.map((day) => (
                      <SidebarMenuItem key={day.day}>
                        <SidebarMenuButton asChild isActive={day.isActive} onClick={(e) => e.stopPropagation()}>
                          <a href={`/dashboard/schedule/${day.day.toLowerCase()}`}>
                            <Calendar className="h-4 w-4" />
                            <span>{day.day}</span>
                            {day.isActive && <ChevronRight className="ml-auto h-4 w-4" />}
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </Collapsible>
          </SidebarGroup>
        </SidebarContent>

        {/* Sidebar Footer */}
        <SidebarFooter className="border-t border-border p-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/dashboard/settings">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    </SidebarProvider>
  )
}
