import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import type { User } from "better-auth";

import { env } from "~/env";
import { buildAuthMail, getMailService } from "~/server/email";
import { db } from "~/server/db";

const AUTH_MAIL_EXPIRES_IN_SECONDS = 60 * 60;

const configuredTrustedOrigins =
  env.BETTER_AUTH_TRUSTED_ORIGINS?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean) ?? [];

function toAllowedHost(origin: string) {
  try {
    return new URL(origin).host;
  } catch {
    return origin;
  }
}

const developmentAllowedHosts =
  env.NODE_ENV === "development"
    ? ["http://localhost:*", "http://127.0.0.1:*"]
    : [];

const sendAuthMail = async ({
  kind,
  user,
  url,
  newEmail,
}: {
  kind: "verify-email" | "change-email-confirmation" | "reset-password";
  user: User;
  url: string;
  newEmail?: string;
}) => {
  const mail = buildAuthMail({
    kind,
    to:
      kind === "change-email-confirmation" && newEmail ? newEmail : user.email,
    userName: user.name,
    actionUrl: url,
    expiresInMinutes: AUTH_MAIL_EXPIRES_IN_SECONDS / 60,
    newEmail,
  });

  await getMailService().send(mail);
};

export const auth = betterAuth({
  baseURL: {
    allowedHosts: [
      toAllowedHost(env.BETTER_AUTH_URL),
      ...developmentAllowedHosts,
      ...configuredTrustedOrigins.map(toAllowedHost),
    ],
    fallback: env.BETTER_AUTH_URL,
  },
  trustedOrigins: configuredTrustedOrigins,
  secret: env.BETTER_AUTH_SECRET,
  database: prismaAdapter(db, {
    provider: "postgresql", // or "sqlite" or "mysql"
  }),
  emailVerification: {
    expiresIn: AUTH_MAIL_EXPIRES_IN_SECONDS,
    autoSignInAfterVerification: true,
    sendOnSignUp: true,
    async sendVerificationEmail({ user, url }) {
      await sendAuthMail({
        kind: "verify-email",
        user,
        url,
      });
    },
  },
  emailAndPassword: {
    enabled: false,
    resetPasswordTokenExpiresIn: AUTH_MAIL_EXPIRES_IN_SECONDS,
    async sendResetPassword({ user, url }) {
      await sendAuthMail({
        kind: "reset-password",
        user,
        url,
      });
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      strategy: "jwe",
    },
  },
  socialProviders: {
    github: {
      clientId: env.BETTER_AUTH_GITHUB_CLIENT_ID,
      clientSecret: env.BETTER_AUTH_GITHUB_CLIENT_SECRET,
      redirectURI: `${env.BETTER_AUTH_URL}/api/auth/callback/github`,
    },
  },
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
