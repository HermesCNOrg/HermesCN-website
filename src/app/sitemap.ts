import type { MetadataRoute } from "next";

import { siteConfig } from "~/lib/seo";

const routes = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/skills", changeFrequency: "daily", priority: 0.9 },
  { path: "/best-practices", changeFrequency: "weekly", priority: 0.8 },
  { path: "/services", changeFrequency: "monthly", priority: 0.7 },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map(({ path, changeFrequency, priority }) => ({
    url: `${siteConfig.url}${path}`,
    changeFrequency,
    priority,
  }));
}
