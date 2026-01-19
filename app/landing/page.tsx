'use client';

import { PremiumHeroSection } from '@/components/landing/PremiumHeroSection';
import { PremiumFeaturesSection } from '@/components/landing/PremiumFeaturesSection';
import { PremiumSocialProofSection } from '@/components/landing/PremiumSocialProofSection';
import { PremiumFinalCTASection } from '@/components/landing/PremiumFinalCTASection';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black">
      <PremiumHeroSection />
      <PremiumFeaturesSection />
      <PremiumSocialProofSection />
      <PremiumFinalCTASection />
    </div>
  );
}
