import type { Metadata } from "next";
import AngleLeft from "@/components/icons/AngleLeft";
import Github from "@/components/icons/Github";
import JsonLd from "@/components/JsonLd";

const aboutUrl = "https://vespaiach.github.io/shiki-loader/about";
const aboutDescription =
  "How Shiki Loader works: one script tag that finds <pre><code> blocks and highlights them with Shiki, with dark mode, language labels and copy buttons.";

export const metadata: Metadata = {
  title: "About",
  description: aboutDescription,
  alternates: { canonical: aboutUrl },
  // openGraph is replaced, not merged, so repeat the shared fields here
  openGraph: {
    title: "About Shiki Loader",
    description: aboutDescription,
    url: aboutUrl,
    siteName: "Shiki Loader",
    type: "website",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Shiki Loader",
      item: "https://vespaiach.github.io/shiki-loader/",
    },
    { "@type": "ListItem", position: 2, name: "About", item: aboutUrl },
  ],
};

// Single source for the visible FAQ and its FAQPage markup, so the two can't drift apart.
const faqs = [
  {
    q: "How do I add Shiki syntax highlighting to a website without a build step?",
    a: "Add the Shiki Loader script tag to the page and give each code element a class such as language-js. Shiki Loader finds and highlights every pre/code block automatically.",
  },
  {
    q: "How do I enable dark mode?",
    a: "Add both theme and dark-theme parameters to the script URL, for example ?theme=github-light&dark-theme=github-dark. The dark theme is used when the visitor's system prefers dark mode.",
  },
  {
    q: "How do I highlight code added after the page loads?",
    a: "Call window.ShikiLoader.highlight(), optionally passing a root element. Blocks that are already highlighted are skipped.",
  },
  {
    q: "What happens with an unknown language or theme?",
    a: "Code blocks with an unsupported language are skipped and a warning is logged to the console. Unknown theme names fall back to material-theme.",
  },
  {
    q: "Is Shiki Loader free?",
    a: "Yes. Shiki Loader is free and open source under the MIT license.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: { "@type": "Answer", text: faq.a },
  })),
};

export default async function AboutPage() {
  return (
    <main className="min-h-screen bg-base-100 text-base-content antialiased">
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={faqJsonLd} />
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <nav className="mb-12 -ml-4">
          <a href="https://vespaiach.github.io/shiki-loader/" className="btn btn-sm btn-link gap-1">
            <AngleLeft size={18} />
            Back to Home
          </a>
        </nav>

        <header className="mb-16">
          <h1 className="text-4xl font-bold mb-2 text-primary text-center">About Shiki Loader</h1>
          <p className="text-xl opacity-80 text-center">
            The effortless way to bring high-quality syntax highlighting to any website.
          </p>
        </header>

        <section className="prose prose-lg max-w-none">
          <div className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">What is Shiki Loader?</h2>
            <p className="mb-4">
              <strong>
                <a href="https://github.com/vespaiach/shiki-loader">Shiki Loader</a> is a ~9 KB browser script
                that brings the Shiki syntax highlighter to any HTML page.
              </strong>{" "}
              Load it with one <code>&lt;script type="module"&gt;</code> tag and it highlights every{" "}
              <code>&lt;pre&gt;&lt;code&gt;</code> block using any of Shiki's bundled themes, then adds a
              language badge and a copy-to-clipboard button. Shiki itself is fetched from esm.sh at runtime.
              It works on static sites, WordPress, Ghost and plain HTML.
            </p>
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Key Features</h2>
            <ul className="list-disc pl-6 space-y-3">
              <li>
                <strong>Client-Side Only:</strong> Works perfectly on static sites, CMS platforms (like
                WordPress or Ghost), or any HTML page.
              </li>
              <li>
                <strong>Automatic Detection:</strong> Automatically finds and highlights all{" "}
                <code>&lt;pre&gt;&lt;code&gt;</code> blocks on your page.
              </li>
              <li>
                <strong>Dark Mode Support:</strong> Seamlessly switch between light and dark themes based on
                system preferences.
              </li>
              <li>
                <strong>Built-in Utilities:</strong> Includes a language badge and a "Copy to Clipboard"
                button for every code block.
              </li>
              <li>
                <strong>CDN Ready:</strong> No installation required. Just add a single{" "}
                <code>&lt;script&gt;</code> tag and you're good to go.
              </li>
            </ul>
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">How does Shiki Loader work?</h2>
            <p className="mb-4">
              Behind the scenes,{" "}
              <a href="https://github.com/vespaiach/shiki-loader" className="link">
                shiki-loader
              </a>{" "}
              pulls{" "}
              <a href="https://shiki.style/" target="_blank" className="link" rel="noopener">
                Shiki engine
              </a>{" "}
              - a powerful syntax highlighter - from{" "}
              <a href="https://esm.sh/shiki@3.0.0" target="_blank" className="link" rel="noopener">
                esm.sh CDN link
              </a>
              , automatically finds all <code>&lt;pre&gt;&lt;code&gt;</code> blocks with classes like
              <code>language-*</code>, and asks Shiki to highlight them.
            </p>
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
              What options does Shiki Loader support?
            </h2>
            <p className="mb-4">
              Options are URL parameters on the script tag. There is nothing else to configure.
            </p>
            <table className="table mb-4">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Default</th>
                  <th>What it does</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code>theme</code>
                  </td>
                  <td className="whitespace-nowrap">
                    <code>material-theme</code>
                  </td>
                  <td>Theme for all code blocks. Unknown names fall back to the default.</td>
                </tr>
                <tr>
                  <td className="whitespace-nowrap">
                    <code>dark-theme</code>
                  </td>
                  <td>none</td>
                  <td>Theme used when the visitor's system prefers dark mode.</td>
                </tr>
              </tbody>
            </table>
            <p className="mb-4">
              To highlight code added after page load, call <code>window.ShikiLoader.highlight()</code>,
              optionally with a root element. Already-highlighted blocks are skipped.
            </p>
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Frequently asked questions</h2>
            {faqs.map((faq) => (
              <div key={faq.q} className="mb-4">
                <h3 className="font-semibold mb-1">{faq.q}</h3>
                <p>{faq.a}</p>
              </div>
            ))}
          </div>

          <div className="mb-10 p-6 bg-base-200 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Open Source</h2>
            <p className="mb-6">
              Shiki Loader is open source and available on GitHub. Contributions, bug reports, and feature
              requests are always welcome!
            </p>
            <a
              href="https://github.com/vespaiach/shiki-loader"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline gap-2">
              <Github size={20} />
              View on GitHub
            </a>
          </div>
        </section>

        <p className="text-sm opacity-70 text-center">
          Latest version: <a href="https://github.com/vespaiach/shiki-loader/releases">v2.1.0</a> · Released{" "}
          <time dateTime="2026-11-16">November 2026</time> · MIT license · Maintained by{" "}
          <a href="https://github.com/vespaiach">@vespaiach</a>
        </p>

        <footer className="mt-20 pt-8 border-t text-center opacity-60">
          <p>Built with Next.js, Shiki, and DaisyUI.</p>
        </footer>
      </div>
    </main>
  );
}
