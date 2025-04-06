"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"

export default function ProgressTracker({ weightHistory, targetWeight }) {
  const [loading, setLoading] = useState(true)

  // Fix 1: Handle the nested array structure
  const flattenedHistory =
    Array.isArray(weightHistory) && weightHistory.length > 0 && Array.isArray(weightHistory[0])
      ? weightHistory[0]
      : weightHistory || []

  // Format data for the chart
  const chartData = flattenedHistory.map((entry) => ({
    date: new Date(entry.recorded_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    weight: entry.weight,
  }))

  // Fix 2: Use weight property instead of value for min/max calculations
  const minWeight =
    flattenedHistory.length > 0
      ? Math.min(...flattenedHistory.map((entry) => entry.weight), targetWeight) - 2
      : targetWeight - 2

  const maxWeight =
    flattenedHistory.length > 0
      ? Math.max(...flattenedHistory.map((entry) => entry.weight), targetWeight) + 2
      : targetWeight + 2

  useEffect(() => {
    if (flattenedHistory && flattenedHistory.length > 0) {
      setLoading(false)
    }
  }, [flattenedHistory])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading...</CardTitle>
          <CardDescription>Please wait while we load your data.</CardDescription>
        </CardHeader>
        <CardContent>Loading chart...</CardContent>
      </Card>
    )
  }

  // Fix 3: Handle empty data case
  if (flattenedHistory.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Data Available</CardTitle>
          <CardDescription>Start tracking your weight to see progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-8 text-center text-muted-foreground">
            No weight entries found. Add your first weight entry to start tracking.
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weight Progress</CardTitle>
        <CardDescription>Track your weight changes over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#888" opacity={0.2} />
              <XAxis dataKey="date" />
              <YAxis domain={[minWeight, maxWeight]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
              <ReferenceLine
                y={targetWeight}
                stroke="#FF4500"
                strokeDasharray="3 3"
                label={{ value: "Target", position: "insideBottomRight" }}
              />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="#2563EB"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="border-2 border-gray-400 rounded-lg p-3 text-center">
            <div className="text-sm text-muted-foreground">Starting Weight</div>
            <div className="text-xl font-semibold">{flattenedHistory[0].weight} kg</div>
          </div>
          <div className="border-2 border-gray-400 rounded-lg p-3 text-center">
            <div className="text-sm text-muted-foreground">Current Weight</div>
            <div className="text-xl font-semibold">{flattenedHistory[flattenedHistory.length - 1].weight} kg</div>
          </div>
          <div className="border-2 border-gray-400 rounded-lg p-3 text-center">
            <div className="text-sm text-muted-foreground">Target Weight</div>
            <div className="text-xl font-semibold">{targetWeight} kg</div>
          </div>
          <div className="border-2 border-gray-400 rounded-lg p-3 text-center">
            <div className="text-sm text-muted-foreground">Weight {(flattenedHistory[0].weight) > flattenedHistory[flattenedHistory.length - 1].weight ? "Lost" : "Gained"}</div>
            <div className="text-xl font-semibold">
              {(flattenedHistory[0].weight - flattenedHistory[flattenedHistory.length - 1].weight).toFixed(1)} kg
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

