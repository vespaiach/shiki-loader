import type { Metadata } from "next";
import "./globals.css";
import { GoogleTagManager } from "@next/third-parties/google";

const title = "Shiki Loader";
const description =
  "Browser-only syntax highlighting for code blocks using Shiki. A quick way to add syntax highlighting to your website with no configuration.";

export const metadata: Metadata = {
  title: {
    default: `${title} – Browser syntax highlighting`,
    template: `%s | ${title}`,
  },
  description,
  keywords: [
    "shiki",
    "syntax highlighting",
    "code highlighting",
    "browser-only",
    "shiki loader",
    "javascript",
    "typescript",
    "code blocks",
  ],
  openGraph: {
    title: `${title} – Browser-only syntax highlighting`,
    description,
    url: "/",
    siteName: title,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} – Browser-only syntax highlighting`,
    description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <GoogleTagManager gtmId="GTM-TXB9CSX9" />
      <body className="antialiased">{children}</body>
    </html>
  );
}
