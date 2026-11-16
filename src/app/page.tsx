import JsonLd from "@/components/JsonLd";
import HomeClient from "./_components/HomeClient";

const siteUrl = "https://vespaiach.github.io/shiki-loader/";

// Keep softwareVersion, version and downloadUrl in step with each release (also in HomeClient and README).
const softwareJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": `${siteUrl}#software`,
      name: "Shiki Loader",
      url: siteUrl,
      description:
        "A drop-in browser script that syntax-highlights <pre><code> blocks using Shiki, with language labels, copy-to-clipboard buttons and automatic dark mode.",
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Any modern web browser",
      softwareVersion: "2.1.0",
      downloadUrl: "https://cdn.jsdelivr.net/gh/vespaiach/shiki-loader@v2.1.0/public/shiki-loader.js",
      license: "https://opensource.org/licenses/MIT",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      featureList: [
        "Automatic detection of <pre><code> blocks with language-* or lang-* classes",
        "Light and dark themes via prefers-color-scheme",
        "Language label on every code block",
        "Copy-to-clipboard button",
        "Single script tag, no build step",
      ],
      isPartOf: { "@id": `${siteUrl}#website` },
      author: { "@id": `${siteUrl}#author` },
      sameAs: ["https://github.com/vespaiach/shiki-loader"],
    },
    {
      "@type": "SoftwareSourceCode",
      "@id": `${siteUrl}#source`,
      name: "shiki-loader",
      codeRepository: "https://github.com/vespaiach/shiki-loader",
      programmingLanguage: ["TypeScript", "JavaScript"],
      runtimePlatform: "Web browser",
      license: "https://opensource.org/licenses/MIT",
      version: "2.1.0",
      targetProduct: { "@id": `${siteUrl}#software` },
      author: { "@id": `${siteUrl}#author` },
    },
  ],
};

export default function Home() {
  return (
    <>
      <JsonLd data={softwareJsonLd} />
      <HomeClient />
    </>
  );
}
