'use client';

import { motion } from 'framer-motion';
import { 
  Brain, 
  TrendingUp, 
  Zap,
  Shield
} from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { GradientText } from '@/components/ui/gradient-text';

const features = [
  {
    icon: Brain,
    title: 'AI Price Recommendations',
    description: 'Machine Learning analysiert 80+ Faktoren – von Sales-History bis Competitor-Preisen.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: TrendingUp,
    title: 'Real-Time Monitoring',
    description: 'Live-Dashboard mit Sentry-Integration. Sehe sofort, was funktioniert.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Zap,
    title: 'Automated Apply',
    description: '1-Click Price Update direkt in Shopify. Secure, tested, production-ready.',
    gradient: 'from-yellow-500 to-orange-500',
  },
  {
    icon: Shield,
    title: 'Security-First',
    description: 'JWT Auth, Rate Limiting, 80%+ Test Coverage. Deine Daten sind safe.',
    gradient: 'from-green-500 to-emerald-500',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-bg-primary">
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
            Alles, was du für erfolgreiche{' '}
            <GradientText>Preisoptimierung</GradientText>{' '}
            brauchst
          </h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto font-sans">
            Ein komplettes Toolkit für moderne E-Commerce-Unternehmen
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <GlassCard hover>
                  {/* Icon */}
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.gradient} mb-6`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-text-primary mb-3">
                    <GradientText>{feature.title}</GradientText>
                  </h3>
                  <p className="text-text-secondary leading-relaxed font-sans">
                    {feature.description}
                  </p>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
