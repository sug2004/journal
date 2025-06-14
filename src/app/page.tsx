
// 'use client';

// import { useEffect, useState } from 'react';
// import DashboardHeader from '@/components/dashboard/DashboardHeader';
// import StatsCards from '@/components/dashboard/StatsCards';
// import RecentEntries from '@/components/dashboard/RecentEntries';

// interface DashboardData {
//   totalEntries: number;
//   streak: number;
//   recentEntries: any[];
// }

// export default function DashboardPage() {
//   const [data, setData] = useState<DashboardData | null>(null);

//   useEffect(() => {
//     fetch('/api/dashboard')
//       .then((res) => res.json())
//       .then(setData);
//   }, []);

//   return (
//     <div className="p-6 max-w-7xl mx-auto">
//       <DashboardHeader />
//       {data && <StatsCards totalEntries={data.totalEntries} streak={data.streak} />}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
//         <div className="lg:col-span-2">
//           {data && <RecentEntries entries={data.recentEntries} />}
//         </div>
//       </div>
//     </div>
//   );
// }


'use client';

import { useEffect, useState } from 'react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatsCards from '@/components/dashboard/StatsCards';
import RecentEntries from '@/components/dashboard/RecentEntries';

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/dashboard')
      .then((res) => res.json())
      .then((res) => {
        if (!res.error) setData(res);
        else console.error(res.error);
      });
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <DashboardHeader />
      {data && <StatsCards totalEntries={data.totalEntries} streak={data.streak} />}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          {data?.recentEntries && <RecentEntries entries={data.recentEntries} />}
        </div>
      </div>
    </div>
  );
}
