import { siteConfig } from "~/lib/seo";

const content = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${siteConfig.url}/sitemap-main.xml</loc>
  </sitemap>
  <sitemap>
    <loc>${siteConfig.url}/docs/sitemap.xml</loc>
  </sitemap>
</sitemapindex>`;

export function GET() {
  return new Response(content, {
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
