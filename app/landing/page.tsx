'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { addToWaitlist } from '@/lib/waitlist-api';
import { toast } from 'sonner';

export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Navigation scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const nav = document.querySelector('nav');
      const border = document.getElementById('nav-border');
      
      if (window.scrollY > 100) {
        nav?.classList.add('bg-zinc-950/80', 'backdrop-blur-xl');
        border?.classList.remove('opacity-0');
      } else {
        nav?.classList.remove('bg-zinc-950/80', 'backdrop-blur-xl');
        border?.classList.add('opacity-0');
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const result = await addToWaitlist(email, 'landing');
      if (result.success) {
        toast.success('You\'re on the waitlist! 🎉');
        setEmail('');
      } else {
        setError(result.message || 'Something went wrong');
        toast.error(result.message || 'Failed to join waitlist');
      }
    } catch (err) {
      setError('Failed to join waitlist. Please try again.');
      toast.error('Failed to join waitlist');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F12]">
      {/* ==================== NAVIGATION ==================== */}
      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <img src="/logo.svg" alt="Vlerafy" className="h-7" />
            </div>
            
            {/* Links (Desktop only) */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-zinc-400 hover:text-white transition">Features</a>
              <a href="#pricing" className="text-sm text-zinc-400 hover:text-white transition">Pricing</a>
              <a href="/admin" className="text-xs text-zinc-600 hover:text-zinc-400 transition">Admin</a>
            </div>
          </div>
        </div>
        
        {/* Border Bottom (shows on scroll) */}
        <div className="border-b border-zinc-900 opacity-0 transition-opacity" id="nav-border" />
      </nav>

      {/* ==================== HERO SECTION ==================== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0F0F12] pt-20">
        
        {/* ANIMATED GRID BACKGROUND */}
        <div className="absolute inset-0 opacity-20">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(rgba(59,130,246,0.1) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(59,130,246,0.1) 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
            }}
          />
          <div 
            className="absolute inset-0 animate-grid-move"
            style={{
              backgroundImage: `linear-gradient(rgba(59,130,246,0.1) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(59,130,246,0.1) 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
            }}
          />
        </div>
        
        {/* SUBTLE GRADIENT GLOW (Bottom) */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/5 rounded-full blur-[120px]" />
        
        {/* CONTENT */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/50 backdrop-blur border border-zinc-800/50 mb-8 animate-fade-in-up">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
            </div>
            <span className="text-sm text-zinc-400">AI-Powered Pricing for Shopify</span>
          </div>
          
          {/* Headline */}
          <h1 className="text-7xl md:text-8xl font-black mb-6 leading-tight tracking-tight animate-fade-in-up animation-delay-100">
            <span className="block bg-gradient-to-r from-white via-white to-zinc-400 bg-clip-text text-transparent">
              Price Smarter.
            </span>
            <span className="block mt-2 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
              Earn More.
            </span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-zinc-400 mb-12 max-w-2xl mx-auto font-light leading-relaxed animate-fade-in-up animation-delay-200">
            The first Shopify app that optimizes your prices with Machine Learning. 
            Automatic, data-driven, profitable.
          </p>
          
          {/* CTA Form */}
          <div className="relative max-w-xl mx-auto animate-fade-in-up animation-delay-300">
            <form onSubmit={handleSubmit} className="flex gap-3 p-2 bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-zinc-800/50 shadow-2xl hover:border-zinc-700 transition-all duration-300">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                className="flex-1 px-6 py-4 bg-transparent text-white placeholder:text-zinc-500 outline-none text-lg"
              />
              <button 
                type="submit"
                disabled={loading}
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Joining...' : 'Join Waitlist →'}
                
                {/* Shimmer Effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer bg-[length:200%_100%]" />
              </button>
            </form>
            
            {error && (
              <p className="text-red-400 text-sm mt-2 text-center">{error}</p>
            )}
            
            {/* Trust Line */}
            <p className="text-sm text-zinc-600 mt-4 flex items-center justify-center gap-2">
              No spam. Only updates when we launch. 
              <span className="text-purple-400">💜</span>
            </p>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
        
      </section>

      {/* ==================== FEATURES SECTION ==================== */}
      <section id="features" className="relative py-32 bg-[#0F0F12]">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Section Header */}
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              Everything you need
            </h2>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
              AI-powered pricing optimization built for modern Shopify merchants
            </p>
          </div>
          
          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* CARD 1 */}
            <FeatureCard
              icon={
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
              title="AI Price Recommendations"
              description="Machine Learning analyzes 80+ factors to find the perfect price for every product."
              gradientFrom="from-blue-600/50"
              gradientTo="to-cyan-600/50"
              iconBg="bg-blue-500/10"
            />
            
            {/* CARD 2 */}
            <FeatureCard
              icon={
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
              title="1-Click Apply"
              description="Update prices directly in Shopify. Secure, tested, production-ready."
              gradientFrom="from-purple-600/50"
              gradientTo="to-pink-600/50"
              iconBg="bg-purple-500/10"
            />
            
            {/* CARD 3 */}
            <FeatureCard
              icon={
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              title="Real-Time Insights"
              description="Live dashboard shows exactly what's working. 24/7 monitoring included."
              gradientFrom="from-green-600/50"
              gradientTo="to-emerald-600/50"
              iconBg="bg-green-500/10"
            />
            
          </div>
        </div>
      </section>

      {/* ==================== SOCIAL PROOF SECTION ==================== */}
      <section className="py-24 bg-[#0F0F12]">
        <div className="max-w-5xl mx-auto px-6">
          
          <p className="text-center text-xs text-zinc-600 uppercase tracking-widest mb-16">
            Trusted by Shopify Merchants
          </p>
          
          <div className="grid grid-cols-3 gap-16">
            {[
              { value: '80+', label: 'ML Factors', color: 'from-blue-400 to-cyan-400' },
              { value: '85%', label: 'Test Coverage', color: 'from-purple-400 to-pink-400' },
              { value: '24/7', label: 'Monitoring', color: 'from-green-400 to-emerald-400' }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className={`text-6xl md:text-7xl font-black mb-3 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {stat.value}
                </div>
                <div className="text-zinc-500 text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FINAL CTA SECTION ==================== */}
      <section className="relative py-32 bg-[#0F0F12]">
        
        {/* Background Glow */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px]" />
        </div>
        
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            Ready to get started?
          </h2>
          <p className="text-lg text-zinc-400 mb-12">
            Join the waitlist and be the first to access AI-powered pricing.
          </p>
          
          {/* Form (same as Hero) */}
          <div className="max-w-xl mx-auto">
            <form onSubmit={handleSubmit} className="flex gap-3 p-2 bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-zinc-800/50 shadow-2xl hover:border-zinc-700 transition-all duration-300">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                className="flex-1 px-6 py-4 bg-transparent text-white placeholder:text-zinc-500 outline-none text-lg"
              />
              <button 
                type="submit"
                disabled={loading}
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Joining...' : 'Join Waitlist →'}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer bg-[length:200%_100%]" />
              </button>
            </form>
            {error && (
              <p className="text-red-400 text-sm mt-2 text-center">{error}</p>
            )}
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="py-12 bg-[#0F0F12] border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            
            {/* Logo */}
            <img src="/logo.svg" alt="Vlerafy" className="h-6 opacity-50" />
            
            {/* Links */}
            <div className="flex gap-8 text-sm text-zinc-500">
              <a href="/privacy" className="hover:text-zinc-300 transition">Privacy</a>
              <a href="/imprint" className="hover:text-zinc-300 transition">Imprint</a>
              <a href="mailto:contact@vlerafy.com" className="hover:text-zinc-300 transition">Contact</a>
              <a href="/admin" className="hover:text-zinc-400 transition">Admin</a>
            </div>
            
            {/* Copyright */}
            <div className="text-sm text-zinc-600">
              © 2026 Vlerafy · Made with 💜
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Feature Card Component with Scroll Animation
function FeatureCard({
  icon,
  title,
  description,
  gradientFrom,
  gradientTo,
  iconBg,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradientFrom: string;
  gradientTo: string;
  iconBg: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6 }}
      className="group feature-card"
    >
      <div className="relative h-full p-8 bg-zinc-900/30 backdrop-blur-xl border border-zinc-800/50 rounded-2xl transition-all duration-500 hover:bg-zinc-900/50 hover:border-zinc-700">
        
        {/* Hover Glow */}
        <div className={`absolute -inset-px bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition duration-500 -z-10`} />
        
        {/* Icon */}
        <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        
        {/* Text */}
        <h3 className="text-xl font-semibold text-white mb-3">
          {title}
        </h3>
        <p className="text-zinc-400 leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
}
