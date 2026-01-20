'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { addToWaitlist } from '@/lib/waitlist-api';
import { toast } from 'sonner';

export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  // Navigation scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const nav = document.querySelector('nav');
      const border = document.getElementById('nav-border');
      
      if (window.scrollY > 100) {
        nav?.classList.add('bg-black/80', 'backdrop-blur-xl');
        border?.classList.remove('opacity-0');
      } else {
        nav?.classList.remove('bg-black/80', 'backdrop-blur-xl');
        border?.classList.add('opacity-0');
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-black">
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
              <a href="#features" className="text-sm text-gray-400 hover:text-white transition">Features</a>
              <a href="#pricing" className="text-sm text-gray-400 hover:text-white transition">Pricing</a>
              <a href="/admin" className="text-xs text-gray-600 hover:text-gray-400 transition">Admin</a>
            </div>
          </div>
        </div>
        
        {/* Border Bottom (shows on scroll) */}
        <div className="border-b border-white/5 opacity-0 transition-opacity" id="nav-border" />
      </nav>

      {/* ==================== HERO SECTION ==================== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
        
        {/* RADIAL GRADIENT BACKGROUND (Animated) */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Center Glow - Purple */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-purple-600/20 rounded-full blur-[150px] animate-pulse-slow" />
          
          {/* Top Left - Blue */}
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[120px] animate-float" />
          
          {/* Bottom Right - Cyan */}
          <div className="absolute -bottom-40 -right-40 w-[700px] h-[700px] bg-cyan-500/10 rounded-full blur-[130px] animate-float animation-delay-2000" />
        </div>
        
        {/* GRID OVERLAY (Subtle) */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
        
        {/* CONTENT */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          
          {/* Badge (Linear-Style) */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 backdrop-blur border border-white/10 mb-8 hover:bg-white/10 transition-all duration-300">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-sm font-medium text-white/80">AI-Powered Pricing for Shopify</span>
          </div>
          
          {/* Headline with ANIMATED GRADIENT */}
          <h1 className="text-7xl md:text-8xl font-bold mb-6 leading-[1.1] tracking-tight">
            <span className="block text-white mb-2">
              Price Smarter.
            </span>
            <span className="block bg-gradient-to-r from-purple-400 via-blue-500 to-cyan-400 bg-clip-text text-transparent animate-gradient-flow bg-[length:200%_auto]">
              Earn More.
            </span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-[#B4B4B4] mb-12 max-w-3xl mx-auto leading-relaxed font-light">
            The first Shopify app that optimizes your prices with Machine Learning. 
            <br className="hidden md:block" />
            Automatic, data-driven, profitable.
          </p>
          
          {/* CTA (Linear-Style Premium Button) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <form onSubmit={handleSubmit} className="relative group">
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition duration-500" />
              
              {/* Input + Button */}
              <div className="relative flex items-center gap-2 p-1.5 bg-black border border-white/20 rounded-2xl">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  className="w-[300px] px-5 py-3.5 bg-transparent text-white placeholder:text-gray-500 outline-none text-base font-medium"
                />
                <button 
                  type="submit"
                  disabled={loading}
                  className="group/btn relative px-6 py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-xl text-white font-semibold transition-all duration-300 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10">{loading ? 'Joining...' : 'Join Waitlist →'}</span>
                  
                  {/* Animated Shine */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                </button>
              </div>
            </form>
          </div>
          
          {error && (
            <p className="text-red-400 text-sm mt-4 text-center">{error}</p>
          )}
          
          {/* Trust Line */}
          <p className="text-sm text-gray-600 mt-6 font-medium">
            No spam. Only updates when we launch. 💜
          </p>
        </div>
        
        {/* Scroll Indicator (Linear-Style) */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
          <div className="flex flex-col items-center gap-3 opacity-50 hover:opacity-100 transition-opacity">
            <span className="text-xs text-gray-500 uppercase tracking-widest">Scroll</span>
            <div className="w-[2px] h-8 bg-gradient-to-b from-purple-500 to-transparent animate-scroll-line" />
          </div>
        </div>
        
      </section>

      {/* ==================== DASHBOARD PREVIEW SECTION ==================== */}
      <section className="relative py-32 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Dashboard Preview Container */}
          <div className="relative group perspective-1000">
            
            {/* Glow Background */}
            <div className="absolute inset-0 bg-gradient-to-t from-purple-600/20 via-blue-600/10 to-transparent rounded-3xl blur-3xl transform group-hover:scale-105 transition-transform duration-700" />
            
            {/* Main Dashboard Card */}
            <div className="relative transform hover:rotateX-2 transition-transform duration-500">
              
              {/* Dashboard Container */}
              <div className="relative bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] rounded-3xl border border-white/10 overflow-hidden shadow-2xl shadow-purple-500/20">
                
                {/* Top Bar */}
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/80" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                      <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                    <span className="text-sm text-gray-500 font-medium ml-4">Price Recommendations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-xs text-gray-500">Live</span>
                  </div>
                </div>
                
                {/* Dashboard Content */}
                <div className="p-8 space-y-6">
                  
                  {/* Stats Row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { label: 'Revenue Impact', value: '+23.4%', color: 'from-green-400 to-emerald-400' },
                      { label: 'Optimized Products', value: '247', color: 'from-blue-400 to-cyan-400' },
                      { label: 'Avg. Confidence', value: '89%', color: 'from-purple-400 to-pink-400' }
                    ].map((stat, i) => (
                      <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur hover:bg-white/10 transition-colors duration-300">
                        <div className="text-xs text-gray-500 mb-2">{stat.label}</div>
                        <div className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                          {stat.value}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Recommendation Cards (Stacked) */}
                  <div className="space-y-3">
                    {[
                      { product: 'Wireless Headphones Pro', current: '€89.99', recommended: '€94.99', confidence: 92, trend: 'up' },
                      { product: 'Smart Watch Elite', current: '€249.99', recommended: '€239.99', confidence: 87, trend: 'down' },
                      { product: 'Bluetooth Speaker Max', current: '€79.99', recommended: '€84.99', confidence: 94, trend: 'up' }
                    ].map((item, i) => (
                      <div key={i} 
                        className="group/card p-5 bg-gradient-to-r from-white/5 to-transparent rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:bg-white/10"
                        style={{ animationDelay: `${i * 100}ms` }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="text-white font-medium mb-2 group-hover/card:text-purple-400 transition-colors">
                              {item.product}
                            </h4>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="text-gray-500">Current: <span className="text-gray-400">{item.current}</span></span>
                              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                              </svg>
                              <span className="text-gray-500">Recommended: 
                                <span className={`ml-1 font-semibold ${item.trend === 'up' ? 'text-green-400' : 'text-orange-400'}`}>
                                  {item.recommended}
                                </span>
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            {/* Confidence Badge */}
                            <div className="px-3 py-1.5 bg-purple-500/20 border border-purple-500/30 rounded-lg">
                              <span className="text-xs text-purple-300 font-semibold">{item.confidence}% Confidence</span>
                            </div>
                            
                            {/* Apply Button */}
                            <button className="px-5 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-lg text-white text-sm font-semibold transition-all duration-300 opacity-0 group-hover/card:opacity-100 transform translate-x-2 group-hover/card:translate-x-0">
                              Apply
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Bottom Mini Chart */}
                  <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
                    <div className="flex items-end justify-between h-24 gap-2">
                      {[40, 65, 45, 80, 55, 90, 70, 85, 75, 95, 85, 100].map((height, i) => (
                        <div 
                          key={i} 
                          className="flex-1 bg-gradient-to-t from-purple-600 to-blue-600 rounded-t opacity-60 hover:opacity-100 transition-opacity duration-300"
                          style={{ height: `${height}%` }}
                        />
                      ))}
                    </div>
                    <div className="mt-3 text-xs text-gray-500 text-center">Revenue Trend (Last 12 Months)</div>
                  </div>
                </div>
                
                {/* Bottom Shine Effect */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50" />
              </div>
              
              {/* Floating Cards (Side Decorations) */}
              <div className="absolute -right-8 top-20 w-64 p-4 bg-gradient-to-br from-[#1a1a1a]/80 to-[#0d0d0d]/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500 hidden lg:block">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Margin Increase</div>
                    <div className="text-lg font-bold text-green-400">+18.3%</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -left-8 bottom-20 w-64 p-4 bg-gradient-to-br from-[#1a1a1a]/80 to-[#0d0d0d]/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-500 hidden lg:block">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Avg. Response</div>
                    <div className="text-lg font-bold text-blue-400">0.8s</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </section>

      {/* ==================== FEATURES SECTION ==================== */}
      <section id="features" className="relative py-32 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Section Header */}
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Everything you need
              </span>
            </h2>
            <p className="text-xl text-[#B4B4B4] max-w-2xl mx-auto">
              AI-powered pricing optimization built for modern Shopify merchants
            </p>
          </div>
          
          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* CARD 1 - AI Recommendations */}
            <FeatureCard
              icon={
                <svg className="w-7 h-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
              title="AI Price Recommendations"
              description="Machine Learning analyzes 80+ factors to find the perfect price for every product."
              gradientFrom="from-purple-600/10"
              gradientTo="to-transparent"
              accentColor="purple"
            />
            
            {/* CARD 2 - 1-Click Apply */}
            <FeatureCard
              icon={
                <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
              title="1-Click Apply"
              description="Update prices directly in Shopify. Secure, tested, production-ready."
              gradientFrom="from-blue-600/10"
              gradientTo="to-transparent"
              accentColor="blue"
            />
            
            {/* CARD 3 - Real-Time Insights */}
            <FeatureCard
              icon={
                <svg className="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              title="Real-Time Insights"
              description="Live dashboard with 24/7 monitoring. See what's working instantly."
              gradientFrom="from-cyan-600/10"
              gradientTo="to-transparent"
              accentColor="cyan"
            />
            
          </div>
        </div>
      </section>

      {/* ==================== SOCIAL PROOF SECTION ==================== */}
      <section className="py-32 bg-black">
        <div className="max-w-5xl mx-auto px-6">
          
          <p className="text-center text-xs text-gray-600 uppercase tracking-[0.2em] mb-16 font-medium">
            Trusted by Shopify Merchants
          </p>
          
          <div className="grid grid-cols-3 gap-20">
            {[
              { value: '80+', label: 'ML Factors', gradient: 'from-purple-400 to-blue-500' },
              { value: '85%', label: 'Test Coverage', gradient: 'from-blue-500 to-cyan-400' },
              { value: '24/7', label: 'Monitoring', gradient: 'from-cyan-400 to-purple-400' }
            ].map((stat, i) => (
              <div key={i} className="text-center group cursor-default">
                <div className={`text-7xl font-bold mb-4 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300`}>
                  {stat.value}
                </div>
                <div className="text-[#B4B4B4] text-base font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FINAL CTA SECTION ==================== */}
      <section className="relative py-40 bg-black overflow-hidden">
        
        {/* Radial Glow */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[150px]" />
        </div>
        
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-6xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Ready to get started?
            </span>
          </h2>
          <p className="text-xl text-[#B4B4B4] mb-12 max-w-2xl mx-auto">
            Join the waitlist and be the first to access AI-powered pricing.
          </p>
          
          {/* CTA Form (Same as Hero) */}
          <form onSubmit={handleSubmit} className="relative group inline-block">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition duration-500" />
            <div className="relative flex items-center gap-2 p-1.5 bg-black border border-white/20 rounded-2xl">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                className="w-[300px] px-5 py-3.5 bg-transparent text-white placeholder:text-gray-500 outline-none text-base font-medium"
              />
              <button 
                type="submit"
                disabled={loading}
                className="px-6 py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-xl text-white font-semibold transition-all duration-300 shadow-lg shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Joining...' : 'Join Waitlist →'}
              </button>
            </div>
          </form>
          {error && (
            <p className="text-red-400 text-sm mt-4 text-center">{error}</p>
          )}
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="py-16 bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            
            <img src="/logo.svg" alt="Vlerafy" className="h-6 opacity-40" />
            
            <div className="flex gap-10 text-sm text-gray-600">
              <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
              <a href="/imprint" className="hover:text-white transition-colors">Imprint</a>
              <a href="mailto:contact@vlerafy.com" className="hover:text-white transition-colors">Contact</a>
              <a href="/admin" className="hover:text-gray-400 transition-colors">Admin</a>
            </div>
            
            <div className="text-sm text-gray-600">
              © 2026 Vlerafy · Made with 💜
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Feature Card Component (Linear-Style)
function FeatureCard({
  icon,
  title,
  description,
  gradientFrom,
  gradientTo,
  accentColor,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradientFrom: string;
  gradientTo: string;
  accentColor: 'purple' | 'blue' | 'cyan';
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const accentStyles = {
    purple: {
      glow: 'from-purple-600/10',
      border: 'via-purple-500',
      iconBg: 'bg-purple-500/10',
      iconBgHover: 'group-hover:bg-purple-500/20',
      textHover: 'group-hover:text-purple-400',
    },
    blue: {
      glow: 'from-blue-600/10',
      border: 'via-blue-500',
      iconBg: 'bg-blue-500/10',
      iconBgHover: 'group-hover:bg-blue-500/20',
      textHover: 'group-hover:text-blue-400',
    },
    cyan: {
      glow: 'from-cyan-600/10',
      border: 'via-cyan-500',
      iconBg: 'bg-cyan-500/10',
      iconBgHover: 'group-hover:bg-cyan-500/20',
      textHover: 'group-hover:text-cyan-400',
    },
  };

  const styles = accentStyles[accentColor];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6 }}
      className="group relative"
    >
      {/* Radial Glow Background */}
      <div className={`absolute inset-0 bg-gradient-radial ${styles.glow} ${gradientTo} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl blur-xl`} />
      
      {/* Card */}
      <div className="relative h-full p-8 bg-[#111111]/60 backdrop-blur-xl border border-white/10 rounded-3xl hover:border-white/20 transition-all duration-500 overflow-hidden">
        
        {/* Top Accent Line (Animated) */}
        <div className={`absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent ${styles.border} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
        
        {/* Icon */}
        <div className={`w-14 h-14 ${styles.iconBg} ${styles.iconBgHover} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300`}>
          {icon}
        </div>
        
        {/* Text */}
        <h3 className={`text-2xl font-semibold text-white mb-3 ${styles.textHover} transition-colors`}>
          {title}
        </h3>
        <p className="text-[#B4B4B4] leading-relaxed">
          {description}
        </p>
        
        {/* Bottom Shine Effect */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>
    </motion.div>
  );
}
