"use server";
import{revalidatePath}from"next/cache";import{createSupabaseServerClient}from"@/infrastructure/supabase/server";
export async function renameBuild(formData:FormData){const id=String(formData.get("buildId")??"");const title=String(formData.get("title")??"").trim();const locale=formData.get("locale")==="uk"?"uk":"en";if(!id||title.length<2||title.length>120)return;const supabase=await createSupabaseServerClient();const{data:{user}}=await supabase.auth.getUser();if(!user)return;await supabase.from("builds").update({title}).eq("id",id).eq("owner_id",user.id);revalidatePath(`/${locale}/builds`);revalidatePath(`/${locale}/builds/${id}`)}
export async function publishBuildToForum(formData:FormData){const id=String(formData.get("buildId")??"");const locale=formData.get("locale")==="uk"?"uk":"en";const categoryId=String(formData.get("categoryId")??"");const publishTitle=String(formData.get("publishTitle")??"").trim().slice(0,120);const comment=String(formData.get("comment")??"").trim().slice(0,3000);if(!id||!categoryId||publishTitle.length<2)return;const supabase=await createSupabaseServerClient();const{data:{user}}=await supabase.auth.getUser();if(!user?.email_confirmed_at)return;const[{data:build},{data:category}]=await Promise.all([supabase.from("builds").select("id,title,budget_minor,currency,components,published_topic_id").eq("id",id).eq("owner_id",user.id).maybeSingle(),supabase.from("forum_categories").select("id").eq("id",categoryId).eq("language",locale).maybeSingle()]);if(!build||build.published_topic_id||!category)return;const{data:topic}=await supabase.from("forum_topics").insert({category_id:category.id,author_id:user.id,title:publishTitle,language:locale}).select("id").single();if(!topic)return;const parts=(build.components as Array<{role:string;model:string}>).map(part=>`• ${part.role}: ${part.model}`).join("\n");const price=new Intl.NumberFormat(locale,{style:"currency",currency:build.currency,maximumFractionDigits:0}).format(build.budget_minor/100);const intro=comment||(locale==="uk"?`Публікую свою збірку на бюджет ${price}.`:`Sharing my ${price} build.`);await supabase.from("forum_posts").insert({topic_id:topic.id,author_id:user.id,body:`${intro}\n\n${parts}\n\n/${locale}/builds/${id}`});await supabase.from("builds").update({title:publishTitle,published_topic_id:topic.id,visibility:"public"}).eq("id",id);revalidatePath(`/${locale}/builds`);revalidatePath(`/${locale}/builds/${id}`);revalidatePath(`/${locale}/community`);revalidatePath(`/${locale}/community/category/${category.id}`)}

export async function deleteBuilds(formData:FormData){
  const locale=formData.get("locale")==="uk"?"uk":"en";
  const ids=formData.getAll("buildIds").map(String).filter(Boolean).slice(0,100);
  if(!ids.length)return;
  const supabase=await createSupabaseServerClient();
  const{data:{user}}=await supabase.auth.getUser();
  if(!user)return;
  await supabase.from("builds").delete().eq("owner_id",user.id).in("id",ids);
  revalidatePath(`/${locale}/builds`);
  revalidatePath(`/${locale}/saved`);
}
