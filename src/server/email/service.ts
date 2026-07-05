import { createTransport, type Transporter } from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

import { loadMailConfig, MailConfigError } from "./config";
import { maskEmail, redactText, redactUrl } from "./redact";
import {
  type MailSendRequest,
  type MailSendResponse,
  type MailService,
} from "./types";

const SMTP_HOST = "email-smtp.ap-southeast-1.amazonaws.com";
const SMTP_PORT = 587;

const normalizeRecipients = (to: string | string[]) =>
  Array.isArray(to) ? to : [to];

class ConsoleMailService implements MailService {
  async send(mail: MailSendRequest): Promise<MailSendResponse> {
    const messageId = `console-${Date.now()}`;

    console.info("[mail] Preview message", {
      provider: "console",
      messageId,
      to: normalizeRecipients(mail.to).map(maskEmail),
      subject: mail.subject,
      metadata: mail.metadata,
      preview: {
        text: redactText(mail.text),
        html: redactText(mail.html),
      },
    });

    return {
      messageId,
      provider: "console",
    };
  }
}

class SmtpMailService implements MailService {
  private readonly config = loadMailConfig();

  private readonly transporter: Transporter<
    SMTPTransport.SentMessageInfo,
    SMTPTransport.Options
  > = createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: false,
    auth: {
      user: this.config.sesUser,
      pass: this.config.sesPass,
    },
  });

  async send(mail: MailSendRequest): Promise<MailSendResponse> {
    try {
      const response = await this.transporter.sendMail({
        from: this.config.from,
        to: mail.to,
        subject: mail.subject,
        text: mail.text,
        html: mail.html,
      });

      console.info("[mail] Message sent", {
        provider: "smtp",
        messageId: response.messageId,
        to: normalizeRecipients(mail.to).map(maskEmail),
        subject: mail.subject,
        metadata: mail.metadata,
      });

      return {
        messageId: response.messageId,
        provider: "smtp",
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const actionUrlMatch = /https?:\/\/\S+/.exec(mail.text);

      console.error("[mail] Message send failed", {
        provider: "smtp",
        to: normalizeRecipients(mail.to).map(maskEmail),
        subject: mail.subject,
        metadata: mail.metadata,
        error: message,
        actionUrl: redactUrl(actionUrlMatch?.[0] ?? ""),
      });

      throw new MailConfigError(message || "Failed to send email");
    }
  }
}

let singleton: MailService | null = null;

export const getMailService = () => {
  if (singleton) return singleton;

  const config = loadMailConfig();
  singleton =
    config.provider === "smtp"
      ? new SmtpMailService()
      : new ConsoleMailService();

  return singleton;
};
