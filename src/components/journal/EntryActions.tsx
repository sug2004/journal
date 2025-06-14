export default function EntryActions({
    onSave,
    onDelete,
    saving,
  }: {
    onSave: () => void;
    onDelete: () => void;
    saving: boolean;
  }) {
    return (
      <div className="flex justify-end gap-3 mt-4">
        <button
          onClick={onDelete}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
        >
          Delete Entry
        </button>
        <button
          onClick={onSave}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Entry"}
        </button>
      </div>
    );
  }
  