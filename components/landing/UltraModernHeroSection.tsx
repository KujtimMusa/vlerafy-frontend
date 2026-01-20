'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { addToWaitlist } from '@/lib/waitlist-api';
import { toast } from 'sonner';

export function UltraModernHeroSection() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Cursor Glow Effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const glow = document.getElementById('cursor-glow');
      if (glow) {
        glow.style.setProperty('--mouse-x', `${e.clientX - 300}px`);
        glow.style.setProperty('--mouse-y', `${e.clientY - 300}px`);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !validateEmail(email)) {
      setError('Please enter a valid email address');
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const result = await addToWaitlist(email);
      if (result.success) {
        setSuccess(true);
        setEmail('');
        toast.success('You are on the waitlist! 🎉');
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setError(result.message || 'Error adding to waitlist');
        toast.error(result.message || 'Error adding to waitlist');
      }
    } catch (error) {
      setError('Error adding to waitlist');
      toast.error('Error adding to waitlist');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0f]">
      
      {/* ANIMATED GRADIENT MESH BACKGROUND */}
      <div className="absolute inset-0">
        {/* Mesh Blob 1 */}
        <motion.div
          className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/30 rounded-full blur-[120px]"
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -50, 20, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        {/* Mesh Blob 2 */}
        <motion.div
          className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-[120px]"
          animate={{
            x: [0, -30, 20, 0],
            y: [0, 50, -20, 0],
            scale: [1, 0.9, 1.1, 1],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        {/* Mesh Blob 3 */}
        <motion.div
          className="absolute bottom-0 left-1/3 w-[550px] h-[550px] bg-cyan-500/20 rounded-full blur-[120px]"
          animate={{
            x: [0, 20, -30, 0],
            y: [0, -20, 50, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0f]/50 to-[#0a0a0f]" />
      </div>
      
      {/* CURSOR GLOW EFFECT */}
      <div 
        id="cursor-glow" 
        className="pointer-events-none fixed w-[600px] h-[600px] rounded-full bg-blue-500/10 blur-3xl transition-transform duration-300"
        style={{ 
          transform: 'translate(var(--mouse-x, 0px), var(--mouse-y, 0px))',
          left: '50%',
          top: '50%',
          marginLeft: '-300px',
          marginTop: '-300px'
        }}
      />
      
      {/* FLOATING NAVIGATION */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-8 px-6 py-3 rounded-full bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 shadow-2xl"
        >
          <img src="/logo.svg" alt="Vlerafy" className="h-6 w-auto" />
          <a href="#features" className="text-sm text-zinc-400 hover:text-white transition">Features</a>
          <a href="#pricing" className="text-sm text-zinc-400 hover:text-white transition">Pricing</a>
          <a href="/admin/login" className="text-xs text-zinc-600 hover:text-zinc-400 transition">Admin</a>
        </motion.div>
      </nav>
      
      {/* HERO CONTENT */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        
        {/* Badge (Animated) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/80 backdrop-blur border border-zinc-800/50 mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <span className="text-sm text-zinc-300">AI-Powered Pricing for Shopify</span>
        </motion.div>
        
        {/* Headline (MASSIVE, BOLD) */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-7xl md:text-8xl lg:text-9xl font-black mb-6 leading-[0.9] tracking-tighter"
        >
          <span className="block bg-gradient-to-r from-white via-white to-zinc-500 bg-clip-text text-transparent">
            Price Smarter.
          </span>
          <span className="block mt-2 bg-gradient-to-r from-blue-400 via-blue-500 to-purple-500 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
            Earn More.
          </span>
        </motion.h1>
        
        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-xl md:text-2xl text-zinc-400 mb-12 max-w-2xl mx-auto font-light"
        >
          The first Shopify app that optimizes your prices with Machine Learning. 
          Automatic, data-driven, profitable.
        </motion.p>
        
        {/* CTA (Glowing, 3D) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="relative group max-w-xl mx-auto"
        >
          {/* 3D Shadow/Glow */}
          <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition duration-500 animate-pulse-slow" />
          
          {/* Form Container */}
          {success ? (
            <div className="relative flex items-center justify-center p-6 bg-zinc-900/90 backdrop-blur-xl rounded-3xl border border-zinc-800/50 shadow-2xl">
              <div className="text-green-400 font-medium">✓ You're on the waitlist!</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="relative flex flex-col sm:flex-row gap-3 p-2 bg-zinc-900/90 backdrop-blur-xl rounded-3xl border border-zinc-800/50 shadow-2xl">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                className="flex-1 px-6 py-5 bg-transparent text-white placeholder:text-zinc-500 outline-none text-lg focus:ring-2 focus:ring-blue-500/50 rounded-2xl transition"
                disabled={loading}
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="group/btn relative px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_60px_rgba(59,130,246,0.4)]"
              >
                <span className="relative z-10">{loading ? 'Joining...' : 'Join Waitlist →'}</span>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover/btn:opacity-20 blur transition" />
              </button>
            </form>
          )}
          {error && <p className="text-red-400 text-sm mt-2 text-left px-4">{error}</p>}
        </motion.div>
        
        {/* Trust Line */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-sm text-zinc-600 mt-6 font-light"
        >
          No spam. Only updates when we go live. Promise. 💜
        </motion.p>
      </div>
      
      {/* SCROLL INDICATOR (Animated) */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2, repeat: Infinity, repeatType: "reverse" }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-zinc-600 uppercase tracking-wider">Scroll</span>
          <svg className="w-6 h-6 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </motion.div>
      
    </section>
  );
}
