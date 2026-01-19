'use client';

import { useState } from 'react';
import { addToWaitlist } from '@/lib/waitlist-api';
import { toast } from 'sonner';

export function PremiumFinalCTASection() {
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
    <section className="py-32 bg-black">
      <div className="max-w-3xl mx-auto px-4 text-center">
        
        {/* Headline */}
        <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
          Ready to Price Smarter?
        </h2>
        
        <p className="text-xl text-zinc-400 mb-12">
          Join the waitlist and be the first to access AI-powered pricing.
        </p>
        
        {/* Form (Same as Hero) */}
        <div className="relative group max-w-xl mx-auto">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 rounded-2xl blur-xl opacity-40 group-hover:opacity-60 animate-pulse-slow transition duration-500" />
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
      </div>
      
      {/* Footer */}
      <footer className="mt-24 pt-12 border-t border-zinc-900">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          
          {/* Logo */}
          <img 
            src="/logo.svg" 
            alt="Vlerafy" 
            className="h-6 w-auto opacity-80 hover:opacity-100 transition"
          />
          
          {/* Links */}
          <div className="flex gap-8 text-sm text-zinc-500">
            <a href="/privacy" className="hover:text-zinc-300 transition">Privacy</a>
            <a href="/imprint" className="hover:text-zinc-300 transition">Imprint</a>
            <a href="mailto:contact@vlerafy.com" className="hover:text-zinc-300 transition">Contact</a>
            <a href="/admin/login" className="hover:text-zinc-300 transition">Admin</a>
          </div>
          
          {/* Copyright */}
          <div className="text-sm text-zinc-600">
            © 2026 Vlerafy. Made with 💜 for Shopify Merchants
          </div>
        </div>
      </footer>
    </section>
  );
}
