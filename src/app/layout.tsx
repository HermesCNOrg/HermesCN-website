import "~/styles/globals.css";
import "remixicon/fonts/remixicon.css";

import { type Metadata } from "next";
import { Footer } from "~/components/footer";
import { Header } from "~/components/header";
import { ScrollToTop } from "~/components/scroll-to-top";
import { siteConfig } from "~/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.shortName}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: "technology",
  keywords: [
    "Hermes Agent",
    "HermesCN",
    "Hermes 中文社区",
    "Hermes Agent 中文",
    "Hermes Agent 教程",
    "AI Agent",
    "AI Agent 中文社区",
    "Agent Skills",
    "AI 自动化",
    "智能体",
    "企业 AI Agent 解决方案",
    "Project Network",
  ],
  referrer: "origin-when-cross-origin",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: "/",
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: [
    { rel: "icon", url: "/favicon.ico", sizes: "any" },
    { rel: "icon", url: "/favicon.png", type: "image/png", sizes: "64x64" },
    { rel: "apple-touch-icon", url: "/logo_icon.png", sizes: "1116x1116" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${siteConfig.url}/#organization`,
      name: siteConfig.name,
      alternateName: siteConfig.shortName,
      url: siteConfig.url,
      logo: `${siteConfig.url}/logo_icon.png`,
      description: siteConfig.description,
      sameAs: [siteConfig.social.github, siteConfig.social.x],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${siteConfig.url}/#website`,
      url: siteConfig.url,
      name: siteConfig.name,
      description: siteConfig.description,
      inLanguage: siteConfig.language,
      publisher: {
        "@id": `${siteConfig.url}/#organization`,
      },
    },
  ];

  return (
    <html lang={siteConfig.language} data-theme="light">
      <body className="bg-background text-foreground min-h-screen antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
          type="application/ld+json"
        />
        <Header />
        <main>{children}</main>
        <Footer />
        <ScrollToTop />
      </body>
    </html>
  );
}
