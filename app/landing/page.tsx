'use client';

import { HeroSection } from '@/components/landing/HeroSection';
import { TrustBar } from '@/components/landing/TrustBar';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { SneakPeekSection } from '@/components/landing/SneakPeekSection';
import { WaitlistSection } from '@/components/landing/WaitlistSection';
import { Footer } from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <HeroSection />
      <TrustBar />
      <FeaturesSection />
      <SneakPeekSection />
      <WaitlistSection />
      <Footer />
    </div>
  );
}
