export default function JournalEntrySidebar({
    tags,
    onTagsChange,
    date,
    onDateChange,
  }: {
    tags: string;
    onTagsChange: (val: string) => void;
    date: string;
    onDateChange: (val: string) => void;
  }) {
    return (
      <aside className="bg-white p-4 border rounded-lg shadow-sm space-y-4 w-full md:w-[300px]">
        <h2 className="font-semibold text-lg">Entry Details</h2>
        <div>
          <label className="text-sm font-medium text-gray-600">Tags</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => onTagsChange(e.target.value)}
            placeholder="Meditation, Peace, Mindfulness"
            className="mt-1 w-full border px-3 py-2 rounded-md text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            className="mt-1 w-full border px-3 py-2 rounded-md text-sm"
          />
        </div>
      </aside>
    );
  }
  