import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { ProfileExamples } from "@/components/landing/profile-examples";
import { Benefits } from "@/components/landing/benefits";
import { Testimonials } from "@/components/landing/testimonials";
import { FAQ } from "@/components/landing/faq";
import { CtaFinal } from "@/components/landing/cta-final";
import { Footer } from "@/components/landing/footer";

export default function LandingPage() {
  return (
    <>
      <Header />
      <Hero />
      <HowItWorks />
      <ProfileExamples />
      <Benefits />
      <Testimonials />
      <FAQ />
      <CtaFinal />
      <Footer />
    </>
  );
}
