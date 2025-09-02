'use client';

import { MapPin, Phone, Mail, Clock, Calendar, Users, MessageCircle } from "lucide-react";

// Design System Components
import { 
  LinkButton,
  HeroSectionBuilder,
  SectionBuilder,
  ContactForm,
  ContactInfo,
  FAQSection,
  patterns 
} from "@/design-system";

// Types
import type { ContactFormData } from "@/design-system/components/molecules/ContactForm/ContactForm";

// Real business contact information
const contactInfo = [
  {
    icon: MapPin,
    title: "Visit Our Office",
    details: [
      "House No. 5, Maheshwari Bhawan",
      "Near Qutbi Masjid, MP Nagar",
      "Professors Colony, Bhopal - 462002",
      "Madhya Pradesh, India"
    ]
  },
  {
    icon: Phone,
    title: "Call Us",
    details: [
      "+91 98332 57659",
      "Available Mon-Sat 9AM-7PM"
    ]
  },
  {
    icon: Mail,
    title: "Email Us",
    details: [
      "hello@freakingminds.in",
      "business@freakingminds.in",
      "careers@freakingminds.in"
    ]
  },
  {
    icon: Clock,
    title: "Office Hours",
    details: [
      "Monday - Friday: 9:00 AM - 7:00 PM",
      "Saturday: 10:00 AM - 5:00 PM",
      "Sunday: By Appointment"
    ]
  }
];

const services = [
  "SEO & Digital Marketing",
  "Social Media Marketing",
  "PPC Advertising",
  "Website Design & Development",
  "Branding & Creative Design",
  "Content Marketing",
  "E-commerce Solutions",
  "Other"
];

const budgetRanges = [
  "₹25,000 - ₹50,000",
  "₹50,000 - ₹1,00,000",
  "₹1,00,000 - ₹3,00,000",
  "₹3,00,000 - ₹5,00,000",
  "₹5,00,000+"
];

const faqData = [
  {
    question: "How long does it take to see results from digital marketing?",
    answer: "Results vary by service, but typically you'll see initial improvements in 3-6 months for SEO, immediate results for PPC, and 1-3 months for social media marketing."
  },
  {
    question: "Do you work with businesses outside of Bhopal?",
    answer: "Yes! While we're based in Bhopal, we work with clients across India and internationally through digital collaboration."
  },
  {
    question: "What's included in your monthly reporting?",
    answer: "Our reports include key metrics, campaign performance, ROI analysis, competitor insights, and strategic recommendations for the next month."
  },
  {
    question: "Can you work with our existing marketing team?",
    answer: "Absolutely! We often collaborate with in-house teams and can provide training, consultation, or handle specific aspects of your marketing strategy."
  }
];

export default function ContactPage() {
  const handleFormSubmit = async (formData: ContactFormData) => {
    // Custom form submission logic can be added here
    await new Promise(resolve => setTimeout(resolve, 2000));
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section - Design System Version */}
      <HeroSectionBuilder
        badge={{
          text: "Let's Start the Conversation",
          icon: <MessageCircle className="w-4 h-4 mr-2" />
        }}
        headline={{
          text: "Ready to Transform Your Business?",
          level: "h1",
          accent: { text: "Transform", position: "middle" }
        }}
        description="Get in touch with our team of digital marketing experts. We're here to help you achieve your business goals with strategic marketing solutions that deliver real results."
        background="light"
        maxWidth="xl"
        minHeight="large"
        content={
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <LinkButton href="tel:+919833257659" variant="primary" size="lg" icon={<Calendar className="w-5 h-5" />} iconPosition="right">
              Schedule a Call
            </LinkButton>
            <LinkButton href="#contact-form" variant="secondary" size="lg">
              Get Instant Quote
            </LinkButton>
          </div>
        }
      />

      {/* Contact Form & Info - Design System Version */}
      <section id="contact-form" className={`${patterns.layout.section} bg-fm-neutral-50 py-24`}>
        <div className={`${patterns.layout.container} ${patterns.layout.maxWidth.xl}`}>
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <ContactForm
              services={services}
              budgetRanges={budgetRanges}
              onSubmit={handleFormSubmit}
              title="Let's Discuss Your Project"
              description="Fill out the form below and we'll get back to you within 24 hours with a custom proposal tailored to your needs."
              theme="light"
            />

            {/* Contact Information */}
            <ContactInfo
              contactInfo={contactInfo}
              quickActions={{
                phone: "+91 98332 57659",
                email: "hello@freakingminds.in",
                whatsapp: "+91 98332 57659"
              }}
              title="Get in Touch"
              description="Prefer to speak directly? Our team is available through multiple channels to provide you with the support you need."
              theme="light"
            />
          </div>
        </div>
      </section>

      {/* Map Section - Design System Version */}
      <SectionBuilder
        headline={{
          text: "Visit Our Office",
          level: "h2",
          accent: { text: "Office", position: "end" }
        }}
        description="Located in the heart of Bhopal's MP Nagar, we're easily accessible and always ready to welcome you for in-person consultations."
        background="none"
        content={
          <div className="aspect-video bg-fm-neutral-300 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-fm-magenta-700 mx-auto mb-4" />
              <p className="text-fm-neutral-600 mb-2">
                Interactive map will be integrated here
              </p>
              <p className="text-sm text-fm-neutral-500">
                House No. 5, Maheshwari Bhawan, Near Qutbi Masjid
              </p>
              <p className="text-sm text-fm-neutral-500">
                MP Nagar, Professors Colony, Bhopal - 462002
              </p>
            </div>
          </div>
        }
      />

      {/* FAQ Section - Design System Version */}
      <section className={`${patterns.layout.section} bg-fm-neutral-50 py-24`}>
        <div className={`${patterns.layout.container} ${patterns.layout.maxWidth.xl}`}>
          <FAQSection
            faqs={faqData}
            title="Frequently Asked Questions"
            description="Quick answers to common questions about our services and process."
            theme="light"
            allowMultipleOpen={false}
          />
        </div>
      </section>

      {/* CTA Section - Design System Version */}
      <SectionBuilder
        badge={{
          text: "Ready to Get Started?",
          icon: <Users className="w-4 h-4" />
        }}
        headline={{
          text: "Join 250+ Businesses That Trust Freaking Minds",
          level: "h2"
        }}
        description="Transform your digital presence with our proven strategies. Let's create something extraordinary together and drive real business results."
        background="gradient"
        content={
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <LinkButton 
              href="tel:+919833257659"
              variant="secondary" 
              size="lg" 
              className="bg-fm-neutral-50 text-fm-magenta-700 hover:bg-fm-neutral-100"
              icon={<Calendar className="w-5 h-5" />}
              iconPosition="right"
            >
              Schedule Free Consultation
            </LinkButton>
            <LinkButton href="#" variant="ghost" size="lg" theme="dark">
              Download Our Portfolio
            </LinkButton>
          </div>
        }
      />
    </div>
  );
}