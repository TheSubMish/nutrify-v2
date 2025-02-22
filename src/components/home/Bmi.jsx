"use client"

import { useState, useCallback } from "react"
import { Calculator } from "lucide-react"
import Button from "@/components/ui/button"
import Input from "@/components/ui/input"
import Label from "@/components/ui/Label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/RadioGroup"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function BMICalculator() {
  const [height, setHeight] = useState("")
  const [weight, setWeight] = useState("")
  const [gender, setGender] = useState("male")
  const [bmi, setBMI] = useState(null)
  const [idealWeight, setIdealWeight] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState("")

  const validateInputs = () => {
    const heightNum = parseFloat(height)
    const weightNum = parseFloat(weight)

    if (!height || heightNum <= 50 || heightNum > 300 || isNaN(heightNum)) {
      setError("Please enter a valid height between 50cm and 300cm.")
      return false
    }
    if (!weight || weightNum <= 10 || weightNum > 300 || isNaN(weightNum)) {
      setError("Please enter a valid weight between 10kg and 300kg.")
      return false
    }
    setError("")
    return true
  }

  const calculateIdealWeight = (height, gender) => {
    return gender === "male"
      ? 50 + 2.3 * ((height - 152.4) / 2.54)
      : 45.5 + 2.3 * ((height - 152.4) / 2.54)
  }

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { category: "Underweight", color: "text-blue-600" }
    else if (bmi < 25) return { category: "Normal weight", color: "text-green-600" }
    else if (bmi < 30) return { category: "Overweight", color: "text-yellow-600" }
    else return { category: "Obese", color: "text-red-600" }
  }

  const calculateBMI = useCallback(() => {
    if (!validateInputs()) return

    setIsLoading(true)
    setIsOpen(true)
    setBMI(null)
    setIdealWeight(null)

    setTimeout(() => {
      const heightInMeters = parseFloat(height) / 100
      const weightInKg = parseFloat(weight)
      const calculatedBMI = weightInKg / (heightInMeters * heightInMeters)
      const bmiValue = calculatedBMI.toFixed(1)

      setBMI(bmiValue)
      setIdealWeight(calculateIdealWeight(parseFloat(height), gender).toFixed(1))
      setIsLoading(false)
    }, 1000)
  }, [height, weight, gender])

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-200 lg:px-24 xl:px-40">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gray-900">
              BMI & Ideal Weight Calculator
            </h2>
            <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl">
              Calculate your Body Mass Index (BMI) and ideal weight to start your personalized diet journey.
            </p>
          </div>
          <div className="w-full max-w-sm space-y-4">
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                placeholder="Enter your height (cm)"
                type="number"
                min="50"
                max="300"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                placeholder="Enter your weight (kg)"
                type="number"
                min="10"
                max="300"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Gender</Label>
              <RadioGroup value={gender} onValueChange={setGender} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female">Female</Label>
                </div>
              </RadioGroup>
            </div>
            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
            <Button onClick={calculateBMI} className="w-full bg-blue-600 hover:bg-blue-700">
              <Calculator className="mr-2 h-4 w-4" /> Calculate
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-gray-900">BMI & Ideal Weight Results</DialogTitle>
          </DialogHeader>
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
            </div>
          ) : (
            bmi && (
              <div className="space-y-4">
                <div>
                  <p className="text-gray-600 mb-1">Your BMI:</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {bmi}
                  </p>
                  <p className={`${getBMICategory(bmi).color} font-semibold mt-1`}>
                    {getBMICategory(bmi).category}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Ideal Weight:</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {idealWeight} kg
                  </p>
                </div>
              </div>
            )
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}