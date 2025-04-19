"use client"

import { useEffect, useState } from "react"
import FitnessGoals from "./fitness-goals"
import ProgressTracker from "./progress-tracker"
import { useAppStore } from "@/store"
import { toast } from "sonner"

// Default values as a constant for easy maintenance
const DEFAULT_GOALS = {
    targetWeight: 0,
    weeklyLoss: 0.5,
    calorieGoal: 2000,
    proteinGoal: 50,
    carbsGoal: 250,
    fatGoal: 70,
    fiberGoal: 25,
    sugarGoal: 30,
    activityLevel: "moderate",
}

export default function FitnessDashboard({ setActiveSave }) {
    const { user, userMetrics, userGoals, setUserGoals, weightHistory, setWeightHistory } = useAppStore()
    const [loading, setLoading] = useState(true)
    const [targetWeight, setTargetWeight] = useState(DEFAULT_GOALS.targetWeight)

    useEffect(() => {
        const fetchData = async () => {
            if (!user) {
                toast.error("Please log in to access your dashboard.")
                setLoading(false)
                return
            }

            try {
                setLoading(true)
                const res = await fetch("/api/fitness-goals")

                // Handle API errors first
                if (!res.ok) {
                    toast.error("Failed to fetch fitness goals. Using default values.")
                    setUserGoals(DEFAULT_GOALS)
                    setWeightHistory([])
                    return
                }

                const response = await res.json()
                const apiData = response.data || {}
                const message = response.message

                // Safely extract values with multiple fallbacks
                const fitnessGoals = apiData.fitnessGoals || {}
                const rawWeightHistory = apiData.weightHistory || []

                // Merge API response with defaults using current metrics
                const mergedGoals = {
                    targetWeight: fitnessGoals.target_weight ??
                        userMetrics?.weight ??
                        DEFAULT_GOALS.targetWeight,
                    weeklyLoss: fitnessGoals.weekly_weight_change ??
                        DEFAULT_GOALS.weeklyLoss,
                    calorieGoal: fitnessGoals.calorie_goal ??
                        DEFAULT_GOALS.calorieGoal,
                    proteinGoal: fitnessGoals.protein_goal ??
                        DEFAULT_GOALS.proteinGoal,
                    carbsGoal: fitnessGoals.carbs_goal ??
                        DEFAULT_GOALS.carbsGoal,
                    fatGoal: fitnessGoals.fat_goal ??
                        DEFAULT_GOALS.fatGoal,
                    fiberGoal: fitnessGoals.fiber_goal ??
                        DEFAULT_GOALS.fiberGoal,
                    sugarGoal: fitnessGoals.sugar_goal ??
                        DEFAULT_GOALS.sugarGoal,
                    activityLevel: fitnessGoals.activity_level?.toLowerCase() ??
                        DEFAULT_GOALS.activityLevel,
                }

                // Update global state
                setUserGoals(mergedGoals)
                setWeightHistory(Array.isArray(rawWeightHistory) ? rawWeightHistory : [])
                setTargetWeight(mergedGoals.targetWeight)

                if (message) toast.success(message)
            } catch (err) {
                toast.error("Using default values due to connection error.")
                setUserGoals(DEFAULT_GOALS)
                setWeightHistory([])
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [user, setUserGoals, setWeightHistory, userMetrics])

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                <p className="text-muted-foreground">Loading...</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FitnessGoals setActiveSave={setActiveSave} />

            {Array.isArray(weightHistory) && weightHistory.length > 0 ? (
                <ProgressTracker
                    weightHistory={weightHistory}
                    targetWeight={targetWeight}
                />
            ) : (
                <div className="text-muted-foreground">
                    No weight history data to track progress yet.
                </div>
            )}
        </div>
    )
}

