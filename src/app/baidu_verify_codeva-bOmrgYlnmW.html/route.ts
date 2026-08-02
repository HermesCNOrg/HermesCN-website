const verificationCode = "205307b6fd93bbaff13d6afbeb9176ca";

export function GET() {
  return new Response(verificationCode, {
    headers: {
      "content-type": "text/html; charset=utf-8",
    },
  });
}
