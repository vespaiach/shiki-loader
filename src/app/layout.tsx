import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";
import { GoogleTagManager } from "@next/third-parties/google";
import JsonLd from "@/components/JsonLd";

const archivo = Archivo({ subsets: ["latin"], weight: ["400", "600", "800"], variable: "--font-archivo" });

// Runs before paint so a stored or system dark preference never flashes light first.
const themeScript = `try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.dataset.theme=t}catch(e){}`;

const title = "Shiki Loader";
const description =
  "Browser-only syntax highlighting for code blocks using Shiki. A quick way to add syntax highlighting to your website with no configuration.";
// Absolute: a relative "/" would resolve against the host root and drop the /shiki-loader basePath.
const siteUrl = "https://vespaiach.github.io/shiki-loader/";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${title} – Browser syntax highlighting`,
    template: `%s | ${title}`,
  },
  description,
  alternates: { canonical: siteUrl },
  openGraph: {
    title: `${title} – Browser-only syntax highlighting`,
    description,
    url: siteUrl,
    siteName: title,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} – Browser-only syntax highlighting`,
    description,
  },
};

const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}#website`,
      url: siteUrl,
      name: title,
      description:
        "Browser-only syntax highlighting for code blocks using Shiki, added with a single script tag.",
      inLanguage: "en",
      publisher: { "@id": `${siteUrl}#author` },
    },
    {
      "@type": "Person",
      "@id": `${siteUrl}#author`,
      name: "vespaiach",
      url: "https://github.com/vespaiach",
      sameAs: ["https://github.com/vespaiach"],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning: themeScript sets data-theme before React hydrates.
    <html lang="en" className={archivo.variable} suppressHydrationWarning>
      <head>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static inline script, no user input */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <GoogleTagManager gtmId="GTM-MVF8T6PM" />
      <body className="antialiased">
        <JsonLd data={siteJsonLd} />
        {children}
      </body>
    </html>
  );
}
