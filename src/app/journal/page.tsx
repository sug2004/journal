
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import JournalCard from "@/components/journal/JournalCard";

export default async function JournalListPage() {
  const supabase = await createClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) redirect("/auth");

  // Parallel-safe, minimal column fetch
  const { data: entries, error: entriesError } = await supabase
    .from("journal_entries")
    .select("id, title, content, date, media_base64")
    .eq("user_id", user.id)
    .order("date", { ascending: false });

  if (entriesError) {
    console.error("Error fetching journal entries:", entriesError.message);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Your Journal</h1>
        <Link
          href="/journal/new"
          className="btn bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md shadow-sm"
        >
          + New Journal Entry
        </Link>
      </div>

      {entries && entries.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {entries.map((entry) => (
            <JournalCard
              key={entry.id}
              id={entry.id}
              title={entry.title}
              content={entry.content}
              date={entry.date}
              media_base64={entry.media_base64}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-600 mt-10">You haven’t written any journal entries yet.</p>
      )}
    </div>
  );
}
