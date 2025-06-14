  
interface StatsCardsProps {
  totalEntries: number;
  streak: number;
}

export default function StatsCards({ totalEntries, streak }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
      <div className="bg-white p-4 shadow rounded">
        <h2 className="text-sm text-gray-500">Total Entries</h2>
        <p className="text-2xl font-semibold">{totalEntries}</p>
        <p className="text-sm text-gray-400">All time entries written</p>
      </div>
      <div className="bg-white p-4 shadow rounded">
        <h2 className="text-sm text-gray-500">Last 30 Day Streak</h2>
        <p className="text-2xl font-semibold">{streak} Days</p>
        <p className="text-sm text-gray-400">Consecutive journaling days</p>
      </div>
      <div className="bg-white p-4 shadow rounded">
        <h3 className="font-semibold text-lg mb-3">Quick Actions</h3>
        <a href="/journal/new" className="btn w-full bg-indigo-600 text-white mb-2 text-center block">
          + Create New Entry
        </a>
        <a href="/profile" className="btn w-full border text-center block">Edit Your Profile</a>
        <p className="text-xs text-gray-500 mt-4">
          Need inspiration? Write about your aspirations for the next month.
        </p>
      </div>
    </div>
  );
}
