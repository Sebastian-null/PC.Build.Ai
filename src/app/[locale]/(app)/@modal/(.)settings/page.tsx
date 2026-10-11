import SettingsPage from "../../settings/page";
import { RouteModalFrame } from "@/shared/ui/route-modal-frame";
import type { AppLocale } from "@/shared/i18n/routing";
export default async function SettingsModal(props: {
  params: Promise<{ locale: AppLocale }>;
  searchParams: Promise<{ status?: string; passwordReset?: string; usernameChanged?: string }>;
}) {
  return (
    <RouteModalFrame>
      <SettingsPage {...props} />
    </RouteModalFrame>
  );
}
