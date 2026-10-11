/* eslint-disable react-hooks/purity */
import { getTranslations, setRequestLocale } from "next-intl/server";
import { requireVerifiedUser } from "@/modules/auth/guards";
import { ThemeSwitcher } from "@/shared/ui/theme-switcher";
import {
  updateDisplayName,
  updatePreferences,
  updateProfileDetails,
} from "@/modules/settings/actions";
import { AvatarUploader } from "@/modules/settings/avatar-uploader";
import { UsernameChangeDialog } from "@/modules/settings/username-change-dialog";
import { LanguageSwitcher } from "@/modules/settings/language-switcher";
import { AccountSecurity } from "@/modules/settings/account-security";
import type { AppLocale } from "@/shared/i18n/routing";
type Limit = {
  kind: string;
  change_count: number;
  last_changed_at: string | null;
  reset_at: string | null;
};
function allowedAt(limit: Limit | undefined) {
  if (
    !limit?.last_changed_at ||
    !limit.reset_at ||
    new Date(limit.reset_at).getTime() <= Date.now()
  )
    return null;
  const days = limit.change_count <= 1 ? 3 : limit.change_count === 2 ? 7 : 30;
  const date = new Date(new Date(limit.last_changed_at).getTime() + days * 86400000);
  return date.getTime() > Date.now() ? date.toISOString() : null;
}
export default async function SettingsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: AppLocale }>;
  searchParams: Promise<{ status?: string; passwordReset?: string; usernameChanged?: string }>;
}) {
  const { locale } = await params;
  const { status, passwordReset, usernameChanged } = await searchParams;
  setRequestLocale(locale);
  const { user, supabase } = await requireVerifiedUser(locale);
  const t = await getTranslations("Settings");
  const [{ data: profile }, { data: settings }, { data: limitData }] = await Promise.all([
    supabase
      .from("profiles")
      .select("username,display_name,bio,avatar_path,is_public")
      .eq("id", user.id)
      .single(),
    supabase
      .from("user_settings")
      .select("timezone,comparison_ai_enabled")
      .eq("user_id", user.id)
      .single(),
    supabase
      .from("identity_change_limits")
      .select("kind,change_count,last_changed_at,reset_at")
      .eq("user_id", user.id),
  ]);
  const limits = (limitData ?? []) as Limit[];
  const nicknameAllowed = allowedAt(limits.find((item) => item.kind === "display_name"));
  const usernameAllowed = allowedAt(limits.find((item) => item.kind === "username"));
  const name = profile?.display_name || profile?.username || "User";
  const avatarUrl = profile?.avatar_path
    ? `${supabase.storage.from("avatars").getPublicUrl(profile.avatar_path).data.publicUrl}?v=${Date.now()}`
    : null;
  return (
    <main className="app-page settings-page">
      <header className="app-page-header">
        <p className="eyebrow">{t("eyebrow")}</p>
        <h1>{t("title")}</h1>
        <p>{t("copy")}</p>
      </header>
      {status && (
        <p
          className={`settings-status ${status === "error" || status.startsWith("invalid") || status === "username-taken" || status === "nickname-cooldown" ? "error" : "success"}`}
        >
          {t(`statuses.${status}`)}
        </p>
      )}
      <div className="settings-layout">
        <nav className="settings-nav">
          <a href="#appearance">{t("appearance")}</a>
          <a href="#personalization">{t("personalization")}</a>
          <a href="#preferences">{t("preferences")}</a>
          <a href="#account">{t("account")}</a>
        </nav>
        <div className="settings-content">
          <section id="appearance" className="settings-card">
            <div>
              <h2>{t("appearance")}</h2>
              <p>{t("appearanceCopy")}</p>
            </div>
            <label className="settings-field">
              <span>{t("theme")}</span>
              <ThemeSwitcher />
            </label>
            <div className="settings-field settings-language">
              <span>{t("language")}</span>
              <LanguageSwitcher locale={locale} />
            </div>
          </section>
          <section id="personalization" className="settings-card">
            <div>
              <h2>{t("personalization")}</h2>
              <p>{t("personalizationCopy")}</p>
            </div>
            <AvatarUploader locale={locale} avatarUrl={avatarUrl} name={name} />
            <div className="identity-row">
              <form action={updateDisplayName}>
                <input type="hidden" name="locale" value={locale} />
                <label className="settings-field">
                  <span>{t("displayName")}</span>
                  <input
                    name="displayName"
                    defaultValue={profile?.display_name ?? ""}
                    minLength={1}
                    maxLength={50}
                    required
                  />
                  {nicknameAllowed ? (
                    <small>
                      {t("nicknameCooldown", {
                        date: new Intl.DateTimeFormat(locale, {
                          dateStyle: "medium",
                          timeStyle: "short",
                        }).format(new Date(nicknameAllowed)),
                      })}
                    </small>
                  ) : (
                    <small aria-hidden="true">&nbsp;</small>
                  )}
                </label>
                <button disabled={Boolean(nicknameAllowed)}>{t("save")}</button>
              </form>
              <div className="username-setting">
                <label className="settings-field">
                  <span>{t("username")}</span>
                  <input value={profile?.username ?? ""} readOnly />
                  <small aria-hidden="true">&nbsp;</small>
                </label>
                <UsernameChangeDialog
                  locale={locale}
                  currentUsername={profile?.username ?? ""}
                  confirmed={usernameChanged === "1"}
                  nextAllowed={usernameAllowed}
                />
              </div>
            </div>
            <form action={updateProfileDetails} className="settings-form profile-details">
              <input type="hidden" name="locale" value={locale} />
              <label className="settings-field full">
                <span>{t("bio")}</span>
                <textarea name="bio" defaultValue={profile?.bio ?? ""} maxLength={500} rows={4} />
              </label>
              <label className="settings-check full">
                <input type="checkbox" name="isPublic" defaultChecked={profile?.is_public} />
                <span>
                  <b>{t("publicProfile")}</b>
                  <small>{t("publicProfileHint")}</small>
                </span>
              </label>
              <button className="button">{t("saveProfile")}</button>
            </form>
          </section>
          <section id="preferences" className="settings-card">
            <div>
              <h2>{t("preferences")}</h2>
              <p>{t("preferencesCopy")}</p>
            </div>
            <form action={updatePreferences} className="settings-form">
              <input type="hidden" name="locale" value={locale} />
              <label className="settings-field">
                <span>{t("timezone")}</span>
                <input name="timezone" defaultValue={settings?.timezone ?? "UTC"} maxLength={64} />
              </label>
              <label className="settings-check full">
                <input
                  type="checkbox"
                  name="comparisonAi"
                  defaultChecked={settings?.comparison_ai_enabled}
                />
                <span>
                  <b>{t("comparisonAi")}</b>
                  <small>{t("comparisonAiHint")}</small>
                </span>
              </label>
              <button className="button">{t("savePreferences")}</button>
            </form>
          </section>
          <AccountSecurity
            locale={locale}
            email={user.email ?? ""}
            passwordReset={passwordReset === "1"}
          />
        </div>
      </div>
    </main>
  );
}
