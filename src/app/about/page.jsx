import Button from "@/components/ui/button"
// import { TeamMember } from "@/components/about/team-member"
import { PageHeader } from "@/components/ui/PageHeader"
import { Salad, Heart, Brain } from 'lucide-react'
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <PageHeader
          title="About NutrifyMe"
          description="Learn about our mission, and the technology behind our AI-powered diet planner."
        />

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-200 lg:px-24 xl:px-40">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              Our Mission
            </h2>
            <p className="text-xl text-center max-w-[800px] mx-auto text-gray-500 dark:text-gray-400">
              At NutrifyMe, we're committed to making personalized nutrition accessible to everyone. Our AI-powered
              platform combines cutting-edge technology with nutritional science to help you achieve your health goals.
            </p>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              Our Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <ValueCard
                icon={<Salad className="h-10 w-10" />}
                title="Nutritional Excellence"
                description="We prioritize evidence-based nutrition advice to ensure the best outcomes for our users."
              />
              <ValueCard
                icon={<Heart className="h-10 w-10" />}
                title="User-Centric Approach"
                description="Your health and satisfaction are at the heart of everything we do."
              />
              <ValueCard
                icon={<Brain className="h-10 w-10" />}
                title="Continuous Innovation"
                description="We're always improving our AI to provide you with the most accurate and helpful diet planning."
              />
            </div>
          </div>
        </section>

        {/* <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              Meet Our Team
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <TeamMember
                name="Dr. Jane Smith"
                role="Chief Nutritionist"
                image="/placeholder.svg?height=200&width=200"
                description="With over 15 years of experience in nutritional science, Dr. Smith leads our dietary recommendation algorithms."
              />
              <TeamMember
                name="John Doe"
                role="AI Engineer"
                image="/placeholder.svg?height=200&width=200"
                description="John is the mastermind behind our AI technology, ensuring that our platform delivers personalized and accurate meal plans."
              />
              <TeamMember
                name="Emily Brown"
                role="User Experience Designer"
                image="/placeholder.svg?height=200&width=200"
                description="Emily's passion for intuitive design helps make NutrifyMe accessible and enjoyable for all users."
              />
            </div>
          </div>
        </section> */}

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to Transform Your Diet?
              </h2>
              <p className="mx-auto max-w-[600px] text-gray-500 dark:text-gray-400 md:text-xl">
                Join thousands of satisfied users who have improved their nutrition with NutrifyMe.
              </p>
              <Button variant="secondary" >Get Started</Button>
            </div>
          </div>
        </section>
      </main>
    </div>
    <Footer />
    </>
  )
}

function ValueCard({ icon, title, description }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-4 rounded-full bg-primary p-2 text-primary-foreground">{icon}</div>
      <h3 className="mb-2 text-xl font-bold">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400">{description}</p>
    </div>
  )
}