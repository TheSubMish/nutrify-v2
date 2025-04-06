"use client"

import { useEffect, useState } from "react"
import FitnessGoals from "./fitness-goals"
import ProgressTracker from "./progress-tracker"
import { useAppStore } from "@/store"
import { toast } from "sonner"
import { getFitnessGoals } from "@/utils/getFitnessGoals.mjs"

export default function FitnessDashboard({ setActiveSave }) {
    const { user, userMetrics, userGoals, setUserGoals, weightHistory, setWeightHistory } = useAppStore()
    const [loading, setLoading] = useState(true)

    const [targetWeight, setTargetWeight] = useState(0)

    useEffect(() => {
        const fetchData = async () => {
            if (!user) {
                toast.error("Please log in to access your dashboard.")
                setLoading(false)
                return
            }

            // console.log(weightHistory);
            

            // Check if userMetrics is available
            // if ((userGoals && Object.keys(userGoals).length > 0)){
            //     setLoading(false)
            //     return
            // }

            try {
                setLoading(true)

                const res = await fetch("/api/fitness-goals")

                if (!res.ok) {
                    toast.error("Failed to fetch fitness goals.")
                    setLoading(false)
                    return
                }

                const response = await res.json()
                const { fitnessGoals, weightHistory } = response.data

                const defaultGoals = {
                    targetWeight: userMetrics?.weight || 0,
                    weeklyLoss: 0.5,
                    calorieGoal: 0,
                    proteinGoal: 0,
                    carbsGoal: 0,
                    fatGoal: 0,
                    fiberGoal: 0,
                    sugarGoal: 0,
                    activityLevel: "moderate",
                }

                // Store in global state
                setUserGoals({
                    targetWeight: fitnessGoals.target_weight ?? defaultGoals.targetWeight,
                    weeklyLoss: fitnessGoals.weekly_loss ?? defaultGoals.weeklyLoss,
                    calorieGoal: fitnessGoals.calorie_goal ?? defaultGoals.calorieGoal,
                    proteinGoal: fitnessGoals.protein_goal ?? defaultGoals.proteinGoal,
                    carbsGoal: fitnessGoals.carbs_goal ?? defaultGoals.carbsGoal,
                    fatGoal: fitnessGoals.fat_goal ?? defaultGoals.fatGoal,
                    fiberGoal: fitnessGoals.fiber_goal ?? defaultGoals.fiberGoal,
                    sugarGoal: fitnessGoals.sugar_goal ?? defaultGoals.sugarGoal,
                    activityLevel: fitnessGoals.activity_level ?? defaultGoals.activityLevel,
                })

                // setUserMetrics({ weightHistory: weightHistory ?? [] })

                setWeightHistory([weightHistory] ?? [])
                setTargetWeight(fitnessGoals?.target_weight ?? 0)
            } catch (err) {
                console.error(err)
                toast.error("Something went wrong while loading data.")
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [user, setUserGoals])

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <p className="text-xl font-medium">Loading Fitness Goals...</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FitnessGoals setActiveSave={setActiveSave} />
            {weightHistory?.length > 0 && targetWeight ? (
                <ProgressTracker weightHistory={weightHistory} targetWeight={targetWeight} />
            ) : null}
        </div>
    )
}

