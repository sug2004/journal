import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(req: NextRequest) {
  const supabase = await createClient();

  // ✅ Get authenticated user
  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser();

  if (authErr || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = user.id;
  const date30DaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  // ✅ Run all queries in parallel
  const [countRes, last30Res, recentRes] = await Promise.all([
    supabase
      .from("journal_entries")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId),

    supabase
      .from("journal_entries")
      .select("id") // You only need `id` to count streak
      .eq("user_id", userId)
      .gte("date", date30DaysAgo),

    supabase
      .from("journal_entries")
      .select("id, title, content, date, media_base64")
      .eq("user_id", userId)
      .order("date", { ascending: false })
      .limit(3),
  ]);

  // ✅ Handle errors
  const error =
    countRes.error?.message ||
    last30Res.error?.message ||
    recentRes.error?.message;

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  const response = NextResponse.json({
    totalEntries: countRes.count ?? 0,
    streak: last30Res.data?.length ?? 0,
    recentEntries: recentRes.data ?? [],
  });

  // ✅ Optional: ISR cache headers
  response.headers.set("Cache-Control", "s-maxage=60, stale-while-revalidate=300");

  return response;
}
