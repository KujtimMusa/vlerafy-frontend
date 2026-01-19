'use client';

import { motion } from 'framer-motion';

const features = [
  {
    icon: (
      <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'AI Price Recommendations',
    description: 'Machine Learning analyzes 80+ factors to find the perfect price.',
  },
  {
    icon: (
      <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: '1-Click Apply',
    description: 'Update prices directly in Shopify. Secure, tested, production-ready.',
  },
  {
    icon: (
      <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Real-Time Insights',
    description: 'Live dashboard shows exactly what\'s working and why.',
  },
];

export function PremiumFeaturesSection() {
  return (
    <section className="relative py-32 bg-black">
      {/* Background Blur Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
      
      <div className="relative max-w-6xl mx-auto px-4">
        
        {/* Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative"
            >
              {/* Glow on Hover */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl opacity-0 group-hover:opacity-30 blur transition duration-500" />
              
              {/* Card */}
              <div className="relative p-8 bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl transition-all duration-500 group-hover:border-blue-500/50 group-hover:transform group-hover:scale-105">
                
                {/* Icon */}
                <div className="w-14 h-14 bg-blue-600/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600/20 transition">
                  {feature.icon}
                </div>
                
                {/* Text */}
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-zinc-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
          
        </div>
      </div>
    </section>
  );
}
