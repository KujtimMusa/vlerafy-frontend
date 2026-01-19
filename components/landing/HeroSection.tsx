'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Play } from 'lucide-react';
import { addToWaitlist } from '@/lib/waitlist-api';
import { toast } from 'sonner';
import { GlassButton } from '@/components/ui/glass-button';
import { GlassInput } from '@/components/ui/glass-input';
import { GradientText } from '@/components/ui/gradient-text';
import { AnimatedGradient } from '@/components/ui/animated-gradient';
import { ParallaxContainer } from '@/components/ui/parallax-container';
import { GlassCard } from '@/components/ui/glass-card';

export function HeroSection() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error('Bitte gib eine gültige E-Mail-Adresse ein');
      return;
    }

    setLoading(true);
    try {
      const result = await addToWaitlist(email);
      if (result.success) {
        setSuccess(true);
        setEmail('');
        toast.success('Du bist auf der Waitlist! 🎉');
        setTimeout(() => setSuccess(false), 5000);
      } else {
        toast.error(result.message || 'Fehler beim Hinzufügen zur Waitlist');
      }
    } catch (error) {
      toast.error('Fehler beim Hinzufügen zur Waitlist');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-bg-primary">
      {/* Animated Gradient Background */}
      <AnimatedGradient />
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a2608_1px,transparent_1px),linear-gradient(to_bottom,#1a1a2608_1px,transparent_1px)] bg-[size:4rem_4rem] -z-10" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-glass-border"
            >
              <Sparkles className="w-4 h-4 text-accent-end" />
              <span className="text-sm font-medium text-text-primary">AI-Powered Pricing für Shopify</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-hero font-serif leading-tight"
            >
              <GradientText animated>
                AI-Powered Pricing.
              </GradientText>
              <br />
              <span className="text-text-primary">Mehr Umsatz. Weniger Raten.</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-hero-sub font-sans text-text-secondary max-w-xl"
            >
              Die erste Shopify-App, die deine Preise mit Machine Learning optimiert – automatisch, datenbasiert, profitabel.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <GlassButton
                variant="primary"
                glow
                animated
                onClick={() => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Join the Waitlist
                <ArrowRight className="w-5 h-5" />
              </GlassButton>
              
              <GlassButton variant="ghost">
                <Play className="w-5 h-5" />
                Watch Demo
              </GlassButton>
            </motion.div>
          </motion.div>

          {/* Right: 3D Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="relative"
          >
            <ParallaxContainer intensity={0.3}>
              <GlassCard gradient className="p-0 overflow-hidden">
                {/* Dashboard Mockup */}
                <div className="bg-bg-secondary p-6 space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-accent flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="h-3 w-24 bg-text-secondary/20 rounded mb-2" />
                        <div className="h-2 w-16 bg-text-muted/20 rounded" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/50" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                      <div className="w-3 h-3 rounded-full bg-green-500/50" />
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="glass p-4 rounded-xl">
                        <div className="h-2 w-12 bg-text-muted/20 rounded mb-3" />
                        <div className="h-6 w-20 bg-gradient-accent rounded mb-2" />
                        <div className="h-2 w-16 bg-text-muted/20 rounded" />
                      </div>
                    ))}
                  </div>

                  {/* Chart Placeholder */}
                  <div className="glass p-6 rounded-xl h-32 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-2 rounded-lg bg-gradient-accent/20 flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-accent-end" />
                      </div>
                      <div className="h-2 w-24 bg-text-muted/20 rounded mx-auto" />
                    </div>
                  </div>
                </div>
              </GlassCard>
            </ParallaxContainer>

            {/* Glow Effect */}
            <div className="absolute inset-0 -z-10 bg-gradient-accent opacity-20 blur-3xl rounded-3xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
