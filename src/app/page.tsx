'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatsCards from '@/components/dashboard/StatsCards';
import RecentEntries from '@/components/dashboard/RecentEntries';

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchDashboardData = async () => {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error('Unauthorized');
      }

      const date30DaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];

      const [countRes, last30Res, recentRes] = await Promise.all([
        supabase
          .from('journal_entries')
          .select('id', { count: 'exact', head: true }),

        supabase
          .from('journal_entries')
          .select('id')
          .gte('date', date30DaysAgo),

        supabase
          .from('journal_entries')
          .select('id, title, content, date, media_base64')
          .order('date', { ascending: false })
          .limit(3),
      ]);

      const error =
        countRes.error?.message || last30Res.error?.message || recentRes.error?.message;

      if (error) throw new Error(error);

      setData({
        totalEntries: countRes.count ?? 0,
        streak: last30Res.data?.length ?? 0,
        recentEntries: recentRes.data ?? [],
      });
    } catch (error) {
      console.error('Dashboard load failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <DashboardHeader />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-pulse">
          <div className="bg-gray-200 h-24 rounded"></div>
          <div className="bg-gray-200 h-24 rounded"></div>
          <div className="bg-gray-200 h-24 rounded"></div>
        </div>
      ) : (
        <StatsCards totalEntries={data?.totalEntries} streak={data?.streak} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-200 h-40 rounded" />
              ))}
            </div>
          ) : (
            <RecentEntries entries={data?.recentEntries || []} />
          )}
        </div>
      </div>
    </div>
  );
}
