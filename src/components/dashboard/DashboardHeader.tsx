'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function DashboardHeader() {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/auth');
  };

  return (
    <div className="flex justify-between items-start flex-wrap gap-4">
      <div>
        <h1 className="text-2xl font-bold">Welcome back, Journaler!</h1>
        <p className="text-gray-600 mt-1">
          Dive into your thoughts and track your progress. Here's a quick overview of your journaling journey.
        </p>
      </div>
    </div>
  );
}
