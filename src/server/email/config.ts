import { env } from "~/env";

import { type MailProvider } from "./types";

export class MailConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MailConfigError";
  }
}

export type MailConfig = {
  provider: MailProvider;
  from: string;
  sesUser?: string;
  sesPass?: string;
};

const DEFAULT_FROM = "HermesCN 中文社区 <no-reply@localhost>";

export const loadMailConfig = (): MailConfig => {
  const provider =
    env.MAIL_PROVIDER ??
    (env.SES_USER && env.SES_PASS
      ? "smtp"
      : env.NODE_ENV === "production"
        ? "smtp"
        : "console");

  const from = env.MAIL_FROM ?? DEFAULT_FROM;

  if (provider === "smtp") {
    if (!env.SES_USER?.trim()) {
      throw new MailConfigError("SES_USER is required when MAIL_PROVIDER=smtp");
    }

    if (!env.SES_PASS?.trim()) {
      throw new MailConfigError("SES_PASS is required when MAIL_PROVIDER=smtp");
    }
  }

  return {
    provider,
    from,
    sesUser: env.SES_USER,
    sesPass: env.SES_PASS,
  };
};
