"use client"

import { useEffect, useState } from "react"
import { Check, ArrowRight, Activity, Scale, Edit, Clock, Plus, Save } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import Button from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/RadioGroup"
import Label from "@/components/ui/Label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { callAi } from "@/utils/callAi"
import extractJson from "@/utils/extractJson"
import { useAppStore } from "@/store"
import { toast } from "sonner"

export default function GeneratePlanModal({ isOpen, onClose, onGeneratePlan }) {
    const { user, userPreferences, setUserPreferences, userGoals, setUserGoals, userMeals, setUserMeals } = useAppStore()
    const [loading, setLoading] = useState(false)
    const [currentStep, setCurrentStep] = useState(1)
    const [stepLoading, setStepLoading] = useState({
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
    })
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
        dietType: "balanced",
    })
    const [generatedMeals, setGeneratedMeals] = useState(userMeals || []);
    const [isGenerating, setIsGenerating] = useState(false)
    const [editingMeal, setEditingMeal] = useState(null)
    const [showEditForm, setShowEditForm] = useState(false)

    useEffect(() => {
        if (isOpen) {
            setGeneratedMeals(userMeals || []);
        }
    }, [isOpen, userMeals]);

    const calculateMacros = async () => {
        setStepLoading((prev) => ({ ...prev, 3: true }))

        try {
            // Create a prompt based on the user's data
            const prompt = `Calculate the optimal macronutrient distribution for a person with the following characteristics:
        Goal: ${formData.goal}
        Activity Level: ${formData.activityLevel}
        Diet Type: ${formData.dietType}
        Dietary Restrictions: ${formData.dietaryRestrictions.join(", ")}
        
        Based on these factors, provide the recommended macronutrient distribution as a JSON object with these properties:
        protein (percentage), carbs (percentage), fat (percentage), calorieTarget (daily calorie target).
        
        The percentages should add up to 100%. The calorie target should be appropriate for the person's goal and activity level. Recommend food based on Nepalese cuisine and local ingredients.`

            const response = await callAi(prompt)

            // Try to parse the response as JSON
            const macroData = JSON.parse(extractJson(response))
            try {
                // Update the form data with the calculated values
                setFormData((prev) => ({
                    ...prev,
                    proteinPercentage: macroData.protein || prev.proteinPercentage,
                    carbsPercentage: macroData.carbs || prev.carbsPercentage,
                    fatPercentage: macroData.fat || prev.fatPercentage,
                    calorieTarget: macroData.calorieTarget || prev.calorieTarget,
                }))

                // Force a re-render to ensure the UI updates
                setTimeout(() => {
                    setStepLoading((prev) => ({ ...prev, 3: false }))
                }, 500)
            } catch (error) {
                toast.error("Failed to calculate optimal macros. Using default values.")
                // setStepLoading((prev) => ({ ...prev, 3: false }))
            }
        } catch (error) {
            toast.error("Failed to calculate optimal macros. Using default values.")
            // setStepLoading((prev) => ({ ...prev, 3: false }))
        }
    }

    // Fix for the user goals not showing up properly
    useEffect(() => {
        const currentStepNum = currentStep
        setStepLoading((prev) => ({ ...prev, [currentStepNum]: true }))
        setLoading(true)

        async function fetchData() {
            if (!user) {
                toast.error("Please log in to generate a meal plan.")
                onClose()
                return
            }

            // Load user preferences and goals from the store
            if (currentStep === 1) {
                if (userGoals && Object.keys(userGoals).length > 0) {
                    setFormData((prev) => ({
                        ...prev,
                        goal: userGoals.goal || "weight-loss",
                        activityLevel: userGoals.activityLevel || "moderate",
                    }))
                } else {
                    try {
                        const response = await fetch("/api/fitness-goals", {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                            },
                        })

                        const data = await response.json()

                        if (data && data.data.fitnessGoals) {

                            // Update the state
                            setUserGoals(data.data.fitnessGoals)

                            // Calculate goal based on target weight
                            let goal
                            if (data.data.fitnessGoals.target_weight < 0.5) {
                                goal = "weight-loss"
                            } else if (data.data.fitnessGoals.target_weight > 0.5) {
                                goal = "muscle-gain"
                            } else {
                                goal = "maintenance"
                            }

                            // Use the data directly rather than relying on the state that hasn't updated yet
                            setFormData((prev) => ({
                                ...prev,
                                goal: goal || "weight-loss",
                                activityLevel: data.data.fitnessGoals.activity_level || "moderate",
                            }))
                        } else {
                            toast.error("Failed to load fitness goals")
                        }
                    } catch (error) {
                        toast.error("Failed to load fitness goals")
                    }
                }
            }

            if (currentStep === 2) {
                if (userPreferences && Object.keys(userPreferences).length > 0) {
                    setFormData((prev) => ({
                        ...prev,
                        dietaryRestrictions: userPreferences.restrictions || [],
                        preferences: [...(userPreferences.allergies || []), ...(userPreferences.disliked_foods || [])],
                        mealsPerDay: Object.values(userPreferences.meal_frequency || {}).filter(Boolean).length || 4,
                        dietType: userPreferences.diet_type || "balanced",
                    }))
                } else {
                    try {
                        const response = await fetch("/api/dietary-preference", {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                            },
                        })

                        const { data } = await response.json()

                        if (data) {
                            setUserPreferences(data)

                            setFormData((prev) => ({
                                ...prev,
                                dietaryRestrictions: data.restrictions || [],
                                preferences: [...(data.allergies || []), ...(data.disliked_foods || [])],
                                mealsPerDay: Object.values(data.meal_frequency || {}).filter(Boolean).length,
                                dietType: data.diet_type || "balanced",
                            }))
                        }
                    } catch (error) {
                        toast.error("Failed to load dietary preferences")
                    }
                }
            }

            if (currentStep === 3) {
                await calculateMacros()
            }

            setStepLoading((prev) => ({ ...prev, [currentStepNum]: false }))
            setLoading(false)
        }

        fetchData()
    }, [currentStep])

    const handleInputChange = (field, value) => {
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

    const nextStep = () => {
        const newStep = Math.min(currentStep + 1, 5)
        setCurrentStep(newStep)

        // If moving to step 3, calculate macros after changing the step
        // if (newStep === 3 && currentStep === 2) {
        //     calculateMacros()
        // }
    }

    const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1))

    const generatePlan = async () => {
        // Move to the meal plan display step
        setCurrentStep(5)
        setIsGenerating(true)

        try {
            // Create a prompt based on the plan summary
            const prompt = `Generate a meal plan for a person with the following preferences:
            Goal: ${formData.goal}
            Activity Level: ${formData.activityLevel}
            Diet Type: ${formData.dietType}
            Dietary Restrictions: ${formData.dietaryRestrictions.join(", ")}
            Meals Per Day: ${formData.mealsPerDay}
            Calories: ${formData.calorieTarget} kcal
            Macros: ${formData.proteinPercentage}% protein, ${formData.carbsPercentage}% carbs, ${formData.fatPercentage}% fat
            Food Preferences: ${formData.preferences.join(", ")}
            
            Format the response as a JSON array with ${formData.mealsPerDay} meals, each with these properties:
            title (string), type (breakfast, lunch, dinner, or snack), calories (number), protein (number), carbs (number), fat (number), notes (why this meal was recommended). Recommend the meals based on Nepalese cuisine and local ingredients.`

            const response = await callAi(prompt)

            // Try to parse the response as JSON
            try {
                const mealData = JSON.parse(extractJson(response))

                // Get today's date in ISO format (YYYY-MM-DD)
                const today = new Date().toISOString().split("T")[0]

                const processedMeals = mealData.map((meal, index) => ({
                    ...meal,
                    id: Date.now() + index,
                    date: today,
                    starttime: getDefaultTimeForMealType(meal.type),
                    endtime: getDefaultEndTimeForMealType(meal.type),
                }))
                setGeneratedMeals(processedMeals)
                setUserMeals(processedMeals)

            } catch (error) {
                // Fallback to sample data if parsing fails
                setGeneratedMeals(getSampleMeals(formData.mealsPerDay))
            }
        } catch (error) {
            setGeneratedMeals(getSampleMeals(formData.mealsPerDay))
        } finally {
            setIsGenerating(false)
        }
    }

    const getDefaultTimeForMealType = (type) => {
        switch (type.toLowerCase()) {
            case "breakfast":
                return "08:00"
            case "lunch":
                return "12:30"
            case "dinner":
                return "18:30"
            case "snack":
                // For snacks, we'll distribute them between meals
                return "10:30"
            default:
                return "08:00"
        }
    }

    const getDefaultEndTimeForMealType = (type) => {
        switch (type.toLowerCase()) {
            case "breakfast":
                return "08:30"
            case "lunch":
                return "13:00"
            case "dinner":
                return "19:00"
            case "snack":
                return "10:45"
            default:
                return "08:30"
        }
    }

    const getSampleMeals = (count) => {
        // Get today's date in ISO format (YYYY-MM-DD)
        const today = new Date().toISOString().split("T")[0]

        const sampleMeals = [
            {
                id: Date.now(),
                title: "Oatmeal with Berries",
                type: "breakfast",
                date: today,
                starttime: "08:00",
                endtime: "08:30",
                calories: 350,
                protein: 15,
                carbs: 45,
                fat: 10,
                notes: "1/2 cup oats, 1 cup almond milk, 1/2 cup mixed berries, 1 tbsp honey, 1 tbsp chia seeds",
            },
            {
                id: Date.now() + 1,
                title: "Grilled Chicken Salad",
                type: "lunch",
                date: today,
                starttime: "12:30",
                endtime: "13:00",
                calories: 450,
                protein: 35,
                carbs: 25,
                fat: 20,
                notes:
                    "4oz grilled chicken breast, 2 cups mixed greens, 1/4 cup cherry tomatoes, 1/4 avocado, 2 tbsp olive oil vinaigrette",
            },
            {
                id: Date.now() + 2,
                title: "Protein Smoothie",
                type: "snack",
                date: today,
                starttime: "15:30",
                endtime: "15:45",
                calories: 200,
                protein: 20,
                carbs: 15,
                fat: 5,
                notes: "1 scoop protein powder, 1 banana, 1 cup almond milk, ice",
            },
            {
                id: Date.now() + 3,
                title: "Salmon with Roasted Vegetables",
                type: "dinner",
                date: today,
                starttime: "18:30",
                endtime: "19:00",
                calories: 550,
                protein: 40,
                carbs: 30,
                fat: 25,
                notes:
                    "6oz salmon fillet, 1 cup roasted broccoli, 1 cup roasted sweet potatoes, 1 tbsp olive oil, herbs and spices",
            },
        ]

        return sampleMeals.slice(0, count)
    }

    const handleEditMeal = (meal) => {
        setEditingMeal(meal)
        setShowEditForm(true)
    }

    const handleSaveMeal = (updatedMeal) => {
        const updatedMeals = generatedMeals.map((meal) =>
            meal.id === updatedMeal.id ? updatedMeal : meal
        );
        setGeneratedMeals(updatedMeals);
        setUserMeals(updatedMeals);
        setShowEditForm(false);
        setEditingMeal(null);
    };

    const handleAddMeal = () => {
        const today = new Date().toISOString().split("T")[0]
        const newMeal = {
            id: Date.now(),
            title: "",
            type: "snack",
            date: today,
            starttime: "15:00",
            endtime: "15:15",
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0,
            notes: "",
        }
        setEditingMeal(newMeal)
        setShowEditForm(true)
    }

    const handleSavePlan = async () => {
        try {
            if (!user || !user.id) {
                toast.error("You must be logged in to save a meal plan")
                return
            }

            const response = await fetch("/api/save-meals", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: user.id,
                    meals: generatedMeals,
                }),
            })

            const data = await response.json()

            if (data.success) {
                toast.success("Meal plan saved successfully!")
                // if (typeof onGeneratePlan === "function") {
                //     onGeneratePlan(generatedMeals)
                // }
                onClose()
            } else {
                toast.error(data.message || "Failed to save meal plan")
            }
        } catch (error) {
            toast.error("Failed to save meal plan")
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Create Your Custom Diet Plan</DialogTitle>
                </DialogHeader>

                <div className="mt-4">
                    <div className="flex justify-between mb-6">
                        {[1, 2, 3, 4, 5].map((step) => (
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

                    {loading || stepLoading[currentStep] ? (
                        <div className="flex flex-col items-center justify-center py-10">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                            <p className="text-muted-foreground">{currentStep === 1 ? "Loading Goals" : currentStep == 2 ? "Loading Preferences" : currentStep === 3 ? "Calculating Micronutrients" : "Loading Final Summary"}</p>
                        </div>
                    ) : (
                        <>
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
                                    <h3 className="text-lg font-medium">Diet Type</h3>

                                    <RadioGroup
                                        value={formData.dietType}
                                        onValueChange={(value) => handleInputChange("dietType", value)}
                                        className="grid grid-cols-1 gap-2 mb-6"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="balanced" id="balanced" />
                                            <Label htmlFor="balanced">Balanced</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="low-carb" id="low-carb-diet" />
                                            <Label htmlFor="low-carb-diet">Low Carb</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="high-protein" id="high-protein-diet" />
                                            <Label htmlFor="high-protein-diet">High Protein</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="keto" id="keto-diet" />
                                            <Label htmlFor="keto-diet">Keto</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="mediterranean" id="mediterranean-diet" />
                                            <Label htmlFor="mediterranean-diet">Mediterranean</Label>
                                        </div>
                                    </RadioGroup>

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
                                                <span className="font-medium">Diet Type:</span> {formData.dietType}
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

                            {currentStep === 5 && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-medium">Your Meal Plan</h3>
                                        <Button variant="outline" size="sm" onClick={handleAddMeal}>
                                            <Plus className="h-4 w-4 mr-1" /> Add Meal
                                        </Button>
                                    </div>

                                    {isGenerating ? (
                                        <div className="flex flex-col items-center justify-center py-10">
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                                            <p className="text-muted-foreground">Generating your meal plan...</p>
                                        </div>
                                    ) : generatedMeals.length === 0 ? (
                                        <div className="text-center py-10">
                                            <p className="text-muted-foreground">No meals generated yet.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                                            {generatedMeals.map((meal) => (
                                                <Card key={meal.id} className="overflow-hidden">
                                                    <CardContent className="p-0">
                                                        <div className="p-4">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <h4 className="font-medium">{meal.title}</h4>
                                                                <Button variant="ghost" size="sm" onClick={() => handleEditMeal(meal)}>
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                            <div className="flex flex-wrap gap-2 text-sm text-muted-foreground mb-2">
                                                                <div className="flex items-center">
                                                                    <Clock className="h-3 w-3 mr-1" />
                                                                    <span>{meal.type}</span>
                                                                </div>
                                                                <div>•</div>
                                                                <div>
                                                                    {meal.starttime} - {meal.endtime}
                                                                </div>
                                                            </div>
                                                            <div className="grid grid-cols-4 gap-2 text-sm mb-2">
                                                                <div>
                                                                    <span className="font-medium">{meal.calories}</span> kcal
                                                                </div>
                                                                <div>
                                                                    <span className="font-medium">{meal.protein}g</span> protein
                                                                </div>
                                                                <div>
                                                                    <span className="font-medium">{meal.carbs}g</span> carbs
                                                                </div>
                                                                <div>
                                                                    <span className="font-medium">{meal.fat}g</span> fat
                                                                </div>
                                                            </div>
                                                            <p className="text-sm text-muted-foreground">{meal.notes}</p>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    )}

                                    {showEditForm && editingMeal && (
                                        <Dialog open={showEditForm} onOpenChange={() => setShowEditForm(false)}>
                                            <DialogContent className="sm:max-w-[500px]">
                                                <DialogHeader>
                                                    <DialogTitle>{editingMeal.id ? "Edit Meal" : "Add Meal"}</DialogTitle>
                                                </DialogHeader>
                                                <div className="grid gap-4 py-4">
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="title" className="text-right">
                                                            Title
                                                        </Label>
                                                        <input
                                                            id="title"
                                                            className="col-span-3 p-2 border rounded"
                                                            value={editingMeal.title}
                                                            onChange={(e) => setEditingMeal({ ...editingMeal, title: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="type" className="text-right">
                                                            Type
                                                        </Label>
                                                        <select
                                                            id="type"
                                                            className="col-span-3 p-2 border rounded"
                                                            value={editingMeal.type}
                                                            onChange={(e) => setEditingMeal({ ...editingMeal, type: e.target.value })}
                                                        >
                                                            <option value="breakfast">Breakfast</option>
                                                            <option value="lunch">Lunch</option>
                                                            <option value="dinner">Dinner</option>
                                                            <option value="snack">Snack</option>
                                                        </select>
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="starttime" className="text-right">
                                                            Start Time
                                                        </Label>
                                                        <input
                                                            id="starttime"
                                                            type="time"
                                                            className="col-span-3 p-2 border rounded"
                                                            value={editingMeal.starttime}
                                                            onChange={(e) => setEditingMeal({ ...editingMeal, starttime: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="endtime" className="text-right">
                                                            End Time
                                                        </Label>
                                                        <input
                                                            id="endtime"
                                                            type="time"
                                                            className="col-span-3 p-2 border rounded"
                                                            value={editingMeal.endtime}
                                                            onChange={(e) => setEditingMeal({ ...editingMeal, endtime: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="calories" className="text-right">
                                                            Calories
                                                        </Label>
                                                        <input
                                                            id="calories"
                                                            type="number"
                                                            className="col-span-3 p-2 border rounded"
                                                            value={editingMeal.calories}
                                                            onChange={(e) =>
                                                                setEditingMeal({ ...editingMeal, calories: Number.parseInt(e.target.value) || 0 })
                                                            }
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="protein" className="text-right">
                                                            Protein (g)
                                                        </Label>
                                                        <input
                                                            id="protein"
                                                            type="number"
                                                            className="col-span-3 p-2 border rounded"
                                                            value={editingMeal.protein}
                                                            onChange={(e) =>
                                                                setEditingMeal({ ...editingMeal, protein: Number.parseInt(e.target.value) || 0 })
                                                            }
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="carbs" className="text-right">
                                                            Carbs (g)
                                                        </Label>
                                                        <input
                                                            id="carbs"
                                                            type="number"
                                                            className="col-span-3 p-2 border rounded"
                                                            value={editingMeal.carbs}
                                                            onChange={(e) =>
                                                                setEditingMeal({ ...editingMeal, carbs: Number.parseInt(e.target.value) || 0 })
                                                            }
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="fat" className="text-right">
                                                            Fat (g)
                                                        </Label>
                                                        <input
                                                            id="fat"
                                                            type="number"
                                                            className="col-span-3 p-2 border rounded"
                                                            value={editingMeal.fat}
                                                            onChange={(e) =>
                                                                setEditingMeal({ ...editingMeal, fat: Number.parseInt(e.target.value) || 0 })
                                                            }
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="notes" className="text-right">
                                                            Notes
                                                        </Label>
                                                        <textarea
                                                            id="notes"
                                                            className="col-span-3 p-2 border rounded"
                                                            rows={3}
                                                            value={editingMeal.notes}
                                                            onChange={(e) => setEditingMeal({ ...editingMeal, notes: e.target.value })}
                                                        />
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <Button variant="outline" onClick={() => setShowEditForm(false)}>
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        onClick={() => {
                                                            if (editingMeal.id) {
                                                                handleSaveMeal(editingMeal)
                                                            } else {
                                                                const newMeal = { ...editingMeal, id: Date.now() };
                                                                const updatedMeals = [...generatedMeals, newMeal];
                                                                setGeneratedMeals(updatedMeals);
                                                                setUserMeals(updatedMeals); // Update global state
                                                                setShowEditForm(false);
                                                                setEditingMeal(null);
                                                            }
                                                        }}
                                                    >
                                                        Save
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
                <DialogFooter className="flex justify-between mt-6">
                    {currentStep > 1 && currentStep <= 5 && (
                        <Button variant="secondary" onClick={prevStep}>
                            Back
                        </Button>
                    )}
                    <div className="flex-1"></div>
                    {currentStep < 4 ? (
                        <Button onClick={nextStep}>
                            Continue <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    ) : currentStep === 4 ? (
                        <Button onClick={generatePlan} disabled={isGenerating}>
                            Generate Plan
                        </Button>
                    ) : (
                        <Button onClick={handleSavePlan}>
                            <Save className="mr-2 h-4 w-4" />
                            Save Plan
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
