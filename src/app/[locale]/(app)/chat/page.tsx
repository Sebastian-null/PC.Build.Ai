import { setRequestLocale } from "next-intl/server";
import { requireVerifiedUser } from "@/modules/auth/guards";
import { ChatWorkspace } from "@/modules/ai-chat/chat-workspace";
import type { AppLocale } from "@/shared/i18n/routing";

export default async function ChatPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: AppLocale }>;
  searchParams: Promise<{ session?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { user, supabase } = await requireVerifiedUser(locale);
  const { session } = await searchParams;
  const { data: sessions } = await supabase
    .from("chat_sessions")
    .select("id,title,updated_at")
    .eq("owner_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(30);
  const activeId = session && sessions?.some((item) => item.id === session) ? session : undefined;
  const { data: messages } = activeId
    ? await supabase
        .from("chat_messages")
        .select("id,role,content,created_at")
        .eq("session_id", activeId)
        .order("created_at")
    : { data: [] };
  return (
    <ChatWorkspace
      key={activeId ?? "new-chat"}
      locale={locale}
      sessions={sessions ?? []}
      initialSessionId={activeId}
      initialMessages={messages ?? []}
    />
  );
}
