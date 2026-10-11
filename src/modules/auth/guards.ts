import type { Route } from "next";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/infrastructure/supabase/server";
import type { AppLocale } from "@/shared/i18n/routing";

export async function requireVerifiedUser(locale: AppLocale) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login` as Route);
  if (!user.email_confirmed_at) redirect(`/${locale}/verify?status=verificationRequired` as Route);
  return { user, supabase };
}
