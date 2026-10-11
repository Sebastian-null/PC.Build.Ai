import { z } from "zod";

export const localeSchema = z.enum(["uk", "en"]);

export const passwordSignInSchema = z.object({
  email: z.email().max(254),
  password: z.string().min(8).max(128),
  locale: localeSchema,
});

export const signUpSchema = passwordSignInSchema.extend({
  displayName: z.string().trim().min(1).max(50),
});

export const magicLinkSchema = z.object({ email: z.email().max(254), locale: localeSchema });

export const onboardingSchema = z.object({
  username: z.string().trim().regex(/^[A-Za-z0-9_]{3,24}$/),
  locale: localeSchema,
  ageConfirmed: z.literal("on"),
  legalAccepted: z.literal("on"),
});

export type AuthActionState = { error?: string; success?: string };
