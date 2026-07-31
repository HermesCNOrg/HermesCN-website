import type { MetadataRoute } from "next";

import { siteConfig } from "~/lib/seo";
import { getSkills } from "./skills/skills-data";

const routes = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/skills", changeFrequency: "daily", priority: 0.9 },
  { path: "/best-practices", changeFrequency: "weekly", priority: 0.8 },
  { path: "/services", changeFrequency: "monthly", priority: 0.7 },
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const skills = await getSkills();
  const staticRoutes: MetadataRoute.Sitemap = routes.map(
    ({ path, changeFrequency, priority }) => ({
      url: `${siteConfig.url}${path}`,
      changeFrequency,
      priority,
    }),
  );
  const skillRoutes: MetadataRoute.Sitemap = skills.map((skill) => ({
    url: `${siteConfig.url}/skills/${encodeURIComponent(skill.slug)}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...skillRoutes];
}
