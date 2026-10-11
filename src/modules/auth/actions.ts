"use server";

import { headers } from "next/headers";
import type { Route } from "next";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/infrastructure/supabase/server";
import { magicLinkSchema, onboardingSchema, passwordSignInSchema, signUpSchema, type AuthActionState } from "./schemas";

function formValues(formData: FormData) {
  return Object.fromEntries(formData.entries());
}

function go(path: string): never {
  redirect(path as Route);
}

function authPath(locale: string, path: string, code: string): Route {
  return `/${locale}/${path}?status=${encodeURIComponent(code)}` as Route;
}

export async function signInWithPassword(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const parsed = passwordSignInSchema.safeParse(formValues(formData));
  if (!parsed.success) return { error: "invalidCredentials" };
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email: parsed.data.email, password: parsed.data.password });
  if (error || !data.user) return { error: "invalidCredentials" };
  if (!data.user.email_confirmed_at) {
    await supabase.auth.signOut();
    go(authPath(parsed.data.locale, "verify", "verificationRequired"));
  }
  go(`/${parsed.data.locale}/dashboard`);
}

export async function signUp(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const parsed = signUpSchema.safeParse(formValues(formData));
  if (!parsed.success) return { error: "invalidRegistration" };
  const origin = (await headers()).get("origin");
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: `${origin}/${parsed.data.locale}/auth/callback?next=/${parsed.data.locale}/onboarding`,
      data: { display_name: parsed.data.displayName, locale: parsed.data.locale },
    },
  });
  if (error) return { error: "registrationFailed" };
  go(authPath(parsed.data.locale, "verify", "checkEmail"));
}

export async function sendMagicLink(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const parsed = magicLinkSchema.safeParse(formValues(formData));
  if (!parsed.success) return { error: "invalidEmail" };
  const origin = (await headers()).get("origin");
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data.email,
    options: { shouldCreateUser: true, emailRedirectTo: `${origin}/${parsed.data.locale}/auth/callback?next=/${parsed.data.locale}/onboarding`, data: { locale: parsed.data.locale } },
  });
  return error ? { error: "magicLinkFailed" } : { success: "magicLinkSent" };
}

export async function signInWithGoogle(formData: FormData) {
  const locale = formData.get("locale") === "uk" ? "uk" : "en";
  const origin = (await headers()).get("origin");
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${origin}/${locale}/auth/callback?next=/${locale}/onboarding` } });
  if (error || !data.url) go(authPath(locale, "login", "oauthFailed"));
  go(data.url);
}

export async function completeOnboarding(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const parsed = onboardingSchema.safeParse(formValues(formData));
  if (!parsed.success) return { error: "invalidUsername" };
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) go(`/${parsed.data.locale}/login`);
  const now = new Date().toISOString();
  const { error } = await supabase.from("profiles").update({ username: parsed.data.username, locale: parsed.data.locale, age_attested_at: now }).eq("id", user.id);
  if (error?.code === "23505") return { error: "usernameTaken" };
  if (error) return { error: "onboardingFailed" };
  const { error: consentError } = await supabase.from("consents").insert([
    { user_id: user.id, purpose: "terms", policy_version: "2026-07-15", is_granted: true },
    { user_id: user.id, purpose: "privacy", policy_version: "2026-07-15", is_granted: true },
  ]);
  if (consentError) return { error: "onboardingFailed" };
  const { error: completionError } = await supabase.from("profiles").update({ onboarding_completed_at: now }).eq("id", user.id);
  if (completionError) return { error: "onboardingFailed" };
  go(`/${parsed.data.locale}/dashboard`);
}

export async function signOut(formData: FormData) {
  const locale = formData.get("locale") === "uk" ? "uk" : "en";
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  go(`/${locale}`);
}
