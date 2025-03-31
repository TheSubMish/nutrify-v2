"use client"

import Button from "@/components/ui/button"
import Input from "@/components/ui/input"
import BMICalculator from "@/components/home/Bmi"
import { Calendar, ChefHat, Salad, Utensils } from "lucide-react"
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function LandingPage() {

  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Your Personal Diet Planner
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Get personalized meal suggestions and schedule your diet with ease using our AI-powered nutrition
                  assistant.
                </p>
              </div>
              <div className="space-x-4">
                <Button onClick={() => (window.location.href = "/dashboard")}>Get Started</Button>
                <Button variant="secondary" onClick={() => (window.location.href = "/about")}>Learn More</Button>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-200 lg:px-24 xl:px-40">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={<ChefHat className="h-10 w-10" />}
                title="Personalized Meal Suggestions"
                description="Get AI-powered meal recommendations tailored to your dietary needs and preferences."
              />
              <FeatureCard
                icon={<Calendar className="h-10 w-10" />}
                title="Diet Scheduling"
                description="Easily plan and schedule your meals in your calendar for better organization."
              />
              <FeatureCard
                icon={<Utensils className="h-10 w-10" />}
                title="Nutritional Insights"
                description="Gain valuable insights into your diet and nutritional intake with detailed analysis."
              />
            </div>
          </div>
        </section>
        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 lg:px-24 xl:px-40">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <StepCard
                number={1}
                title="Input Your Preferences"
                description="Tell us about your dietary needs, allergies, and food preferences."
              />
              <StepCard
                number={2}
                title="Get AI Suggestions"
                description="Our AI analyzes your input and generates personalized meal recommendations."
              />
              <StepCard
                number={3}
                title="Schedule Your Meals"
                description="Easily add suggested meals to your calendar and plan your diet."
              />
            </div>
          </div>
        </section>
        <BMICalculator />
        <section id="cta" className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Start Your Personalized Diet Journey Today
              </h2>
              <p className="mx-auto max-w-[600px] text-primary-foreground/90 md:text-xl">
                Join thousands of users who have transformed their eating habits with NutrifyMe.
              </p>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <Input
                    className="max-w-lg flex-1 bg-primary-foreground text-primary"
                    placeholder="Enter your email"
                    type="email"
                  />
                  <Button type="submit" variant="secondary" onClick={() => (window.location.href = "/dashboard")}>
                    Get Started
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
    <Footer />
    </>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-4 rounded-full bg-primary p-2 text-primary-foreground">{icon}</div>
      <h3 className="mb-2 text-xl font-bold">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400">{description}</p>
    </div>
  )
}

function StepCard({ number, title, description }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-4 rounded-full bg-primary text-primary-foreground w-12 h-12 flex items-center justify-center text-xl font-bold">
        {number}
      </div>
      <h3 className="mb-2 text-xl font-bold">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400">{description}</p>
    </div>
  )
}