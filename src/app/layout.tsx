import "~/styles/globals.css";

import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "HermesCN 中文社区",
  description: "HermesCN 中文社区",
  icons: [
    { rel: "icon", url: "/favicon.ico", sizes: "any" },
    { rel: "icon", url: "/favicon.png", type: "image/png", sizes: "64x64" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" data-theme="dark">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <main>{children}</main>
      </body>
    </html>
  );
}
