'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function JournalEntryPage() {
  const { id } = useParams();
  const router = useRouter();
  const supabase = createClient();

  const [entry, setEntry] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const fetchEntry = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('id', id)
        .single();

      if (data) {
        setEntry(data);
        setIsOwner(data.user_id === user?.id);
      }

      setLoading(false);
    };

    fetchEntry();
  }, [id]);

  const handleDelete = async () => {
    const confirm = window.confirm('Are you sure you want to delete this journal entry?');
    if (!confirm) return;

    const { error } = await supabase.from('journal_entries').delete().eq('id', id);
    if (!error) {
      router.push('/journal');
    } else {
      alert('Failed to delete entry');
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (!entry) return <div className="p-4 text-red-500">Journal entry not found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">{entry.title}</h1>
      <p className="text-gray-500 text-sm">{new Date(entry.date).toLocaleDateString()}</p>
      {entry.tags && (
        <p className="text-sm text-blue-600">#{entry.tags?.split(',').join(' #')}</p>
      )}
      {entry.media_base64 && (
        <img src={entry.media_base64} alt="Journal visual" className="rounded-md max-h-96 w-full object-cover" />
      )}
      <div className="whitespace-pre-wrap text-gray-800">{entry.content}</div>

      {isOwner && (
        <div className="flex gap-4 mt-4">
          <button
            onClick={() => router.push(`/journal/${id}/edit`)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-md"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
