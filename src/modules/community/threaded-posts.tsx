"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ConfirmSubmitButton } from "@/shared/ui/confirm-submit-button";
import { createReply, deletePost } from "./actions";

type Post = {
  id: string;
  author_id: string | null;
  parent_post_id: string | null;
  body: string;
  created_at: string;
};
type Profile = { id: string; username: string | null; display_name: string | null };

export function ThreadedPosts({
  posts,
  profiles,
  locale,
  topicId,
  currentUserId,
}: {
  posts: Post[];
  profiles: Profile[];
  locale: "uk" | "en";
  topicId: string;
  currentUserId: string;
}) {
  const t = useTranslations("Forum");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const byParent = new Map<string | null, Post[]>();
  for (const post of posts) {
    const list = byParent.get(post.parent_post_id) ?? [];
    list.push(post);
    byParent.set(post.parent_post_id, list);
  }
  function branch(parent: string | null, depth = 0): React.ReactNode {
    return (byParent.get(parent) ?? []).map((post) => {
      const profile = profiles.find((item) => item.id === post.author_id);
      const parentPost = post.parent_post_id
        ? posts.find((item) => item.id === post.parent_post_id)
        : null;
      const parentProfile = parentPost
        ? profiles.find((item) => item.id === parentPost.author_id)
        : null;
      return (
        <div
          className="thread-node"
          style={{ "--thread-depth": Math.min(depth, 6) } as React.CSSProperties}
          key={post.id}
        >
          {depth > 0 && <span className="thread-line" />}
          <article className="thread-post">
            <aside>
              <div>
                {(profile?.display_name ?? profile?.username ?? "?").slice(0, 1).toUpperCase()}
              </div>
            </aside>
            <section>
              <header>
                <strong>{profile?.display_name ?? profile?.username ?? t("deleted")}</strong>
                <time>
                  {new Intl.DateTimeFormat(locale, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(new Date(post.created_at))}
                </time>
              </header>
              {parentPost && (
                <a className="reply-context" href={`#post-${parentPost.id}`}>
                  ↳{" "}
                  {t("replyingTo", {
                    name: parentProfile?.display_name ?? parentProfile?.username ?? t("deleted"),
                  })}
                  : {parentPost.body.slice(0, 90)}
                </a>
              )}
              <p id={`post-${post.id}`}>{post.body}</p>
              <div className="post-actions">
                <button
                  className="reply-link"
                  onClick={() => setReplyTo(replyTo === post.id ? null : post.id)}
                >
                  ↩ {t("replyAction")}
                </button>
                {post.author_id === currentUserId && (
                  <form action={deletePost}>
                    <input type="hidden" name="locale" value={locale} />
                    <input type="hidden" name="topicId" value={topicId} />
                    <input type="hidden" name="postId" value={post.id} />
                    <ConfirmSubmitButton className="delete-link" message={t("deletePostConfirm")}>
                      {t("deletePost")}
                    </ConfirmSubmitButton>
                  </form>
                )}
              </div>
              {replyTo === post.id && (
                <form
                  action={createReply}
                  className="inline-reply"
                  onSubmit={() => setReplyTo(null)}
                >
                  <input type="hidden" name="locale" value={locale} />
                  <input type="hidden" name="topicId" value={topicId} />
                  <input type="hidden" name="parentPostId" value={post.id} />
                  <textarea
                    name="body"
                    rows={3}
                    minLength={2}
                    maxLength={10000}
                    required
                    autoFocus
                    placeholder={t("replyPlaceholder")}
                  />
                  <div>
                    <button type="button" onClick={() => setReplyTo(null)}>
                      {t("cancel")}
                    </button>
                    <button className="button">{t("postReply")}</button>
                  </div>
                </form>
              )}
            </section>
          </article>
          {branch(post.id, depth + 1)}
        </div>
      );
    });
  }
  return (
    <>
      {branch(null)}
      <section className="reply-card">
        <h2>{t("reply")}</h2>
        <form action={createReply}>
          <input type="hidden" name="locale" value={locale} />
          <input type="hidden" name="topicId" value={topicId} />
          <textarea
            name="body"
            rows={5}
            minLength={2}
            maxLength={10000}
            required
            placeholder={t("replyPlaceholder")}
          />
          <button className="button">{t("postReply")}</button>
        </form>
      </section>
    </>
  );
}
