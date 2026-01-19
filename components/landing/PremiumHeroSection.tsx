'use client';

import { useState } from 'react';
import { addToWaitlist } from '@/lib/waitlist-api';
import { toast } from 'sonner';

export function PremiumHeroSection() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const result = await addToWaitlist(email);
      if (result.success) {
        setSuccess(true);
        setEmail('');
        toast.success('You are on the waitlist! 🎉');
        setTimeout(() => setSuccess(false), 5000);
      } else {
        toast.error(result.message || 'Error adding to waitlist');
      }
    } catch (error) {
      toast.error('Error adding to waitlist');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(30,64,175,0.1),transparent_50%)]" />
      <div className="absolute inset-0 opacity-30">
        <div 
          className="absolute inset-0 animate-grid"
          style={{
            backgroundImage: `linear-gradient(rgba(59,130,246,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(59,130,246,0.1) 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
          }}
        />
      </div>
      
      {/* Navigation */}
      <nav className="absolute top-0 w-full p-6 flex justify-between items-center z-20">
        <div className="flex items-center gap-3">
          <img 
            src="/logo.svg" 
            alt="Vlerafy Logo" 
            className="h-8 w-auto hover:scale-105 transition-transform duration-300"
          />
        </div>
        <a href="/admin/login" className="text-xs text-zinc-500 hover:text-zinc-300 transition">
          Admin
        </a>
      </nav>
      
      {/* Hero Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 mb-8 animate-fade-in-up">
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          <span className="text-sm text-zinc-400">AI-Powered Pricing for Shopify</span>
        </div>
        
        {/* Headline */}
        <h1 className="text-7xl md:text-9xl font-black mb-6 leading-none tracking-tight animate-fade-in-up drop-shadow-[0_0_50px_rgba(59,130,246,0.3)]">
          <span className="inline-block bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
            Price Smarter.
          </span>
          <br />
          <span className="text-white">Earn More.</span>
        </h1>
        
        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-zinc-400 mb-12 max-w-2xl mx-auto animate-fade-in-up drop-shadow-[0_0_30px_rgba(0,0,0,0.8)]">
          The first Shopify app that optimizes your prices with Machine Learning.
        </p>
        
        {/* Waitlist Form (GLOWING) */}
        <div className="relative group max-w-xl mx-auto animate-fade-in-up">
          {/* Glow Effect - PULSATING */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 rounded-2xl blur-xl opacity-40 group-hover:opacity-60 animate-pulse-slow transition duration-500" />
          
          {/* Form Container */}
          {success ? (
            <div className="relative flex items-center justify-center p-6 bg-zinc-900 rounded-2xl border-2 border-zinc-800">
              <div className="text-green-400 font-medium">✓ You're on the waitlist!</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="relative flex gap-3 p-2 bg-zinc-900 rounded-2xl border-2 border-zinc-800 group-hover:border-blue-500/50 transition-all duration-300 shadow-[0_0_100px_rgba(0,0,0,0.8)]">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-6 py-5 bg-transparent text-white placeholder:text-zinc-500 outline-none text-lg focus:placeholder:text-zinc-400 transition"
                disabled={loading}
                required
              />
              <button 
                type="submit"
                disabled={loading}
                className="px-10 py-5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_40px_rgba(59,130,246,0.4)]"
              >
                {loading ? 'Joining...' : 'Join Waitlist →'}
              </button>
            </form>
          )}
        </div>
        
        {/* Trust Line */}
        <p className="text-sm text-zinc-500 mt-6 animate-fade-in-up">
          No spam. Only updates when we go live.
        </p>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
