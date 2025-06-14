
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function EditJournalEntry() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const supabase = createClient();

  const [entry, setEntry] = useState({
    title: '',
    content: '',
    tags: '',
    date: '',
    media_base64: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEntry = async () => {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        setError('Unauthorized');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error || !data) {
        setError('Entry not found or access denied.');
      } else {
        setEntry({
          title: data.title || '',
          content: data.content || '',
          tags: data.tags || '',
          date: data.date ? data.date.split('T')[0] : '',
          media_base64: data.media_base64 || '',
        });
      }

      setLoading(false);
    };

    if (id) fetchEntry();
  }, [id, supabase]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEntry((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setEntry((prev) => ({ ...prev, media_base64: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const res = await fetch(`/api/journal/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    });

    const result = await res.json();
    if (!res.ok) {
      setError(result.error || 'Update failed');
    } else {
      router.push(`/journal/${id}`);
    }

    setSaving(false);
  };

  if (loading) return <div className="p-4 text-gray-600">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-4 space-y-6">
      <h2 className="text-2xl font-bold">Edit Journal Entry</h2>

      <input
        type="text"
        name="title"
        value={entry.title}
        onChange={handleChange}
        placeholder="Title"
        required
        className="w-full px-4 py-2 border rounded-md"
      />

      <textarea
        name="content"
        value={entry.content}
        onChange={handleChange}
        rows={8}
        placeholder="Write your thoughts..."
        className="w-full px-4 py-2 border rounded-md"
      />

      <input
        type="text"
        name="tags"
        value={entry.tags}
        onChange={handleChange}
        placeholder="Tags (comma separated)"
        className="w-full px-4 py-2 border rounded-md"
      />

      <input
        type="date"
        name="date"
        value={entry.date}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded-md"
      />

      {entry.media_base64 && (
        <img
          src={entry.media_base64}
          alt="Uploaded preview"
          className="max-h-64 w-full object-cover rounded-md"
        />
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="block w-full text-sm text-gray-500"
      />

      <div className="flex justify-between items-center">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          {saving ? 'Saving...' : 'Update Entry'}
        </button>

        <button
          type="button"
          onClick={() => router.push(`/journal/${id}`)}
          className="text-gray-500 hover:underline"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
