import Button from "@/components/ui/button"
// import { TeamMember } from "@/components/about/team-member"
import { PageHeader } from "@/components/ui/PageHeader"
import { Shield, Sliders, Brain } from 'lucide-react'
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen">
        <main className="flex-1">
          <PageHeader
            title="About NutrifyMe"
            description="Your meal plan combines nutrition research with your unique needs—we analyze everything from your vitamin levels to your weekly grocery budget."
          />

          <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-200 lg:px-24 xl:px-40">
            <div className="container px-4 md:px-6">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
                Our Mission
              </h2>
              <p className="text-xl text-center max-w-[800px] mx-auto text-gray-600 dark:text-gray-700">
                We believe nutrition shouldn’t be a one-size-fits-all puzzle. Born from a collaboration between dietitians, chefs, and tech innovators, our platform turns complexity into clarity. Whether you’re managing diabetes, training for a marathon, or just craving better meals, we’re here to make eating well effortless
              </p>
            </div>
          </section>

          <section className="w-full py-12 md:py-24 lg:py-32 lg:px-24 xl:px-40">
            <div className="container px-4 md:px-6">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
                Our Values
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <ValueCard
                  icon={<Shield className="h-10 w-10" />}
                  title="Transparency"
                  description="See exactly why a meal was recommended — from calorie targets to vitamin gaps."
                />
                <ValueCard
                  icon={<Sliders className="h-10 w-10" />}
                  title="Empowerment"
                  description="You control every tweak, swap, and schedule change."
                />
                <ValueCard
                  icon={<Brain className="h-10 w-10" />}
                  title="Always Learning"
                  description="Weekly updates refine our system based on user trends and scientific breakthroughs"
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

          <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-200 lg:px-24 xl:px-40">
            <div className="container px-4 md:px-6">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
                Built with Care
              </h2>
              <div className="max-w-3xl mx-auto text-center">
                <p className="text-xl mb-6">
                  NutrifyMe is the passion project, a developer who struggled with
                  balancing nutrition and a hectic lifestyle. After trying every meal-planning app
                  with disappointing results, I combined my coding skills with guidance from
                  certified nutritionists to build something better.
                </p>
                <div className="flex items-center justify-center gap-4">
                  {/* <div className="text-left">
                    <h3 className="font-bold text-lg">Mr. Subodh Mishra</h3>
                    <p className="text-gray-600">Developer & Nutrition Enthusiast</p>
                  </div> */}
                </div>
              </div>
            </div>
          </section>

          <section className="w-full py-12 md:py-24 lg:py-32 lg:px-24 xl:px-40">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center space-y-4 text-center">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Transform Your Diet?
                </h2>
                <p className="mx-auto max-w-[600px] text-gray-500 dark:text-gray-400 md:text-xl">
                  Join thousands of satisfied users who have improved their nutrition with NutrifyMe.
                </p>
                <Button variant="secondary" className="cursor-pointer">
                  <Link href="/dashboard">
                    Build My Food Calendar
                  </Link>
                </Button>
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
      <p className="text-gray-500 dark:text-gray-600">{description}</p>
    </div>
  )
}