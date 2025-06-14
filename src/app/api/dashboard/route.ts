
// import { NextRequest, NextResponse } from 'next/server';
// import { createClient } from '@/utils/supabase/server';

// export async function GET(req: NextRequest) {
//   const supabase = await createClient();
//   const {
//     data: { user },
//     error: userError,
//   } = await supabase.auth.getUser();

//   if (userError || !user) {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//   }

//   // Get total entries
//   const { count: totalCount } = await supabase
//     .from('journal_entries')
//     .select('*', { count: 'exact', head: true })
//     .eq('user_id', user.id);

//   // Get entries in the last 30 days
//   const date30DaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
//     .toISOString()
//     .split('T')[0];

//   const { data: last30Data, error: streakErr } = await supabase
//     .from('journal_entries')
//     .select('id')
//     .eq('user_id', user.id)
//     .gte('date', date30DaysAgo);

//   // Get 3 most recent entries
//   const { data: recentEntries, error: recentErr } = await supabase
//     .from('journal_entries')
//     .select('id, title, date, content, media_base64')
//     .eq('user_id', user.id)
//     .order('date', { ascending: false })
//     .limit(3);

//   if (streakErr || recentErr) {
//     return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
//   }

//   return NextResponse.json({
//     totalEntries: totalCount ?? 0,
//     streak: last30Data?.length ?? 0,
//     recentEntries: recentEntries ?? [],
//   });
// }


import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser();

  if (authErr || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { count } = await supabase
    .from("journal_entries")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  const { data: last30, error: last30Err } = await supabase
    .from("journal_entries")
    .select("date")
    .eq("user_id", user.id)
    .gte("date", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]);

  const { data: recentEntries, error: recentError } = await supabase
    .from("journal_entries")
    .select("id, title, content, date, media_base64")
    .eq("user_id", user.id)
    .order("date", { ascending: false })
    .limit(3);

  if (last30Err || recentError) {
    return NextResponse.json(
      { error: last30Err?.message || recentError?.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    totalEntries: count,
    streak: last30.length,
    recentEntries,
  });
}
