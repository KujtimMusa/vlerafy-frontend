'use client';
import { UltraModernHeroSection } from '@/components/landing/UltraModernHeroSection';
import { UltraModernFeaturesSection } from '@/components/landing/UltraModernFeaturesSection';
import { UltraModernSocialProofSection } from '@/components/landing/UltraModernSocialProofSection';
import { UltraModernFinalCTASection } from '@/components/landing/UltraModernFinalCTASection';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <UltraModernHeroSection />
      <UltraModernFeaturesSection />
      <UltraModernSocialProofSection />
      <UltraModernFinalCTASection />
    </div>
  );
}
