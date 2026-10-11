"use server";
import type { Route } from "next";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers, cookies } from "next/headers";
import { createSupabaseServerClient } from "@/infrastructure/supabase/server";
const localeOf = (data: FormData) => (data.get("locale") === "uk" ? "uk" : "en");
export type UsernameChangeState =
  | { stage: "idle" | "pending" | "confirmed" }
  | { stage: "error"; code: "invalid" | "taken" | "cooldown" | "sendFailed" };
function nextAllowed(changeCount: number, lastChanged: string | null, resetAt: string | null) {
  const now = Date.now();
  if (!lastChanged || !resetAt || new Date(resetAt).getTime() <= now) return null;
  const days = changeCount <= 1 ? 3 : changeCount === 2 ? 7 : 30;
  const value = new Date(lastChanged).getTime() + days * 86400000;
  return value > now ? new Date(value) : null;
}
async function recordIdentityChange(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  userId: string,
  kind: "display_name" | "username",
) {
  const { data } = await supabase
    .from("identity_change_limits")
    .select("change_count,reset_at")
    .eq("user_id", userId)
    .eq("kind", kind)
    .maybeSingle();
  const count =
    data?.reset_at && new Date(data.reset_at).getTime() > Date.now()
      ? (data.change_count ?? 0) + 1
      : 1;
  const now = new Date();
  await supabase.from("identity_change_limits").upsert({
    user_id: userId,
    kind,
    change_count: count,
    last_changed_at: now.toISOString(),
    reset_at: new Date(now.getTime() + 31 * 86400000).toISOString(),
  });
}
export async function updateProfile(formData: FormData) {
  const locale = localeOf(formData);
  const displayName = String(formData.get("displayName") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();
  const isPublic = formData.get("isPublic") === "on";
  if (displayName.length < 1 || displayName.length > 50 || bio.length > 500)
    redirect(`/${locale}/settings?status=invalid-profile` as Route);
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login` as Route);
  const { error } = await supabase
    .from("profiles")
    .update({ display_name: displayName, bio, is_public: isPublic })
    .eq("id", user.id);
  redirect(`/${locale}/settings?status=${error ? "error" : "profile-saved"}` as Route);
}

export async function updateDisplayName(formData: FormData) {
  const locale = localeOf(formData);
  const displayName = String(formData.get("displayName") ?? "").trim();
  if (displayName.length < 1 || displayName.length > 50)
    redirect(`/${locale}/settings?status=invalid-profile` as Route);
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  const { data: limit } = await supabase
    .from("identity_change_limits")
    .select("change_count,last_changed_at,reset_at")
    .eq("user_id", user.id)
    .eq("kind", "display_name")
    .maybeSingle();
  const blocked = nextAllowed(
    limit?.change_count ?? 0,
    limit?.last_changed_at ?? null,
    limit?.reset_at ?? null,
  );
  if (blocked) redirect(`/${locale}/settings?status=nickname-cooldown` as Route);
  const { error } = await supabase
    .from("profiles")
    .update({ display_name: displayName })
    .eq("id", user.id);
  if (!error) await recordIdentityChange(supabase, user.id, "display_name");
  redirect(`/${locale}/settings?status=${error ? "error" : "profile-saved"}` as Route);
}

export async function updateProfileDetails(formData: FormData) {
  const locale = localeOf(formData);
  const bio = String(formData.get("bio") ?? "").trim();
  const isPublic = formData.get("isPublic") === "on";
  if (bio.length > 500) redirect(`/${locale}/settings?status=invalid-profile` as Route);
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  const { error } = await supabase
    .from("profiles")
    .update({ bio, is_public: isPublic })
    .eq("id", user.id);
  redirect(`/${locale}/settings?status=${error ? "error" : "profile-saved"}` as Route);
}

export async function requestUsernameChange(
  _: UsernameChangeState,
  formData: FormData,
): Promise<UsernameChangeState> {
  const locale = localeOf(formData);
  const username = String(formData.get("username") ?? "").trim();
  if (!/^[A-Za-z0-9_]{3,24}$/.test(username)) return { stage: "error", code: "invalid" };
  const origin = (await headers()).get("origin") ?? "http://localhost:3000";
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return { stage: "error", code: "sendFailed" };
  const [{ data: existing }, { data: limit }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id")
      .ilike("username", username)
      .neq("id", user.id)
      .maybeSingle(),
    supabase
      .from("identity_change_limits")
      .select("change_count,last_changed_at,reset_at")
      .eq("user_id", user.id)
      .eq("kind", "username")
      .maybeSingle(),
  ]);
  if (existing) return { stage: "error", code: "taken" };
  if (
    nextAllowed(limit?.change_count ?? 0, limit?.last_changed_at ?? null, limit?.reset_at ?? null)
  )
    return { stage: "error", code: "cooldown" };
  const cookieStore = await cookies();
  cookieStore.set("pcbuilder-pending-username", username, {
    httpOnly: true,
    sameSite: "lax",
    secure: origin.startsWith("https:"),
    maxAge: 900,
    path: "/",
  });
  const next = encodeURIComponent(`/${locale}/settings?usernameChange=1`);
  const { error } = await supabase.auth.signInWithOtp({
    email: user.email,
    options: {
      shouldCreateUser: false,
      emailRedirectTo: `${origin}/${locale}/auth/callback?next=${next}`,
    },
  });
  return error ? { stage: "error", code: "sendFailed" } : { stage: "pending" };
}
export async function updatePreferences(formData: FormData) {
  const locale = localeOf(formData);
  const timezone = String(formData.get("timezone") ?? "UTC").slice(0, 64);
  const comparison = formData.get("comparisonAi") === "on";
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  await Promise.all([
    supabase.from("profiles").update({ locale }).eq("id", user.id),
    supabase
      .from("user_settings")
      .update({ timezone, comparison_ai_enabled: comparison })
      .eq("user_id", user.id),
  ]);
  revalidatePath(`/${locale}/settings`);
  redirect(`/${locale}/settings?status=preferences-saved` as Route);
}

export async function updateInterfaceLocale(locale: "uk" | "en") {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("profiles").update({ locale }).eq("id", user.id);
}
export async function updateAvatar(formData: FormData) {
  const locale = localeOf(formData);
  const file = formData.get("avatar");
  if (
    !(file instanceof File) ||
    file.size === 0 ||
    file.size > 2097152 ||
    !["image/jpeg", "image/png", "image/webp"].includes(file.type)
  )
    redirect(`/${locale}/settings?status=invalid-avatar` as Route);
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  const ext = (file.type.split("/")[1] ?? "webp").replace("jpeg", "jpg");
  const path = `${user.id}/avatar.${ext}`;
  const { error } = await supabase.storage
    .from("avatars")
    .upload(path, file, { upsert: true, contentType: file.type, cacheControl: "3600" });
  if (!error) await supabase.from("profiles").update({ avatar_path: path }).eq("id", user.id);
  revalidatePath(`/${locale}/settings`);
  redirect(`/${locale}/settings?status=${error ? "error" : "avatar-saved"}` as Route);
}
export async function updateEmail(formData: FormData) {
  const locale = localeOf(formData);
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email)) redirect(`/${locale}/settings?status=invalid-email` as Route);
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.updateUser({ email });
  redirect(`/${locale}/settings?status=${error ? "error" : "email-confirmation"}` as Route);
}
export async function requestPasswordReset(formData: FormData) {
  const locale = localeOf(formData);
  const origin = (await headers()).get("origin") ?? "http://localhost:3000";
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return;
  const next = encodeURIComponent(`/${locale}/settings?passwordReset=1`);
  const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
    redirectTo: `${origin}/${locale}/auth/callback?next=${next}`,
  });
  redirect(`/${locale}/settings?status=${error ? "error" : "email-confirmation"}` as Route);
}
export async function updatePassword(formData: FormData) {
  const locale = localeOf(formData);
  const cookieStore = await cookies();
  if (cookieStore.get("pcbuilder-password-recovery")?.value !== "1")
    redirect(`/${locale}/settings?status=error` as Route);
  const password = String(formData.get("password") ?? "");
  const confirmation = String(formData.get("passwordConfirmation") ?? "");
  if (password.length < 8 || password !== confirmation)
    redirect(`/${locale}/settings?passwordReset=1&status=invalid-password` as Route);
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (!error) cookieStore.delete("pcbuilder-password-recovery");
  redirect(`/${locale}/settings?status=${error ? "error" : "password-saved"}` as Route);
}
