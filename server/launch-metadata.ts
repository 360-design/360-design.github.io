import type { HtmlTagDescriptor, Plugin } from "vite";

export function launchTags(siteUrl?: string): HtmlTagDescriptor[] {
  let home: string | undefined;
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
    home = url.href;
  }
  const image = home
    ? new URL("social-preview.png", home).href
    : "/social-preview.png";
  const tags: HtmlTagDescriptor[] = [
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
    );
  }
  return tags.map((tag) => ({ ...tag, injectTo: "head" }));
}

export function launchMetadata(siteUrl?: string): Plugin {
  const tags = launchTags(siteUrl);
  return {
    name: "360-launch-metadata",
    transformIndexHtml: () => tags,
  };
}
