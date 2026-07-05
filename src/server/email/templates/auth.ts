import { escapeHtml } from "../escape";
import { redactUrl } from "../redact";
import { resolveLocale, type Locale } from "~/i18n/config";
import { translate, type Translator } from "~/i18n/messages";
import {
  type AuthMailKind,
  type AuthMailPayload,
  type MailSendRequest,
} from "../types";

type MailCopy = {
  subject: string;
  heading: string;
  intro: string;
  cta: string;
  expiry: string;
  safety: string;
};

const getMailCopy = (
  kind: AuthMailKind,
  expiresInMinutes: number,
  locale: Locale,
  newEmail?: string,
): MailCopy => {
  const t: Translator = (key, params) => translate(locale, key, params);

  switch (kind) {
    case "verify-email":
      return {
        subject: t("mail.verifyEmail.subject"),
        heading: t("mail.verifyEmail.heading"),
        intro: t("mail.verifyEmail.intro"),
        cta: t("mail.verifyEmail.cta"),
        expiry: t("mail.verifyEmail.expiry", { minutes: expiresInMinutes }),
        safety: t("mail.verifyEmail.safety"),
      };
    case "change-email-confirmation":
      return {
        subject: t("mail.changeEmail.subject"),
        heading: t("mail.changeEmail.heading"),
        intro: t("mail.changeEmail.intro", {
          email: newEmail ?? t("mail.changeEmail.fallbackEmail"),
        }),
        cta: t("mail.changeEmail.cta"),
        expiry: t("mail.changeEmail.expiry", { minutes: expiresInMinutes }),
        safety: t("mail.changeEmail.safety"),
      };
    case "reset-password":
      return {
        subject: t("mail.resetPassword.subject"),
        heading: t("mail.resetPassword.heading"),
        intro: t("mail.resetPassword.intro"),
        cta: t("mail.resetPassword.cta"),
        expiry: t("mail.resetPassword.expiry", { minutes: expiresInMinutes }),
        safety: t("mail.resetPassword.safety"),
      };
  }
};

const renderHtml = ({
  userName,
  actionUrl,
  copy,
  locale,
}: {
  userName: string;
  actionUrl: string;
  copy: MailCopy;
  locale: Locale;
}) => {
  const safeUserName = escapeHtml(userName);
  const safeActionUrl = escapeHtml(actionUrl);
  const safeRedactedActionUrl = escapeHtml(redactUrl(actionUrl));
  const safeCopy = {
    subject: escapeHtml(copy.subject),
    heading: escapeHtml(copy.heading),
    intro: escapeHtml(copy.intro),
    cta: escapeHtml(copy.cta),
    expiry: escapeHtml(copy.expiry),
    safety: escapeHtml(copy.safety),
  };

  return `
<!DOCTYPE html>
<html lang="${locale}">
  <body style="margin:0;padding:24px;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#18181b;">
    <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:16px;padding:32px;border:1px solid #e4e4e7;">
      <p style="margin:0 0 12px;font-size:14px;color:#52525b;">${escapeHtml(translate(locale, "mail.greeting", { userName: safeUserName }))}</p>
      <h1 style="margin:0 0 20px;font-size:28px;line-height:1.2;">${safeCopy.heading}</h1>
      <p style="margin:0 0 24px;font-size:16px;line-height:1.6;">${safeCopy.intro}</p>
      <a href="${safeActionUrl}" style="display:inline-block;padding:14px 22px;background:#18181b;color:#ffffff;text-decoration:none;border-radius:999px;font-weight:600;">
        ${safeCopy.cta}
      </a>
      <div style="margin-top:24px;padding:16px;border-radius:12px;background:#fafafa;border:1px solid #e4e4e7;">
        <p style="margin:0;font-size:14px;line-height:1.6;">${safeCopy.expiry}</p>
      </div>
      <p style="margin:24px 0 16px;font-size:14px;line-height:1.6;">${safeCopy.safety}</p>
      <p style="margin:0;font-size:12px;line-height:1.6;color:#71717a;word-break:break-all;">
        ${safeRedactedActionUrl}
      </p>
    </div>
  </body>
</html>
`;
};

const renderText = ({
  userName,
  actionUrl,
  copy,
}: {
  userName: string;
  actionUrl: string;
  copy: MailCopy;
}) =>
  [
    `Hi ${userName},`,
    "",
    copy.heading,
    copy.intro,
    "",
    copy.cta,
    actionUrl,
    "",
    copy.expiry,
    "",
    copy.safety,
  ].join("\n");

export const buildAuthMail = ({
  kind,
  to,
  userName,
  actionUrl,
  expiresInMinutes,
  locale,
  newEmail,
}: AuthMailPayload): MailSendRequest => {
  const safeLocale = resolveLocale(locale);
  const safeUserName =
    userName?.trim() ?? translate(safeLocale, "mail.fallbackName");
  const safeNewEmail = newEmail?.trim();
  const copy = getMailCopy(kind, expiresInMinutes, safeLocale, safeNewEmail);

  return {
    to,
    subject: copy.subject,
    text: renderText({ userName: safeUserName, actionUrl, copy }),
    html: renderHtml({
      userName: safeUserName,
      actionUrl,
      copy,
      locale: safeLocale,
    }),
    metadata: {
      kind,
    },
  };
};
