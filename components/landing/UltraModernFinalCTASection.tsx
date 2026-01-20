'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { addToWaitlist } from '@/lib/waitlist-api';
import { toast } from 'sonner';

export function UltraModernFinalCTASection() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

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

  const currentYear = new Date().getFullYear();

  return (
    <>
      {/* Final CTA Section */}
      <section className="relative py-32 bg-[#0a0a0f] overflow-hidden">
        
        {/* Background Glow */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/20 rounded-full blur-[150px]"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent"
          >
            Ready to Price Smarter?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-zinc-400 mb-12 max-w-2xl mx-auto font-light"
          >
            Join the waitlist and be the first to access AI-powered pricing.
          </motion.p>
          
          {/* CTA Form (Same as Hero) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative group max-w-xl mx-auto"
          >
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition duration-500 animate-pulse-slow" />
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
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 bg-[#0a0a0f] border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <img src="/logo.svg" alt="Vlerafy" className="h-6 w-auto opacity-60 hover:opacity-100 transition" />
            <div className="flex gap-8 text-sm text-zinc-500">
              <a href="/privacy" className="hover:text-zinc-300 transition">Privacy</a>
              <a href="/imprint" className="hover:text-zinc-300 transition">Imprint</a>
              <a href="mailto:contact@vlerafy.com" className="hover:text-zinc-300 transition">Contact</a>
              <a href="/admin/login" className="hover:text-zinc-400 transition">Admin</a>
            </div>
            <div className="text-sm text-zinc-600">
              © {currentYear} Vlerafy · Made with 💜 for Shopify Merchants
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
