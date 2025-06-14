export default function JournalBodyEditor({ body, onChange }: { body: string; onChange: (val: string) => void }) {
    return (
      <textarea
        value={body}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Write your thoughts here..."
        rows={12}
        className="w-full mt-4 px-4 py-3 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    );
  }
  