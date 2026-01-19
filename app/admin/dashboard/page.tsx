'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LogOut, Users, TrendingUp, Calendar, Mail, LayoutDashboard, ArrowRight } from 'lucide-react';
import { WaitlistTable } from '@/components/admin/WaitlistTable';
import { getAdminStats, verifyAdminToken } from '@/lib/waitlist-api';
import { toast } from 'sonner';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total_subscribers: 0,
    subscribers_today: 0,
    subscribers_this_week: 0,
    subscribers_this_month: 0,
  });

  useEffect(() => {
    // Prüfe Token aus localStorage
    const storedToken = localStorage.getItem('admin_token');
    
    if (!storedToken) {
      router.push('/admin/login');
      return;
    }

    // Verifiziere Token
    verifyAdminToken(storedToken)
      .then((result) => {
        if (result.success) {
          setToken(storedToken);
          loadStats(storedToken);
        } else {
          localStorage.removeItem('admin_token');
          router.push('/admin/login');
        }
      })
      .catch(() => {
        localStorage.removeItem('admin_token');
        router.push('/admin/login');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router]);

  const loadStats = async (adminToken: string) => {
    try {
      const data = await getAdminStats(adminToken);
      setStats(data);
    } catch (error) {
      console.error('Fehler beim Laden der Statistiken:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.push('/admin/login');
    toast.success('Erfolgreich abgemeldet');
  };

  const handleGoToMainDashboard = () => {
    // Navigate to main dashboard (default locale: de)
    router.push('/de');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-gray-400">Lade Dashboard...</div>
      </div>
    );
  }

  if (!token) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="bg-[#111111] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <div className="flex items-center gap-3">
              {/* Link to Main Dashboard */}
              <button
                onClick={handleGoToMainDashboard}
                className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 border border-indigo-500/50 rounded-xl text-white hover:from-indigo-600 hover:to-purple-600 transition-all flex items-center gap-2 font-medium"
              >
                <LayoutDashboard className="w-4 h-4" />
                Main Dashboard
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-[#0a0a0a] border border-gray-800 rounded-xl text-gray-300 hover:text-white hover:border-red-500/50 transition-all flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Abmelden
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              icon: Users,
              label: 'Gesamt',
              value: stats.total_subscribers,
              color: 'from-purple-500 to-pink-500',
            },
            {
              icon: Calendar,
              label: 'Heute',
              value: stats.subscribers_today,
              color: 'from-blue-500 to-cyan-500',
            },
            {
              icon: TrendingUp,
              label: 'Diese Woche',
              value: stats.subscribers_this_week,
              color: 'from-green-500 to-emerald-500',
            },
            {
              icon: Mail,
              label: 'Dieser Monat',
              value: stats.subscribers_this_month,
              color: 'from-orange-500 to-red-500',
            },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="p-6 bg-[#111111] border border-gray-800 rounded-xl"
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.color} mb-4`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>

        {/* Waitlist Table */}
        <WaitlistTable token={token} />
      </main>
    </div>
  );
}
