

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

  const [countRes, last30Res, recentRes] = await Promise.all([
    supabase
      .from("journal_entries")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id),

    supabase
      .from("journal_entries")
      .select("date")
      .eq("user_id", user.id)
      .gte("date", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]),

    supabase
      .from("journal_entries")
      .select("id, title, content, date, media_base64")
      .eq("user_id", user.id)
      .order("date", { ascending: false })
      .limit(3),
  ]);

  const count = countRes.count ?? 0;
  const last30 = last30Res.data ?? [];
  const recentEntries = recentRes.data ?? [];

  if (last30Res.error || recentRes.error || countRes.error) {
    return NextResponse.json(
      { error: last30Res.error?.message || recentRes.error?.message || countRes.error?.message },
      { status: 500 }
    );
  }

  const response = NextResponse.json({
    totalEntries: count,
    streak: last30.length,
    recentEntries,
  });

  response.headers.set('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
  return response;
}
