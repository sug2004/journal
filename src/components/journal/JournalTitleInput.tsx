export default function JournalTitleInput({ title, onChange }: { title: string; onChange: (val: string) => void }) {
    return (
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 text-lg font-semibold border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    );
  }
  