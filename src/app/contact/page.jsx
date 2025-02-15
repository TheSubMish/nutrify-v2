import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Textarea } from "@/components/ui/TextArea";
import { PageHeader } from "@/components/ui/PageHeader";
import { ContactInfo } from "@/components/contact/contact-info";
import { MapPin, Phone, Mail } from 'lucide-react';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen">
        <main className="flex-1">
          <PageHeader
            title="Contact Us"
            description="Reach out for support, feedback, or personalized nutrition guidance powered by AI."
          />

          <section className="md:mb-10 lg:px-24 xl:px-40 pt-7 lg:pt-10 pb-5">
            <div className="container px-4 md:px-6">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <div className="space-y-4">
                  <h2 className="text-xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Need Personalized Nutrition Advice?</h2>
                  <p className="text-gray-500 dark:text-gray-400">
                    Our AI-powered system calculates your dietary intake based on your health conditions and lifestyle. Contact us for guidance or troubleshooting.
                  </p>
                  <div className="space-y-2">
                    <ContactInfo
                      icon={<MapPin className="h-5 w-5" />}
                      title="Address"
                      info="456 AI Health Blvd, Wellness City, 67890"
                    />
                    <ContactInfo
                      icon={<Phone className="h-5 w-5" />}
                      title="Phone"
                      info="+1 (555) 678-9101"
                    />
                    <ContactInfo
                      icon={<Mail className="h-5 w-5" />}
                      title="Email"
                      info="support@ainutrition.com"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <form className="space-y-4">
                    <Input placeholder="Your Name" required />
                    <Input type="email" placeholder="Your Email" required />
                    <Input placeholder="Subject" />
                    <Textarea placeholder="Your Message" className="min-h-[150px]" required />
                    <Button type="submit" className="w-full">Send Message</Button>
                  </form>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}
