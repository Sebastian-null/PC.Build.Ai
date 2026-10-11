"use client";
import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/shared/i18n/navigation";
type Message = { id: string; role: string; content: string; created_at?: string };
type Session = { id: string; title: string; updated_at: string };
export function ChatWorkspace({
  locale,
  sessions,
  initialSessionId,
  initialMessages,
}: {
  locale: "uk" | "en";
  sessions: Session[];
  initialSessionId?: string;
  initialMessages: Message[];
}) {
  const t = useTranslations("Chat");
  const router = useRouter();
  const [sessionId, setSessionId] = useState(initialSessionId);
  const [messages, setMessages] = useState(initialMessages);
  const [chatSessions, setChatSessions] = useState(sessions);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [renaming, setRenaming] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  async function rename(id: string) {
    const title = renameValue.trim();
    if (title.length < 2) return;
    const response = await fetch(`/api/v1/chats/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title }),
    });
    if (response.ok) {
      setChatSessions((current) =>
        current.map((item) => (item.id === id ? { ...item, title } : item)),
      );
      setRenaming(null);
      router.refresh();
    }
  }
  async function submit(event: FormEvent) {
    event.preventDefault();
    const value = input.trim();
    if (!value || pending) return;
    setInput("");
    setPending(true);
    setMessages((current) => [
      ...current,
      { id: crypto.randomUUID(), role: "user", content: value },
    ]);
    try {
      const response = await fetch("/api/v1/demo-chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: value, sessionId, locale }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setMessages((current) => [
        ...current,
        { id: crypto.randomUUID(), role: "assistant", content: data.message },
      ]);
      if (!sessionId) {
        setSessionId(data.sessionId);
        router.replace(`/chat?session=${data.sessionId}`);
        router.refresh();
      }
    } catch {
      setMessages((current) => [
        ...current,
        { id: crypto.randomUUID(), role: "assistant", content: t("error") },
      ]);
    } finally {
      setPending(false);
    }
  }
  return (
    <div className="chat-layout">
      <aside className="chat-history">
        <div className="chat-history-head">
          <h2>{t("history")}</h2>
          <button
            onClick={() => {
              setSessionId(undefined);
              setMessages([]);
              router.replace("/chat");
            }}
          >
            ＋
          </button>
        </div>
        {chatSessions.map((item) => (
          <div
            className={`chat-session-row ${item.id === sessionId ? "active" : ""}`}
            key={item.id}
          >
            {renaming === item.id ? (
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  void rename(item.id);
                }}
              >
                <input
                  value={renameValue}
                  onChange={(event) => setRenameValue(event.target.value)}
                  autoFocus
                  maxLength={120}
                />
                <button>✓</button>
                <button type="button" onClick={() => setRenaming(null)}>
                  ×
                </button>
              </form>
            ) : (
              <>
                <button
                  className="chat-session-open"
                  onClick={() => router.push(`/chat?session=${item.id}`)}
                >
                  {item.title}
                </button>
                <button
                  className="chat-session-rename"
                  title={t("rename")}
                  onClick={() => {
                    setRenaming(item.id);
                    setRenameValue(item.title);
                  }}
                >
                  ✎
                </button>
              </>
            )}
          </div>
        ))}
      </aside>
      <main className="chat-main">
        {messages.length === 0 ? (
          <section className="chat-empty">
            <span className="ai-orb">✦</span>
            <h1>{t("title")}</h1>
            <p>{t("copy")}</p>
            <div className="prompt-grid">
              {["gaming", "workstation", "upgrade", "silent"].map((key) => (
                <button key={key} onClick={() => setInput(t(`prompts.${key}`))}>
                  {t(`prompts.${key}`)}
                </button>
              ))}
            </div>
          </section>
        ) : (
          <section className="message-list">
            {messages.map((message) => (
              <article key={message.id} className={`message ${message.role}`}>
                <span>{message.role === "assistant" ? "AI" : t("you")}</span>
                <div>
                  {message.content.split("\n").map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
              </article>
            ))}
            {pending && (
              <article className="message assistant">
                <span>AI</span>
                <div className="typing">
                  <i />
                  <i />
                  <i />
                </div>
              </article>
            )}
          </section>
        )}
        <form className="chat-composer" onSubmit={submit}>
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={t("placeholder")}
            rows={2}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                event.currentTarget.form?.requestSubmit();
              }
            }}
          />
          <button disabled={!input.trim() || pending} aria-label={t("send")}>
            ↑
          </button>
          <small>{t("demoNotice")}</small>
        </form>
      </main>
    </div>
  );
}
