const SENSITIVE_QUERY_KEYS = new Set([
  "token",
  "password",
  "newPassword",
  "currentPassword",
  "callbackurl",
]);

export const maskValue = (value: string) => {
  if (value.length <= 8) return "***";
  return `${value.slice(0, 4)}***${value.slice(-4)}`;
};

const SENSITIVE_PATH_SEGMENTS = new Set([
  "reset-password",
  "verify-email",
  "change-email",
  "callback",
  "token",
]);

const redactPathname = (pathname: string) => {
  const segments = pathname.split("/");

  return segments
    .map((segment, index) => {
      if (!segment) return segment;

      const previousSegment = segments[index - 1]?.toLowerCase();
      const normalized = segment.toLowerCase();

      if (
        previousSegment &&
        SENSITIVE_PATH_SEGMENTS.has(previousSegment) &&
        segment.length >= 8
      ) {
        return maskValue(segment);
      }

      if (
        normalized.includes("token") ||
        normalized.includes("password") ||
        normalized.includes("verify")
      ) {
        return segment;
      }

      if (/^[A-Za-z0-9_-]{24,}$/.test(segment)) {
        return maskValue(segment);
      }

      return segment;
    })
    .join("/");
};

export const maskEmail = (email: string) => {
  const [localPart = "", domain = ""] = email.split("@");

  if (!localPart || !domain) return "***";
  if (localPart.length <= 2) return `${localPart[0] ?? "*"}***@${domain}`;

  return `${localPart.slice(0, 2)}***${localPart.slice(-1)}@${domain}`;
};

export const redactUrl = (value: string) => {
  try {
    const url = new URL(value);

    url.pathname = redactPathname(url.pathname);

    for (const [key, paramValue] of url.searchParams.entries()) {
      const normalizedKey = key.toLowerCase();

      if (
        SENSITIVE_QUERY_KEYS.has(normalizedKey) ||
        normalizedKey.includes("token") ||
        normalizedKey.includes("password")
      ) {
        void paramValue;
        url.searchParams.set(key, "***");
      }
    }

    return `${url.origin}${url.pathname}${url.search}`;
  } catch {
    return value.replace(/[A-Za-z0-9_-]{24,}/g, (match) => maskValue(match));
  }
};

export const redactText = (value: string) =>
  value
    .replace(/https?:\/\/\S+/g, (match) => redactUrl(match))
    .replace(/[A-Za-z0-9_-]{24,}/g, (match) => maskValue(match));
