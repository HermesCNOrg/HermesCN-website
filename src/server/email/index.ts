export { buildAuthMail } from "./templates/auth";
export { loadMailConfig, MailConfigError } from "./config";
export { escapeHtml } from "./escape";
export { getMailService } from "./service";
export { maskEmail, maskValue, redactText, redactUrl } from "./redact";
export type {
  AuthMailKind,
  AuthMailPayload,
  MailProvider,
  MailSendRequest,
  MailSendResponse,
  MailService,
} from "./types";
