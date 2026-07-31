import type { MetadataRoute } from "next";

import { siteConfig } from "~/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#0000f2",
    theme_color: "#0000f2",
    lang: siteConfig.language,
    icons: [
      {
        src: "/logo_icon.png",
        sizes: "1116x1116",
        type: "image/png",
      },
    ],
  };
}
