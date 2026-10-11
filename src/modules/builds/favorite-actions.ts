"use server";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/infrastructure/supabase/server";

export async function toggleBuildFavorite(formData: FormData) {
  const buildId=String(formData.get("buildId")??""); const locale=formData.get("locale")==="uk"?"uk":"en"; const supabase=await createSupabaseServerClient(); const {data:{user}}=await supabase.auth.getUser(); if(!user||!buildId)return;
  const {data}=await supabase.from("build_favorites").select("build_id").eq("user_id",user.id).eq("build_id",buildId).maybeSingle(); if(data) await supabase.from("build_favorites").delete().eq("user_id",user.id).eq("build_id",buildId); else await supabase.from("build_favorites").insert({user_id:user.id,build_id:buildId}); revalidatePath(`/${locale}/builds`); revalidatePath(`/${locale}/saved`);revalidatePath(`/${locale}/dashboard`);
}
export async function toggleComponentFavorite(formData: FormData) {
  const buildId=String(formData.get("buildId")??""); const key=String(formData.get("componentKey")??""); const snapshot=String(formData.get("snapshot")??""); const locale=formData.get("locale")==="uk"?"uk":"en"; const supabase=await createSupabaseServerClient(); const {data:{user}}=await supabase.auth.getUser(); if(!user||!buildId||!key)return;
  const {data}=await supabase.from("component_favorites").select("id").eq("user_id",user.id).eq("build_id",buildId).eq("component_key",key).maybeSingle(); if(data) await supabase.from("component_favorites").delete().eq("id",data.id); else { try { await supabase.from("component_favorites").insert({user_id:user.id,build_id:buildId,component_key:key,component_snapshot:JSON.parse(snapshot)}); } catch{return;} } revalidatePath(`/${locale}/builds/${buildId}`); revalidatePath(`/${locale}/saved`);
}
