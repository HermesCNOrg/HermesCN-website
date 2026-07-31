import { env } from "~/env";

export function GET() {
  if (!env.INDEXNOW_KEY) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(env.INDEXNOW_KEY, {
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
