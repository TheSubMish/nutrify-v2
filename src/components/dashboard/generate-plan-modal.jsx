"use client"

import { useState } from "react"
import { Check, ArrowRight, Activity, Scale } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import Button from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/RadioGroup"
import Label from "@/components/ui/Label"
import { Checkbox } from "@/components/ui/checkbox"

export default function GeneratePlanModal({ isOpen, onClose }) {
    const [currentStep, setCurrentStep] = useState(1)
    const [formData, setFormData] = useState({
        goal: "weight-loss",
        activityLevel: "moderate",
        dietaryRestrictions: [],
        mealsPerDay: 4,
        calorieTarget: 2000,
        proteinPercentage: 30,
        carbsPercentage: 40,
        fatPercentage: 30,
        preferences: [],
    })

    const handleInputChange = (field, value) => {
        console.log("Field:", field, "Value:", value);

        setFormData({
            ...formData,
            [field]: value,
        })
    }

    const toggleDietaryRestriction = (restriction) => {
        const current = [...formData.dietaryRestrictions]
        if (current.includes(restriction)) {
            handleInputChange(
                "dietaryRestrictions",
                current.filter((r) => r !== restriction),
            )
        } else {
            handleInputChange("dietaryRestrictions", [...current, restriction])
        }
    }

    const togglePreference = (preference) => {
        const current = [...formData.preferences]
        if (current.includes(preference)) {
            handleInputChange(
                "preferences",
                current.filter((p) => p !== preference),
            )
        } else {
            handleInputChange("preferences", [...current, preference])
        }
    }

    const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 4))
    const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1))

    const generatePlan = () => {
        // Here you would implement the logic to generate a new plan
        // based on the formData
        console.log("Generating plan with:", formData)
        // Close the modal and show a success message
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Create Your Custom Diet Plan</DialogTitle>
                </DialogHeader>

                <div className="mt-4">
                    <div className="flex justify-between mb-6">
                        {[1, 2, 3, 4].map((step) => (
                            <div
                                key={step}
                                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${currentStep === step
                                    ? "tertiary-bg text-primary-foreground"
                                    : currentStep > step
                                        ? "tertiary-bg text-primary"
                                        : "bg-muted/20 text-muted-foreground"
                                    }`}
                            >
                                {currentStep > step ? <Check className="h-5 w-5" stroke="#ffffff" /> : step}
                            </div>
                        ))}
                    </div>

                    {currentStep === 1 && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-medium">What's your goal?</h3>

                            <RadioGroup
                                value={formData.goal}
                                onValueChange={(value) => handleInputChange("goal", value)}
                                className="grid grid-cols-1 md:grid-cols-3 gap-4"
                            >
                                <div>
                                    <RadioGroupItem value="weight-loss" id="weight-loss" className="peer sr-only" />
                                    <Label
                                        htmlFor="weight-loss"
                                        className={`flex flex-col items-center justify-between rounded-md border-2 p-4 data-[state=checked]:border-primary ${formData.goal === "weight-loss" ? "border-primary" : "border-muted/20"}`}
                                    >
                                        <Scale className="mb-3 h-6 w-6" />
                                        <span className="font-medium">Weight Loss</span>
                                    </Label>
                                </div>

                                <div>
                                    <RadioGroupItem value="maintenance" id="maintenance" className="peer sr-only" />
                                    <Label
                                        htmlFor="maintenance"
                                        className={`flex flex-col items-center justify-between rounded-md border-2 p-4 data-[state=checked]:border-primary ${formData.goal === "maintenance" ? "border-primary" : "border-muted/20"}`}
                                    >
                                        <Activity className="mb-3 h-6 w-6" />
                                        <span className="font-medium">Maintenance</span>
                                    </Label>
                                </div>

                                <div>
                                    <RadioGroupItem value="muscle-gain" id="muscle-gain" className="peer sr-only" />
                                    <Label
                                        htmlFor="muscle-gain"
                                        className={`flex flex-col items-center justify-between rounded-md border-2 p-4 data-[state=checked]:border-primary ${formData.goal === "muscle-gain" ? "border-primary" : "border-muted/20"}`}
                                    >
                                        <Activity className="mb-3 h-6 w-6" />
                                        <span className="font-medium">Muscle Gain</span>
                                    </Label>
                                </div>
                            </RadioGroup>

                            <div className="space-y-2">
                                <Label htmlFor="activity-level">Activity Level</Label>
                                <RadioGroup
                                    id="activity-level"
                                    value={formData.activityLevel}
                                    onValueChange={(value) => handleInputChange("activityLevel", value)}
                                    className="grid grid-cols-1 gap-2"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="sedentary" id="sedentary" />
                                        <Label htmlFor="sedentary">Sedentary (little or no exercise)</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="light" id="light" />
                                        <Label htmlFor="light">Light (exercise 1-3 days/week)</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="moderate" id="moderate" />
                                        <Label htmlFor="moderate">Moderate (exercise 3-5 days/week)</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="active" id="active" />
                                        <Label htmlFor="active">Active (exercise 6-7 days/week)</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="very-active" id="very-active" />
                                        <Label htmlFor="very-active">Very Active (intense exercise daily)</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-medium">Dietary Restrictions</h3>

                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { id: "vegetarian", label: "Vegetarian" },
                                    { id: "vegan", label: "Vegan" },
                                    { id: "gluten-free", label: "Gluten-Free" },
                                    { id: "dairy-free", label: "Dairy-Free" },
                                    { id: "nut-free", label: "Nut-Free" },
                                    { id: "keto", label: "Keto" },
                                    { id: "paleo", label: "Paleo" },
                                    { id: "low-carb", label: "Low-Carb" },
                                ].map((restriction) => (
                                    <div key={restriction.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={restriction.id}
                                            checked={formData.dietaryRestrictions.includes(restriction.id)}
                                            onCheckedChange={() => toggleDietaryRestriction(restriction.id)}
                                        />
                                        <Label htmlFor={restriction.id}>{restriction.label}</Label>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">Meal Frequency</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <Label htmlFor="meals-per-day">Meals per day: {formData.mealsPerDay}</Label>
                                    </div>
                                    <Slider
                                        id="meals-per-day"
                                        min={3}
                                        max={6}
                                        step={1}
                                        value={[formData.mealsPerDay]}
                                        onValueChange={(value) => handleInputChange("mealsPerDay", value[0])}
                                    />
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>3</span>
                                        <span>4</span>
                                        <span>5</span>
                                        <span>6</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-medium">Macronutrient Distribution</h3>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <Label htmlFor="calorie-target">Daily Calorie Target: {formData.calorieTarget}</Label>
                                    </div>
                                    <Slider
                                        id="calorie-target"
                                        min={1200}
                                        max={3500}
                                        step={50}
                                        value={[formData.calorieTarget]}
                                        onValueChange={(value) => handleInputChange("calorieTarget", value[0])}
                                    />
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>1200</span>
                                        <span>2000</span>
                                        <span>2800</span>
                                        <span>3500</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="protein-percentage">Protein: {formData.proteinPercentage}%</Label>
                                        <Slider
                                            id="protein-percentage"
                                            min={10}
                                            max={50}
                                            step={5}
                                            value={[formData.proteinPercentage]}
                                            onValueChange={(value) => handleInputChange("proteinPercentage", value[0])}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="carbs-percentage">Carbs: {formData.carbsPercentage}%</Label>
                                        <Slider
                                            id="carbs-percentage"
                                            min={10}
                                            max={70}
                                            step={5}
                                            value={[formData.carbsPercentage]}
                                            onValueChange={(value) => handleInputChange("carbsPercentage", value[0])}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="fat-percentage">Fat: {formData.fatPercentage}%</Label>
                                        <Slider
                                            id="fat-percentage"
                                            min={10}
                                            max={60}
                                            step={5}
                                            value={[formData.fatPercentage]}
                                            onValueChange={(value) => handleInputChange("fatPercentage", value[0])}
                                        />
                                    </div>

                                    <div
                                        className={`text-sm ${formData.proteinPercentage + formData.carbsPercentage + formData.fatPercentage !== 100
                                            ? "text-destructive"
                                            : "text-muted-foreground"
                                            }`}
                                    >
                                        Total: {formData.proteinPercentage + formData.carbsPercentage + formData.fatPercentage}%
                                        {formData.proteinPercentage + formData.carbsPercentage + formData.fatPercentage !== 100 &&
                                            " (should equal 100%)"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 4 && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-medium">Food Preferences</h3>

                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { id: "high-protein", label: "High Protein Foods" },
                                    { id: "low-sugar", label: "Low Sugar" },
                                    { id: "whole-foods", label: "Whole Foods" },
                                    { id: "meal-prep-friendly", label: "Meal Prep Friendly" },
                                    { id: "budget-friendly", label: "Budget Friendly" },
                                    { id: "quick-meals", label: "Quick Meals (<15 min)" },
                                    { id: "mediterranean", label: "Mediterranean Style" },
                                    { id: "asian-inspired", label: "Asian Inspired" },
                                ].map((preference) => (
                                    <div key={preference.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={preference.id}
                                            checked={formData.preferences.includes(preference.id)}
                                            onCheckedChange={() => togglePreference(preference.id)}
                                        />
                                        <Label htmlFor={preference.id}>{preference.label}</Label>
                                    </div>
                                ))}
                            </div>

                            <div className="p-4 border rounded-md bg-muted/20">
                                <h4 className="font-medium mb-2">Your Plan Summary</h4>
                                <ul className="space-y-1 text-sm">
                                    <li>
                                        <span className="font-medium">Goal:</span> {formData.goal.replace("-", " ")}
                                    </li>
                                    <li>
                                        <span className="font-medium">Activity Level:</span> {formData.activityLevel}
                                    </li>
                                    <li>
                                        <span className="font-medium">Meals Per Day:</span> {formData.mealsPerDay}
                                    </li>
                                    <li>
                                        <span className="font-medium">Calories:</span> {formData.calorieTarget} kcal
                                    </li>
                                    <li>
                                        <span className="font-medium">Macros:</span> {formData.proteinPercentage}% protein,{" "}
                                        {formData.carbsPercentage}% carbs, {formData.fatPercentage}% fat
                                    </li>
                                    {formData.dietaryRestrictions.length > 0 && (
                                        <li>
                                            <span className="font-medium">Restrictions:</span> {formData.dietaryRestrictions.join(", ")}
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="flex justify-between mt-6">
                    {currentStep > 1 && (
                        <Button variant="secondary" onClick={prevStep}>
                            Back
                        </Button>
                    )}
                    <div className="flex-1"></div>
                    {currentStep < 4 ? (
                        <Button onClick={nextStep}>
                            Continue <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    ) : (
                        <Button onClick={generatePlan}>Generate Plan</Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
