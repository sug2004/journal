import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
  
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  
    const body = await req.json();
    const { title, content, tags, date, media_base64 } = body;
  
    const { error } = await supabase
      .from('journal_entries')
      .update({ title, content, tags, date, media_base64 })
      .eq('id', params.id)
      .eq('user_id', user.id);
  
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  
    return NextResponse.json({ message: 'Entry updated successfully' });
  }
  