import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const base = "https://vespaiach.github.io/shiki-loader";

export default function sitemap(): MetadataRoute.Sitemap {
  // shortcut: one date for both pages; switch to per-page dates if pages start changing independently
  const lastModified = new Date();
  return [
    { url: `${base}/`, lastModified },
    { url: `${base}/about`, lastModified },
  ];
}
