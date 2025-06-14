import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, display_name, avatar_url, phone, dob, location, bio")
    .eq("id", user.id)
    .single();

  if (error) {
    return NextResponse.json(
      { error: "Failed to fetch profile", details: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}

export async function PUT(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const { display_name, avatar_url, phone, dob, location, bio } = body;

  const { error } = await supabase
    .from("profiles")
    .update({
      display_name,
      avatar_url,
      phone,
      dob,
      location,
      bio,
    })
    .eq("id", user.id);

  if (error) {
    return NextResponse.json(
      { error: "Failed to update profile", details: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "Profile updated successfully" });
}
