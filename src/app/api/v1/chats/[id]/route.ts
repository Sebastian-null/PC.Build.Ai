import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/infrastructure/supabase/server";
const schema = z.object({ title: z.string().trim().min(2).max(120) });
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_title" }, { status: 400 });
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { data, error } = await supabase
    .from("chat_sessions")
    .update({ title: parsed.data.title })
    .eq("id", id)
    .eq("owner_id", user.id)
    .select("id,title")
    .maybeSingle();
  if (error || !data) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json(data);
}
