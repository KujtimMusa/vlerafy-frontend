'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Mail } from 'lucide-react';
import { addToWaitlist } from '@/lib/waitlist-api';
import { toast } from 'sonner';
import { GlassButton } from '@/components/ui/glass-button';
import { GlassInput } from '@/components/ui/glass-input';
import { GradientText } from '@/components/ui/gradient-text';

export function WaitlistSection() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Bitte gib eine E-Mail-Adresse ein');
      return;
    }

    if (!validateEmail(email)) {
      setError('Bitte gib eine gültige E-Mail-Adresse ein');
      return;
    }

    setLoading(true);
    try {
      const result = await addToWaitlist(email);
      if (result.success) {
        setSuccess(true);
        setEmail('');
        toast.success('Du bist auf der Waitlist! 🎉');
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setError(result.message || 'Diese E-Mail ist bereits auf der Waitlist.');
        toast.error(result.message || 'Fehler beim Hinzufügen zur Waitlist');
      }
    } catch (err) {
      setError('Fehler beim Hinzufügen zur Waitlist');
      toast.error('Fehler beim Hinzufügen zur Waitlist');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="waitlist" className="py-24 px-4 sm:px-6 lg:px-8 bg-bg-primary">
      <div className="max-w-2xl mx-auto text-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-text-primary mb-4 font-serif">
            Sei einer der{' '}
            <GradientText>Ersten</GradientText>
            .
          </h2>
          <p className="text-xl text-text-secondary font-sans">
            Keine Spam. Nur Updates, wenn wir live gehen. Versprochen.
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass p-6 rounded-xl flex items-center justify-center gap-3 text-success"
            >
              <CheckCircle2 className="w-6 h-6" />
              <span className="font-medium">Du bist auf der Waitlist!</span>
            </motion.div>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <GlassInput
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    placeholder="your@email.com"
                    className="pl-12"
                    error={!!error}
                    disabled={loading}
                  />
                </div>
                <GlassButton
                  type="submit"
                  variant="primary"
                  glow
                  animated
                  disabled={loading}
                  className="w-full sm:w-auto"
                >
                  {loading ? (
                    'Wird hinzugefügt...'
                  ) : (
                    <>
                      Join Waitlist
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </GlassButton>
              </div>
              
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-400 text-left"
                >
                  {error}
                </motion.p>
              )}
            </>
          )}
        </motion.form>
      </div>
    </section>
  );
}
