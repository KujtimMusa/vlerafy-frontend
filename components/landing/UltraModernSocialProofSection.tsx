'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface StatProps {
  value: string;
  label: string;
  gradient: string;
  delay?: number;
}

const Stat = ({ value, label, gradient, delay = 0 }: StatProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.6, delay }}
      className="text-center group"
    >
      <div className={`text-6xl font-black mb-3 bg-gradient-to-r ${gradient} bg-clip-text text-transparent group-hover:scale-110 transition-transform`}>
        {value}
      </div>
      <div className="text-zinc-500">{label}</div>
    </motion.div>
  );
};

export function UltraModernSocialProofSection() {
  return (
    <section className="py-24 bg-[#0a0a0f]">
      <div className="max-w-5xl mx-auto px-4">
        
        {/* Label */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center text-sm text-zinc-600 uppercase tracking-widest mb-12"
        >
          Trusted by Shopify Merchants
        </motion.p>
        
        {/* Animated Counter Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
          <Stat
            value="80+"
            label="ML Factors"
            gradient="from-blue-400 to-cyan-400"
            delay={0}
          />
          <Stat
            value="85%"
            label="Test Coverage"
            gradient="from-purple-400 to-pink-400"
            delay={0.2}
          />
          <Stat
            value="24/7"
            label="Monitoring"
            gradient="from-green-400 to-emerald-400"
            delay={0.4}
          />
        </div>
      </div>
    </section>
  );
}
