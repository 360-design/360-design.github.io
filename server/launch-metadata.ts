import type { HtmlTagDescriptor, Plugin } from "vite";

function publicHome(siteUrl?: string): string | undefined {
  if (siteUrl?.trim()) {
    const url = new URL(siteUrl.trim());
    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      url.pathname !== "/" ||
      url.search ||
      url.hash
    ) {
      throw new Error(
        "SITE_URL must be an HTTPS origin, such as https://360.example, without a path, credentials, query or fragment.",
      );
    }
    return url.href;
  }
}

type Verification = { google?: string; bing?: string };

export function launchTags(
  siteUrl?: string,
  verification: Verification = {},
): HtmlTagDescriptor[] {
  const home = publicHome(siteUrl);
  const image = home
    ? new URL("social-preview.png", home).href
    : "/social-preview.png";
  const tags: HtmlTagDescriptor[] = [
    {
      tag: "meta",
      attrs: {
        name: "robots",
        content: home
          ? "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
          : "noindex, nofollow",
      },
    },
    { tag: "meta", attrs: { property: "og:image", content: image } },
    { tag: "meta", attrs: { property: "og:image:type", content: "image/png" } },
    { tag: "meta", attrs: { property: "og:image:width", content: "1200" } },
    { tag: "meta", attrs: { property: "og:image:height", content: "630" } },
    {
      tag: "meta",
      attrs: {
        property: "og:image:alt",
        content:
          "The circle-built 360 logo and Everything starts with a circle. Monochrome clothing. Coming soon.",
      },
    },
    { tag: "meta", attrs: { name: "twitter:image", content: image } },
  ];
  if (home) {
    tags.push(
      { tag: "link", attrs: { rel: "canonical", href: home } },
      { tag: "meta", attrs: { property: "og:url", content: home } },
      {
        tag: "script",
        attrs: { type: "application/ld+json" },
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": `${home}#organization`,
              name: "360",
              url: home,
              logo: new URL("apple-touch-icon.png", home).href,
              description:
                "A coming-soon clothing label built around circle-grid artwork and monochrome garment concepts.",
              sameAs: [
                "https://www.youtube.com/@360-DESIGNS-BRAND",
                "https://www.instagram.com/360designofficial",
                "https://www.tiktok.com/@360.design0",
              ],
            },
            {
              "@type": "WebSite",
              "@id": `${home}#website`,
              name: "360",
              url: home,
              inLanguage: "en",
              publisher: { "@id": `${home}#organization` },
            },
          ],
        }).replace(/</g, "\\u003c"),
      },
    );
    for (const [name, token] of [
      ["google-site-verification", verification.google],
      ["msvalidate.01", verification.bing],
    ]) {
      if (token?.trim()) {
        tags.push({
          tag: "meta",
          attrs: { name: name!, content: token.trim() },
        });
      }
    }
  }
  return tags.map((tag) => ({ ...tag, injectTo: "head" }));
}

export function launchMetadata(
  siteUrl?: string,
  verification: Verification = {},
): Plugin {
  const home = publicHome(siteUrl);
  const tags = launchTags(siteUrl, verification);
  return {
    name: "360-launch-metadata",
    transformIndexHtml: () => tags,
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "robots.txt",
        source: home
          ? `User-agent: *\nAllow: /\n\nSitemap: ${home}sitemap.xml\n`
          : "User-agent: *\nDisallow: /\n",
      });
      if (home) {
        this.emitFile({
          type: "asset",
          fileName: "sitemap.xml",
          source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${home}</loc></url>\n</urlset>\n`,
        });
      }
    },
  };
}
