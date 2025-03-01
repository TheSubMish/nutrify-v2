'use client'

import * as React from 'react'
import { Apple, Calendar, MessageSquare, User2, Utensils } from 'lucide-react'

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
} from '@/components/ui/sidebar'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'

// Sample data - replace with real data in your implementation
const data = {
  user: {
    name: 'Sarah Wilson',
    plan: 'Weight Loss Plan',
    progress: 68,
    avatar: '/placeholder.svg?height=40&width=40'
  },
  weekDays: [
    { day: 'Monday', isActive: true },
    { day: 'Tuesday', isActive: false },
    { day: 'Wednesday', isActive: false },
    { day: 'Thursday', isActive: false },
    { day: 'Friday', isActive: false },
    { day: 'Saturday', isActive: false },
    { day: 'Sunday', isActive: false }
  ],
  mealTypes: [
    { name: 'Breakfast', time: '8:00 AM' },
    { name: 'Lunch', time: '1:00 PM' },
    { name: 'Snack', time: '4:00 PM' },
    { name: 'Dinner', time: '7:00 PM' }
  ]
}

export default function AppSidebar() {
  return (
    <SidebarProvider>
        <Sidebar>
            <SidebarHeader className="border-b border-border p-4">
                <div className="flex items-center gap-3">
                <Avatar>
                    <AvatarImage src={data.user.avatar} alt={data.user.name} />
                    <AvatarFallback>{data.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1">
                    <h3 className="font-semibold">{data.user.name}</h3>
                    <p className="text-xs text-muted-foreground">{data.user.plan}</p>
                </div>
                </div>
                <div className="mt-4">
                <div className="flex justify-between text-xs mb-2">
                    <span>Progress</span>
                    <span>{data.user.progress}%</span>
                </div>
                <Progress value={data.user.progress} className="h-2" />
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                        <a href="/chat">
                            <MessageSquare className="h-4 w-4" />
                            <span>Nutrition Chat</span>
                        </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                        <a href="/profile">
                            <User2 className="h-4 w-4" />
                            <span>My Profile</span>
                        </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                <SidebarGroupLabel>Weekly Schedule</SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenu>
                    {data.weekDays.map((day) => (
                        <SidebarMenuItem key={day.day}>
                        <SidebarMenuButton asChild isActive={day.isActive}>
                            <a href={`/schedule/${day.day.toLowerCase()}`}>
                            <Calendar className="h-4 w-4" />
                            <span>{day.day}</span>
                            </a>
                        </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                    </SidebarMenu>
                </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                <SidebarGroupLabel>Today's Meals</SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenu>
                    {data.mealTypes.map((meal) => (
                        <SidebarMenuItem key={meal.name}>
                        <SidebarMenuButton asChild>
                            <a href={`/meals/${meal.name.toLowerCase()}`}>
                            <Utensils className="h-4 w-4" />
                            <span>{meal.name}</span>
                            <span className="ml-auto text-xs text-muted-foreground">
                                {meal.time}
                            </span>
                            </a>
                        </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                    </SidebarMenu>
                </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t border-border p-4">
                <div className="flex items-center gap-2">
                <Apple className="h-4 w-4" />
                <span className="text-xs text-muted-foreground">
                    Daily Calorie Goal: 2000 kcal
                </span>
                </div>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    </SidebarProvider>
  )
}