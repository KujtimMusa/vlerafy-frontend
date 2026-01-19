'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Calendar, Download, RefreshCw } from 'lucide-react';
import { getWaitlistSubscribers, WaitlistSubscriber } from '@/lib/waitlist-api';
import { toast } from 'sonner';

interface WaitlistTableProps {
  token: string;
}

export function WaitlistTable({ token }: WaitlistTableProps) {
  const [subscribers, setSubscribers] = useState<WaitlistSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const loadSubscribers = async () => {
    setLoading(true);
    try {
      const data = await getWaitlistSubscribers(token);
      setSubscribers(data.subscribers);
      setTotal(data.total);
    } catch (error) {
      toast.error('Fehler beim Laden der Waitlist');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubscribers();
  }, [token]);

  const exportToCSV = () => {
    const headers = ['ID', 'E-Mail', 'Anmeldedatum', 'Source'];
    const rows = subscribers.map(s => [
      s.id.toString(),
      s.email,
      new Date(s.created_at).toLocaleString('de-DE'),
      s.source || 'N/A'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `waitlist_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('CSV exportiert!');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('de-DE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-400">Lade Waitlist...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Waitlist Subscribers</h2>
          <p className="text-gray-400">{total} E-Mail-Adressen insgesamt</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={loadSubscribers}
            className="px-4 py-2 bg-[#111111] border border-gray-800 rounded-xl text-gray-300 hover:text-white hover:border-purple-500/50 transition-all flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Aktualisieren
          </button>
          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            CSV Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#111111] border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#0a0a0a] border-b border-gray-800">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">E-Mail</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Anmeldedatum</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {subscribers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                    Noch keine Subscriber auf der Waitlist
                  </td>
                </tr>
              ) : (
                subscribers.map((subscriber, index) => (
                  <motion.tr
                    key={subscriber.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-[#0a0a0a] transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-400">{subscriber.id}</td>
                    <td className="px-6 py-4 text-sm text-white flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      {subscriber.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      {formatDate(subscriber.created_at)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-lg text-xs font-medium">
                        {subscriber.source || 'N/A'}
                      </span>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
