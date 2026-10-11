"use server";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/infrastructure/supabase/server";
export async function rateBuild(formData: FormData) {
  const buildId = String(formData.get("buildId") ?? "");
  const topicId = String(formData.get("topicId") ?? "");
  const locale = formData.get("locale") === "uk" ? "uk" : "en";
  const rating = Number(formData.get("rating"));
  if (!buildId || !topicId || !Number.isInteger(rating) || rating < 1 || rating > 5) return;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  const { data: build } = await supabase
    .from("builds")
    .select("id")
    .eq("id", buildId)
    .eq("published_topic_id", topicId)
    .maybeSingle();
  if (!build) return;
  await supabase
    .from("build_ratings")
    .upsert({ build_id: buildId, user_id: user.id, rating }, { onConflict: "build_id,user_id" });
  revalidatePath(`/${locale}/community/topic/${topicId}`);
  revalidatePath(`/${locale}/dashboard`);
}
