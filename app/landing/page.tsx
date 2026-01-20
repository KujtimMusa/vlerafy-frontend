'use client';

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { addToWaitlist } from '@/lib/waitlist-api';
import { toast } from 'sonner';
import { 
  BarChart3, 
  Zap, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  TrendingUp,
  Package,
  Target
} from 'lucide-react';

export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 300], [1, 0.95]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await addToWaitlist(email, 'landing');
      if (result.success) {
        toast.success('✓ You\'re on the waitlist! Check your email.');
        setSuccess(true);
        setEmail('');
      } else {
        toast.error(result.message || 'Something went wrong. Please try again.');
      }
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      
      {/* NAVIGATION */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-zinc-800' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* Logo - MIT ICON */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              Vlerafy
            </span>
          </div>
          
          {/* Navigation Links - KORREKTE Schreibweise */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-zinc-400 hover:text-white transition">Features</a>
            <a href="#pricing" className="text-sm text-zinc-400 hover:text-white transition">Pricing</a>
            <a href="/admin" className="text-xs text-zinc-600 hover:text-zinc-400 transition">Admin</a>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6 pt-16">
        
        {/* Animated Background */}
        <motion.div 
          className="absolute inset-0"
          style={{ opacity: heroOpacity }}
        >
          {/* Center Radial Gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-black to-black" />
          
          {/* Animated Orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </motion.div>

        {/* Content */}
        <motion.div 
          className="relative z-10 max-w-5xl mx-auto text-center"
          style={{ scale: heroScale }}
        >
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 backdrop-blur-sm mb-8"
          >
            <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            <span className="text-sm font-medium text-indigo-300">AI-Powered Pricing for Shopify</span>
          </motion.div>

          {/* Headline - MIT GRADIENT HIGHLIGHTS AUF WICHTIGEN WÖRTERN */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-6xl md:text-8xl font-bold mb-6 leading-[1.1] tracking-tight"
          >
            <span className="block text-white">
              Price{' '}
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Smarter
              </span>
              .
            </span>
            <span className="block mt-2 text-white">
              Earn{' '}
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                More
              </span>
              .
            </span>
          </motion.h1>

          {/* Subheadline - BESSER FORMATIERT */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-xl md:text-2xl text-zinc-400 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            The first Shopify app that optimizes your prices with{' '}
            <span className="text-indigo-400 font-semibold">Machine Learning</span>.
            <br className="hidden md:block" />
            <span className="text-zinc-500">Automatic</span>, <span className="text-zinc-500">data-driven</span>, <span className="text-green-400 font-semibold">profitable</span>.
          </motion.p>

          {/* CTA Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            {success ? (
              <div className="max-w-lg mx-auto p-6 bg-green-500/10 border border-green-500/30 rounded-2xl backdrop-blur-xl">
                <CheckCircle2 className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <p className="text-green-400 text-lg font-medium">You're on the waitlist!</p>
                <p className="text-green-400/60 text-sm mt-2">Check your email for confirmation.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
                <div className="relative group">
                  {/* Glow Effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition duration-500" />
                  
                  {/* Form Container */}
                  <div className="relative flex flex-col sm:flex-row gap-3 p-2 bg-zinc-900 border border-zinc-800 rounded-2xl backdrop-blur-xl">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="flex-1 px-5 py-4 bg-transparent text-white placeholder:text-zinc-500 outline-none text-lg"
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="group/btn px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl text-white font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {loading ? 'Joining...' : (
                        <>
                          Join Waitlist
                          <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
                <p className="text-sm text-zinc-600 mt-4">No spam. Updates only when we launch. 💜</p>
              </form>
            )}
          </motion.div>
        </motion.div>

        {/* Scroll Indicator - PERFEKT ZENTRIERT */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center"
        >
          <span className="text-xs text-zinc-600 uppercase tracking-wider mb-2">Scroll</span>
          <motion.div 
            className="w-px h-12 bg-gradient-to-b from-indigo-600 via-purple-600 to-transparent"
            animate={{ scaleY: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </section>

      {/* PRODUCT SHOWCASE / DASHBOARD PREVIEW */}
      <section className="relative py-32 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          
          {/* NEUE SECTION HEADLINE */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-4">
              <span className="text-white">See it in </span>
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Action
              </span>
            </h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Real-time price optimization powered by AI
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* BACKGROUND GLOW - STÄRKER */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-600/20 via-purple-600/10 to-transparent rounded-3xl blur-3xl" />
            
            {/* Dashboard Card - PURE BLACK BACKGROUND */}
            <div className="relative bg-black rounded-3xl border border-zinc-800 overflow-hidden shadow-2xl shadow-indigo-500/20">
              
              {/* Window Bar */}
              <div className="flex items-center gap-2 px-6 py-4 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="ml-4 text-sm text-zinc-400 font-medium">Price Recommendations</span>
                <div className="ml-auto flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs text-green-400 font-medium">Live</span>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="p-8 space-y-6">
                
                {/* Stats Grid - MIT ICONS & GRADIENT ZAHLEN */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { 
                      icon: TrendingUp, 
                      label: 'Revenue Impact', 
                      value: '+23.4%', 
                      gradient: 'from-green-400 to-emerald-400',
                      bgGradient: 'from-green-500/10 to-emerald-500/10'
                    },
                    { 
                      icon: Package, 
                      label: 'Products Optimized', 
                      value: '247', 
                      gradient: 'from-blue-400 to-cyan-400',
                      bgGradient: 'from-blue-500/10 to-cyan-500/10'
                    },
                    { 
                      icon: Target, 
                      label: 'Avg. Confidence', 
                      value: '89%', 
                      gradient: 'from-purple-400 to-pink-400',
                      bgGradient: 'from-purple-500/10 to-pink-500/10'
                    }
                  ].map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        viewport={{ once: true }}
                        className="group relative p-6 bg-zinc-900/50 rounded-2xl border border-zinc-800 backdrop-blur hover:bg-zinc-900/70 hover:border-zinc-700 transition-all cursor-pointer"
                      >
                        {/* Hover Glow */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity`} />
                        
                        <div className="relative">
                          {/* Icon */}
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} opacity-10 group-hover:opacity-20 flex items-center justify-center mb-4 transition-all group-hover:scale-110`}>
                            <Icon className={`w-6 h-6 bg-gradient-to-br ${stat.gradient} bg-clip-text text-transparent`} style={{ WebkitTextFillColor: 'transparent' }} />
                          </div>
                          
                          {/* Label */}
                          <div className="text-sm text-zinc-500 mb-2">{stat.label}</div>
                          
                          {/* Value - GRADIENT */}
                          <div className={`text-4xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                            {stat.value}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Recommendation Cards - MIT GLOW & SICHTBAREM APPLY BUTTON */}
                <div className="space-y-3">
                  {[
                    { product: 'Wireless Headphones Pro', current: '€89.99', recommended: '€94.99', confidence: 92, trend: 'up' },
                    { product: 'Smart Watch Elite', current: '€249.99', recommended: '€239.99', confidence: 87, trend: 'down' },
                    { product: 'Bluetooth Speaker Max', current: '€79.99', recommended: '€84.99', confidence: 94, trend: 'up' }
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                      viewport={{ once: true }}
                      className="group relative p-6 bg-zinc-900/30 border border-zinc-800 rounded-2xl hover:bg-zinc-900/50 hover:border-indigo-500/50 transition-all cursor-pointer"
                    >
                      {/* Hover Glow */}
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity" />
                      
                      <div className="relative flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="text-white font-medium mb-2 group-hover:text-indigo-400 transition-colors text-lg">
                            {item.product}
                          </h4>
                          <div className="flex items-center gap-4 text-base">
                            <span className="text-zinc-500">
                              Current: <span className="text-zinc-300 font-medium">{item.current}</span>
                            </span>
                            <ArrowRight className="w-4 h-4 text-zinc-600" />
                            <span className="text-zinc-500">
                              Recommended:{' '}
                              <span className={`font-bold ${item.trend === 'up' ? 'text-green-400' : 'text-orange-400'}`}>
                                {item.recommended}
                              </span>
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          {/* Confidence Badge */}
                          <div className="px-4 py-2 bg-indigo-500/20 border border-indigo-500/30 rounded-xl">
                            <span className="text-indigo-300 font-bold text-base">{item.confidence}%</span>
                          </div>
                          
                          {/* Apply Button - IMMER SICHTBAR mit Hover Effect */}
                          <button className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl text-white font-semibold transition-all hover:scale-105 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40">
                            Apply
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Mini Chart - MIT GRADIENT BARS */}
                <div className="p-6 bg-zinc-900/30 rounded-2xl border border-zinc-800">
                  <div className="flex items-end justify-between h-32 gap-2">
                    {[45, 70, 55, 85, 65, 95, 75, 90, 80, 100, 90, 95].map((height, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        whileInView={{ height: `${height}%` }}
                        transition={{ duration: 0.5, delay: 0.5 + i * 0.05 }}
                        viewport={{ once: true }}
                        className="flex-1 bg-gradient-to-t from-indigo-600 via-purple-600 to-cyan-600 rounded-t-lg hover:from-indigo-500 hover:via-purple-500 hover:to-cyan-500 transition-all cursor-pointer shadow-lg shadow-indigo-500/20"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-zinc-500 text-center mt-4 font-medium">Revenue Trend (Last 12 Months)</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="relative py-32 px-6 bg-black" id="features">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-4 text-white">
              Everything you need
            </h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              AI-powered pricing optimization built for modern Shopify merchants
            </p>
          </motion.div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: BarChart3,
                title: 'AI Price Recommendations',
                description: 'Machine Learning analyzes 80+ factors to find the perfect price for every product.',
                gradient: 'from-indigo-500 to-purple-500',
                iconGradient: 'from-indigo-400 to-purple-400'
              },
              {
                icon: Zap,
                title: '1-Click Apply',
                description: 'Update prices directly in Shopify. Secure, tested, production-ready.',
                gradient: 'from-purple-500 to-pink-500',
                iconGradient: 'from-purple-400 to-pink-400'
              },
              {
                icon: CheckCircle2,
                title: 'Real-Time Insights',
                description: 'Live dashboard with 24/7 monitoring. See what\'s working instantly.',
                gradient: 'from-cyan-500 to-blue-500',
                iconGradient: 'from-cyan-400 to-blue-400'
              }
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="group relative p-8 bg-zinc-900/50 border border-zinc-800 rounded-3xl hover:border-zinc-700 transition-all"
                >
                  {/* Hover Glow */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity`} />
                  
                  <div className="relative">
                    {/* Icon - GRÖßER, MIT GRADIENT */}
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-10 group-hover:opacity-20 flex items-center justify-center mb-6 transition-all group-hover:scale-110`}>
                      <Icon className={`w-8 h-8 bg-gradient-to-br ${feature.iconGradient} bg-clip-text`} style={{ WebkitTextFillColor: 'transparent' }} />
                    </div>
                    
                    {/* Title - MIT GRADIENT ON HOVER */}
                    <h3 className={`text-2xl font-semibold text-white mb-3 group-hover:bg-gradient-to-r group-hover:${feature.iconGradient} group-hover:bg-clip-text group-hover:text-transparent transition-all`}>
                      {feature.title}
                    </h3>
                    
                    {/* Description - LESBAR */}
                    <p className="text-zinc-400 leading-relaxed text-base">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="relative py-32 px-6 bg-black">
        <div className="max-w-5xl mx-auto">
          
          {/* Label - PROMINENTER */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center text-sm text-indigo-400/60 uppercase tracking-[0.3em] mb-16 font-semibold"
          >
            Trusted by Shopify Merchants
          </motion.p>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              { value: '80+', label: 'ML Factors', gradient: 'from-indigo-400 via-purple-400 to-pink-400' },
              { value: '85%', label: 'Test Coverage', gradient: 'from-purple-400 via-pink-400 to-cyan-400' },
              { value: '24/7', label: 'Monitoring', gradient: 'from-cyan-400 via-blue-400 to-indigo-400' }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center group cursor-default"
              >
                {/* Value - MIT GRADIENT & HOVER SCALE */}
                <div className={`text-7xl md:text-8xl font-bold mb-4 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent group-hover:scale-110 transition-transform`}>
                  {stat.value}
                </div>
                
                {/* Label - BESSER LESBAR */}
                <div className="text-zinc-400 text-lg font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative py-32 px-6 bg-black overflow-hidden">
        
        {/* RADIAL GRADIENT BACKGROUND */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[1000px] h-[1000px] bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-cyan-600/20 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {/* Headline - MIT GRADIENT */}
            <h2 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-white">Ready to </span>
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                get started
              </span>
              <span className="text-white">?</span>
            </h2>
            
            <p className="text-xl text-zinc-400 mb-12 max-w-2xl mx-auto">
              Join the waitlist and be the first to access AI-powered pricing.
            </p>
            
            {!success && (
              <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
                <div className="relative group">
                  {/* STÄRKERER GLOW */}
                  <div className="absolute -inset-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 rounded-2xl blur-xl opacity-30 group-hover:opacity-60 transition duration-500" />
                  
                  <div className="relative flex flex-col sm:flex-row gap-3 p-2 bg-zinc-900/80 border border-zinc-800 rounded-2xl backdrop-blur-xl">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="flex-1 px-5 py-4 bg-transparent text-white placeholder:text-zinc-500 outline-none text-lg"
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="group/btn px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl text-white font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50"
                    >
                      {loading ? 'Joining...' : (
                        <>
                          Join Waitlist
                          <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative py-16 px-6 border-t border-zinc-900 bg-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* Logo - MIT ICON */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-600/20 to-purple-600/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-indigo-400/60" />
            </div>
            <span className="text-zinc-600 font-medium">Vlerafy</span>
          </div>
          
          {/* Links - MIT GRADIENT HOVER */}
          <div className="flex gap-8 text-sm">
            <a href="/privacy" className="text-zinc-500 hover:bg-gradient-to-r hover:from-indigo-400 hover:to-purple-400 hover:bg-clip-text hover:text-transparent transition">
              Privacy
            </a>
            <a href="/imprint" className="text-zinc-500 hover:bg-gradient-to-r hover:from-indigo-400 hover:to-purple-400 hover:bg-clip-text hover:text-transparent transition">
              Imprint
            </a>
            <a href="mailto:contact@vlerafy.com" className="text-zinc-500 hover:bg-gradient-to-r hover:from-indigo-400 hover:to-purple-400 hover:bg-clip-text hover:text-transparent transition">
              Contact
            </a>
            <a href="/admin" className="text-zinc-700 hover:text-zinc-500 transition">
              Admin
            </a>
          </div>
          
          {/* Copyright - MIT HERZ */}
          <div className="text-sm text-zinc-600 flex items-center gap-1">
            <span>© 2026 Vlerafy · Made with</span>
            <span className="text-purple-500 animate-pulse">💜</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
