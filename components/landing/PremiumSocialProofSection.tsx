'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const stats = [
  { value: 80, suffix: '+', label: 'ML Factors' },
  { value: 85, suffix: '%', label: 'Test Coverage' },
  { value: 24, suffix: '/7', label: 'Monitoring' },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <span>
      {count}{suffix}
    </span>
  );
}

export function PremiumSocialProofSection() {
  return (
    <section className="py-24 bg-black">
      <div className="max-w-4xl mx-auto px-4 text-center">
        
        {/* Title */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-sm text-zinc-500 uppercase tracking-wider mb-12"
        >
          Trusted by Shopify Merchants
        </motion.p>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-12">
          
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent mb-2">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-zinc-400">{stat.label}</div>
            </motion.div>
          ))}
          
        </div>
      </div>
    </section>
  );
}
