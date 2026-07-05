import assert from "node:assert/strict";
import test from "node:test";

import { redactText, redactUrl } from "./redact";
import { buildAuthMail } from "./templates/auth";

void test("redactUrl masks reset-password path tokens and callback URLs", () => {
  const rawUrl =
    "https://example.com/reset-password/abcdefghijklmnopqrstuvwx?callbackURL=%2Fdashboard";

  const redacted = redactUrl(rawUrl);

  assert.equal(
    redacted,
    "https://example.com/reset-password/abcd***uvwx?callbackURL=***",
  );
  assert.doesNotMatch(redacted, /abcdefghijklmnopqrstuvwx/);
});

void test("redactText masks embedded sensitive auth URLs", () => {
  const rawText =
    "Open https://example.com/reset-password/abcdefghijklmnopqrstuvwx?callbackURL=%2Fdashboard now";

  const redacted = redactText(rawText);

  assert.doesNotMatch(redacted, /abcdefghijklmnopqrstuvwx/);
  assert.match(redacted, /abcd\*\*\*uvwx/);
});

void test("buildAuthMail escapes user-controlled HTML values", () => {
  const mail = buildAuthMail({
    kind: "change-email-confirmation",
    to: "person@example.com",
    userName: `<img src=x onerror="alert('boom')">`,
    newEmail: `evil@example.com<script>alert("xss")</script>`,
    actionUrl:
      "https://example.com/verify-email?token=abcdefghijklmnopqrstuvwx&callbackURL=%2Fwelcome",
    expiresInMinutes: 60,
  });

  assert.ok(
    mail.html.includes(
      "&lt;img src=x onerror=&quot;alert(&#39;boom&#39;)&quot;&gt;",
    ),
  );
  assert.ok(
    mail.html.includes(
      "evil@example.com&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;",
    ),
  );
  assert.doesNotMatch(mail.html, /<script>alert\("xss"\)<\/script>/);
  assert.doesNotMatch(mail.html, /<img src=x onerror=/);
});
