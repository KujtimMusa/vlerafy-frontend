'use client';

import { motion } from 'framer-motion';
import { Shield, Zap, CheckCircle2 } from 'lucide-react';

const trustItems = [
  { icon: Shield, text: 'Designed for Shopify' },
  { icon: Zap, text: 'Powered by AI' },
  { icon: CheckCircle2, text: 'Secured by Sentry' },
];

const stats = [
  { value: '65', label: 'Tests Passed' },
  { value: '85%', label: 'Coverage' },
  { value: 'Production', label: 'Ready' },
];

export function TrustBar() {
  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 bg-bg-primary border-y border-glass-border">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Trust Items */}
          <div className="flex flex-wrap items-center gap-8 justify-center md:justify-start">
            {trustItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.text}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center gap-2 text-text-secondary text-sm"
                >
                  <Icon className="w-4 h-4 text-accent-end" />
                  <span>{item.text}</span>
                </motion.div>
              );
            })}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-lg font-bold text-text-primary">{stat.value}</div>
                <div className="text-xs text-text-muted">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
