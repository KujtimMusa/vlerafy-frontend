'use client';

import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, DollarSign, Package, Sparkles } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { GradientText } from '@/components/ui/gradient-text';

export function SneakPeekSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-bg-secondary">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-text-primary mb-4 font-serif">
            Ein Dashboard, das{' '}
            <GradientText>denkt</GradientText>
            .
          </h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto font-sans">
            Sehe auf einen Blick: Welche Produkte optimiert werden sollten, warum, und mit welcher Confidence.
          </p>
        </motion.div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <GlassCard gradient className="p-0 overflow-hidden">
            {/* Dashboard Mockup */}
            <div className="bg-bg-secondary p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-accent flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="h-4 w-32 bg-text-secondary/20 rounded mb-2" />
                    <div className="h-3 w-24 bg-text-muted/20 rounded" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                  { icon: DollarSign, label: 'Umsatz', value: '€12,450', change: '+12%' },
                  { icon: Package, label: 'Produkte', value: '234', change: '+5' },
                  { icon: TrendingUp, label: 'Optimierungen', value: '18', change: '+3' },
                  { icon: BarChart3, label: 'Marge', value: '32%', change: '+2.5%' },
                ].map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                      className="glass p-6 rounded-xl"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Icon className="w-5 h-5 text-accent-end" />
                        <span className="text-sm text-success font-medium">{stat.change}</span>
                      </div>
                      <div className="text-2xl font-bold text-text-primary mb-1">{stat.value}</div>
                      <div className="text-sm text-text-muted">{stat.label}</div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Chart Placeholder */}
              <div className="glass p-8 rounded-xl h-64 flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-16 h-16 text-text-muted/30 mx-auto mb-4" />
                  <p className="text-text-muted">Preis-Trends & Analytics</p>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Glow Effect */}
          <div className="absolute inset-0 -z-10 bg-gradient-accent opacity-20 blur-3xl rounded-3xl" />
        </motion.div>
      </div>
    </section>
  );
}
