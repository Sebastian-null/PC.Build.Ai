# PCBuilderAI

Implementation follows the approved [Project Bible](./docs/01-project-bible.md). The current milestone includes the bilingual Next.js foundation and Supabase authentication architecture.

## Local setup

1. Use Node.js 22 or newer and run `npm install`.
2. Create a Supabase project and copy `.env.example` to `.env.local`.
3. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
4. Apply `supabase/migrations/202607150001_identity_foundation.sql` through the Supabase CLI or SQL migration workflow.
5. In Supabase Auth, configure the site URL and allowed callback URLs for local, preview, and production environments.
6. Enable Google Auth and configure its OAuth client/callback in both Google Cloud and Supabase.
7. Run `npm run dev`.

Never expose `SUPABASE_SERVICE_ROLE_KEY`, Gemini, or Stripe secrets to the browser.

## Verification

```text
npm run typecheck
npm run lint
npm run build
npm audit --audit-level=moderate
```

The SQL migration has not been applied remotely because no Supabase project credentials are present in this workspace.
