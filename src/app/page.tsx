
'use client';

import { useEffect, useState } from 'react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatsCards from '@/components/dashboard/StatsCards';
import RecentEntries from '@/components/dashboard/RecentEntries';

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch('/api/dashboard', { cache: 'no-store' });
      const json = await res.json();
      if (!json.error) {
        setData(json);
      } else {
        console.error(json.error);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
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
