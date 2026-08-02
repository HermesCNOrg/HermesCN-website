import { siteConfig } from "~/lib/seo";

const routes = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/skills", changeFrequency: "daily", priority: 0.9 },
  { path: "/best-practices", changeFrequency: "weekly", priority: 0.8 },
  { path: "/services", changeFrequency: "monthly", priority: 0.7 },
] as const;

const urls = routes
  .map(
    ({ path, changeFrequency, priority }) => `  <url>
    <loc>${siteConfig.url}${path}</loc>
    <changefreq>${changeFrequency}</changefreq>
    <priority>${priority}</priority>
  </url>`,
  )
  .join("\n");

const content = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

export function GET() {
  return new Response(content, {
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
