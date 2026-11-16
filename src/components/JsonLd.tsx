// Escape "<" so strings like "</script>" in the data can't close the tag early.
export default function JsonLd({ data }: { data: object }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  // biome-ignore lint/security/noDangerouslySetInnerHtml: static JSON-LD built from constants, "<" escaped above
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
