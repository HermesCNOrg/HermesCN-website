export type MailProvider = "console" | "smtp";

export type MailSendRequest = {
  to: string | string[];
  subject: string;
  text: string;
  html: string;
  metadata?: Record<string, string>;
};

export type MailSendResponse = {
  messageId: string;
  provider: MailProvider;
};

export interface MailService {
  send(mail: MailSendRequest): Promise<MailSendResponse>;
}

export type AuthMailKind =
  | "verify-email"
  | "change-email-confirmation"
  | "reset-password";

export type AuthMailPayload = {
  kind: AuthMailKind;
  to: string;
  userName?: string | null;
  actionUrl: string;
  expiresInMinutes: number;
  locale?: "en" | "zh";
  newEmail?: string;
};
