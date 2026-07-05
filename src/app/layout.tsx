import "~/styles/globals.css";
import "remixicon/fonts/remixicon.css";

import { type Metadata } from "next";
import { Footer } from "~/components/footer";
import { Header } from "~/components/header";

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
    <html lang="zh-CN" data-theme="light">
      <body className="bg-background text-foreground min-h-screen antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
