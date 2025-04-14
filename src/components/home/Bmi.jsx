"use client"

import { useState, useCallback } from "react"
import { Calculator } from "lucide-react"

// Simple custom components
const Button = ({ children, onClick, className }) => (
  <button onClick={onClick} className={`px-4 py-2 rounded-md font-medium text-white ${className}`}>
    {children}
  </button>
)

const Input = ({ id, placeholder, type, min, max, value, onChange }) => (
  <input
    id={id}
    placeholder={placeholder}
    type={type}
    min={min}
    max={max}
    value={value}
    onChange={onChange}
    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
)

const Label = ({ htmlFor, children }) => (
  <label htmlFor={htmlFor} className="text-sm font-medium text-gray-700">
    {children}
  </label>
)

const RadioGroup = ({ value, onValueChange, className, children }) => <div className={className}>{children}</div>

const RadioGroupItem = ({ value, id, checked, onChange }) => (
  <input
    type="radio"
    value={value}
    id={id}
    checked={checked}
    onChange={onChange}
    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
  />
)

const Select = ({ value, onChange, children, className }) => (
  <select
    value={value}
    onChange={onChange}
    className={`px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
  >
    {children}
  </select>
)

const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        <div className="flex justify-end">
          <button onClick={() => onOpenChange(false)} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

const DialogContent = ({ children }) => <div>{children}</div>
const DialogHeader = ({ children }) => <div className="mb-4">{children}</div>
const DialogTitle = ({ className, children }) => <h2 className={`text-xl font-bold ${className}`}>{children}</h2>

export default function BMICalculator() {
  const [height, setHeight] = useState("")
  const [heightUnit, setHeightUnit] = useState("cm")
  const [weight, setWeight] = useState("")
  const [weightUnit, setWeightUnit] = useState("kg")
  const [gender, setGender] = useState("male")
  const [bmi, setBMI] = useState(null)
  const [idealWeight, setIdealWeight] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState("")

  // Convert height when unit changes
  const handleHeightUnitChange = (e) => {
    const newUnit = e.target.value

    if (height && !isNaN(Number.parseFloat(height))) {
      const numericHeight = Number.parseFloat(height)

      if (newUnit === "cm" && heightUnit === "in") {
        // Convert from inches to cm (in * 2.54)
        setHeight((numericHeight * 2.54).toFixed(1))
      } else if (newUnit === "in" && heightUnit === "cm") {
        // Convert from cm to inches (cm / 2.54)
        setHeight((numericHeight / 2.54).toFixed(1))
      }
    }

    setHeightUnit(newUnit)
  }

  // Convert weight when unit changes
  const handleWeightUnitChange = (e) => {
    const newUnit = e.target.value

    if (weight && !isNaN(Number.parseFloat(weight))) {
      const numericWeight = Number.parseFloat(weight)

      if (newUnit === "kg" && weightUnit === "lb") {
        // Convert from lb to kg (lb / 2.20462)
        setWeight((numericWeight / 2.20462).toFixed(1))
      } else if (newUnit === "lb" && weightUnit === "kg") {
        // Convert from kg to lb (kg * 2.20462)
        setWeight((numericWeight * 2.20462).toFixed(1))
      }
    }

    setWeightUnit(newUnit)
  }

  const validateInputs = useCallback(() => {
    let heightInCm = Number.parseFloat(height)
    let weightInKg = Number.parseFloat(weight)

    // Convert to cm/kg for validation if needed
    if (heightUnit === "in") heightInCm = heightInCm * 2.54
    if (weightUnit === "lb") weightInKg = weightInKg / 2.20462

    if (!height || heightInCm <= 50 || heightInCm > 300 || isNaN(heightInCm)) {
      setError("Please enter a valid height between 50cm and 300cm.")
      return false
    }
    if (!weight || weightInKg <= 10 || weightInKg > 300 || isNaN(weightInKg)) {
      setError("Please enter a valid weight between 10kg and 300kg.")
      return false
    }
    setError("")
    return true
  }, [height, heightUnit, weight, weightUnit])

  const calculateIdealWeight = useCallback((heightInCm, gender) => {
    return gender === "male" ? 50 + 2.3 * ((heightInCm - 152.4) / 2.54) : 45.5 + 2.3 * ((heightInCm - 152.4) / 2.54)
  }, [])

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
      // Convert to cm/kg if needed
      let heightInCm = Number.parseFloat(height)
      let weightInKg = Number.parseFloat(weight)

      if (heightUnit === "in") heightInCm = heightInCm * 2.54
      if (weightUnit === "lb") weightInKg = weightInKg / 2.20462

      const heightInMeters = heightInCm / 100
      const calculatedBMI = weightInKg / (heightInMeters * heightInMeters)
      const bmiValue = calculatedBMI.toFixed(1)

      setBMI(bmiValue)
      setIdealWeight(calculateIdealWeight(heightInCm, gender).toFixed(1))
      setIsLoading(false)
    }, 1000)
  }, [height, heightUnit, weight, weightUnit, gender, validateInputs, calculateIdealWeight])

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
              <div className="flex gap-2">
                <Input
                  id="height"
                  placeholder={`Enter your height (${heightUnit})`}
                  type="number"
                  min={heightUnit === "cm" ? "50" : "20"}
                  max={heightUnit === "cm" ? "300" : "118"}
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                />
                <Select value={heightUnit} onChange={handleHeightUnitChange} className="w-24">
                  <option value="cm">cm</option>
                  <option value="in">in</option>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  id="weight"
                  placeholder={`Enter your weight (${weightUnit})`}
                  type="number"
                  min={weightUnit === "kg" ? "10" : "22"}
                  max={weightUnit === "kg" ? "300" : "661"}
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
                <Select value={weightUnit} onChange={handleWeightUnitChange} className="w-24">
                  <option value="kg">kg</option>
                  <option value="lb">lb</option>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <RadioGroup value={gender} onValueChange={setGender} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="male"
                    id="male"
                    checked={gender === "male"}
                    onChange={() => setGender("male")}
                  />
                  <Label htmlFor="male">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="female"
                    id="female"
                    checked={gender === "female"}
                    onChange={() => setGender("female")}
                  />
                  <Label htmlFor="female">Female</Label>
                </div>
              </RadioGroup>
            </div>
            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
            <Button onClick={calculateBMI} className="w-full secondary-bg">
              <span className="flex items-center justify-center">
                <Calculator className="mr-2 h-4 w-4" /> Calculate
              </span>
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
              <div className="space-y-6">
                <div>
                  <p className="text-gray-600 mb-1">Your BMI:</p>
                  <p className="text-3xl font-bold text-gray-900">{bmi}</p>
                  <p className={`${getBMICategory(bmi).color} font-semibold mt-1`}>{getBMICategory(bmi).category}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Ideal Weight:</p>
                  <p className="text-3xl font-bold text-gray-900">{idealWeight} kg</p>
                </div>
                <div className="border-t pt-4">
                  <h3 className="font-semibold text-lg mb-2">Your Personalized Recommendation</h3>
                  {Number(bmi) < 18.5 ? (
                    <div className="space-y-2">
                      <p className="text-gray-600">
                        Your BMI indicates you're underweight. Our nutrition experts recommend gaining healthy weight
                        through proper diet and exercise.
                      </p>
                      {/* <p className="font-medium text-blue-600">
                        Try our Weight Gain Meal Plan and Premium Protein Supplements to achieve your ideal weight
                        safely! 💪
                      </p> */}
                    </div>
                  ) : Number(bmi) < 25 ? (
                    <div className="space-y-2">
                      <p className="text-gray-600">
                        Great job! Your BMI is in the healthy range. Keep up your healthy lifestyle with our maintenance
                        programs.
                      </p>
                      {/* <p className="font-medium text-green-600">
                        Check out our Wellness Package to maintain your ideal weight and improve overall fitness! 🌟
                      </p> */}
                    </div>
                  ) : Number(bmi) < 30 ? (
                    <div className="space-y-2">
                      <p className="text-gray-600">
                        Your BMI suggests you might benefit from some lifestyle adjustments to reach your optimal
                        health.
                      </p>
                      {/* <p className="font-medium text-yellow-600">
                        Discover our Weight Management Program and Healthy Meal Plans to achieve your goals! 🎯
                      </p> */}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-gray-600">
                        Your BMI indicates that a structured weight loss program could help improve your overall health.
                      </p>
                      {/* <p className="font-medium text-red-600">
                        Start your transformation today with our Complete Weight Loss Solution - including personalized
                        meal plans and expert guidance! ✨
                      </p> */}
                    </div>
                  )}
                  <Button
                    onClick={() => (window.location.href = "/dashboard")}
                    className="w-full mt-4 btn-primary hover:bg-primary/90"
                  >
                    Get Started
                  </Button>
                </div>
              </div>
            )
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}

