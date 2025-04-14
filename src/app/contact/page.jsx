"use client";

import { useState } from "react";
import { toast } from "sonner";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { Textarea } from "@/components/ui/TextArea";
import { PageHeader } from "@/components/ui/PageHeader";
import { ContactInfo } from "@/components/contact/contact-info";
import { MapPin, Phone, Mail } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { sendContactMessage } from "@/utils/sendContactMessage";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const response = await sendContactMessage(formData.name, formData.email, formData.message);

    if (response.success) {
      toast.success(response.message);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } else {
      toast.error(response.message);
    }

    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen">
        <main className="flex-1">
          <PageHeader
            title="We’re Here to Listen"
            description="Whether you’re confused about meal plans or just want to chat nutrition, our real human team (backed by smart tech) responds within 24 hours."
          />

          <section className="md:mb-10 lg:px-24 xl:px-40 pt-7 lg:pt-10 pb-5">
            <div className="container px-4 md:px-6">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <div className="space-y-4">
                  <h2 className="text-xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Need Personalized Nutrition Advice?
                  </h2>
                  <p className="text-gray-600">
                    Our AI-powered system calculates your dietary intake based on your health conditions and lifestyle. Contact us for guidance or troubleshooting.
                  </p>
                  <div className="space-y-2">
                    <ContactInfo icon={<MapPin className="h-5 w-5" />} title="Address" info="456 AI Health Blvd, Wellness City, 67890" />
                    <ContactInfo icon={<Phone className="h-5 w-5" />} title="Phone" info="+1 (555) 678-9101" />
                    <ContactInfo icon={<Mail className="h-5 w-5" />} title="Email" info="support@ainutrition.com" />
                  </div>
                </div>
                <div className="space-y-4">
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <Input name="name" value={formData.name} onChange={handleChange} placeholder="Your Name" required className="text-gray-600" />
                    <Input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Your Email" required className="text-gray-600" />
                    <Input name="subject" value={formData.subject} onChange={handleChange} placeholder="Subject" className="text-gray-600" />
                    <Textarea name="message" value={formData.message} onChange={handleChange} placeholder="What’s cooking in your mind? Tell us everything from recipe requests to tech hiccups..." className="min-h-[150px] text-gray-600" required/>
                    <Button variant="secondary" type="submit" className="w-full font-bold" disabled={loading}>
                      {loading ? "Sending..." : "Send Message"}
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
  );
}
