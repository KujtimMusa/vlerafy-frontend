'use client';

import { motion } from 'framer-motion';
import { BarChart, Zap, ShieldCheck, TrendingUp } from 'lucide-react';

const features = [
  {
    icon: BarChart,
    title: 'AI Price Recommendations',
    description: 'Machine Learning analyzes 80+ factors – from sales history to competitor prices – to find the perfect price for every product.',
    gradient: 'from-blue-600 to-purple-600',
    iconGradient: 'from-blue-600/20 to-purple-600/10',
    iconColor: 'text-blue-400',
    large: true,
    visual: 'chart'
  },
  {
    icon: Zap,
    title: '1-Click Apply',
    description: 'Update prices directly in Shopify. Secure, tested, production-ready.',
    gradient: 'from-cyan-600 to-blue-600',
    iconGradient: 'from-cyan-600/20 to-blue-600/10',
    iconColor: 'text-cyan-400',
    large: false,
    visual: null
  },
  {
    icon: ShieldCheck,
    title: 'Real-Time Insights',
    description: 'Live dashboard shows exactly what\'s working and why.',
    gradient: 'from-purple-600 to-pink-600',
    iconGradient: 'from-purple-600/20 to-pink-600/10',
    iconColor: 'text-purple-400',
    large: false,
    visual: null
  },
  {
    icon: TrendingUp,
    title: 'Built for Scale',
    description: 'Enterprise-grade security, 85% test coverage, 24/7 monitoring with Sentry integration.',
    gradient: 'from-green-600 to-emerald-600',
    iconGradient: 'from-green-600/20 to-emerald-600/10',
    iconColor: 'text-green-400',
    large: true,
    visual: 'stats'
  },
];

export function UltraModernFeaturesSection() {
  return (
    <section id="features" className="relative py-32 bg-[#0a0a0f]">
      {/* Background Blur Orbs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      
      <div className="relative max-w-7xl mx-auto px-4">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
            Everything you need
          </h2>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto font-light">
            AI-powered pricing optimization built for modern Shopify merchants
          </p>
        </motion.div>
        
        {/* BENTO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isLarge = feature.large;
            
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`group relative ${isLarge ? 'lg:col-span-2' : ''}`}
              >
                {/* Glow on Hover */}
                <div className={`absolute -inset-1 bg-gradient-to-r ${feature.gradient} rounded-3xl opacity-0 group-hover:opacity-30 blur-xl transition duration-500`} />
                
                {/* Card */}
                <div className="relative h-full p-8 bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 rounded-3xl hover:border-zinc-700 transition-all duration-500 group-hover:transform group-hover:scale-[1.02] group-hover:shadow-[0_0_80px_rgba(59,130,246,0.3)]">
                  
                  {/* Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.iconGradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-8 h-8 ${feature.iconColor}`} />
                  </div>
                  
                  {/* Content */}
                  <h3 className={`${isLarge ? 'text-2xl' : 'text-xl'} font-bold text-white mb-3 group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300`}>
                    {feature.title}
                  </h3>
                  <p className={`text-zinc-400 ${isLarge ? 'text-lg' : ''} leading-relaxed mb-6`}>
                    {feature.description}
                  </p>
                  
                  {/* Visual Element */}
                  {feature.visual === 'chart' && (
                    <div className="h-24 bg-zinc-800/50 rounded-xl p-4 flex items-end gap-2">
                      <div className="flex-1 bg-blue-500/20 rounded h-1/2 transition-all group-hover:bg-blue-500/30" />
                      <div className="flex-1 bg-blue-500/30 rounded h-2/3 transition-all group-hover:bg-blue-500/40" />
                      <div className="flex-1 bg-blue-500/50 rounded h-full transition-all group-hover:bg-blue-500/60" />
                      <div className="flex-1 bg-blue-500/40 rounded h-3/4 transition-all group-hover:bg-blue-500/50" />
                      <div className="flex-1 bg-blue-500/60 rounded h-5/6 transition-all group-hover:bg-blue-500/70" />
                    </div>
                  )}
                  
                  {feature.visual === 'stats' && (
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-4 bg-zinc-800/30 rounded-xl">
                        <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                          80+
                        </div>
                        <div className="text-sm text-zinc-500">ML Factors</div>
                      </div>
                      <div className="p-4 bg-zinc-800/30 rounded-xl">
                        <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                          85%
                        </div>
                        <div className="text-sm text-zinc-500">Test Coverage</div>
                      </div>
                      <div className="p-4 bg-zinc-800/30 rounded-xl">
                        <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                          24/7
                        </div>
                        <div className="text-sm text-zinc-500">Monitoring</div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
          
        </div>
      </div>
    </section>
  );
}
