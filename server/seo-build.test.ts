import { test } from "node:test";
import assert from "node:assert/strict";
import { build } from "vite";
import { JSDOM } from "jsdom";

// Exercise the real build: tags alone cannot catch omitted crawl files or an
// empty React root in the HTML that a crawler actually receives.
for (const published of [true, false]) {
  test(`${published ? "public" : "private"} build has crawlable content and the correct indexing policy`, async () => {
    const values = {
      SITE_URL: published ? "https://360.example" : "",
      VITE_FORMSPREE_ENDPOINT: published
        ? "https://formspree.io/f/testform"
        : "",
      GOOGLE_SITE_VERIFICATION: "google-test-token",
      BING_SITE_VERIFICATION: "bing-test-token",
    };
    const previous = Object.fromEntries(
      Object.keys(values).map((key) => [key, process.env[key]]),
    );
    Object.assign(process.env, values);
    try {
      const result = await build({
        mode: published ? "pages" : "production",
        logLevel: "silent",
        build: { write: false },
      });
      assert.ok(!Array.isArray(result) && "output" in result);
      const asset = (name: string) => {
        const file = result.output.find((entry) => entry.fileName === name);
        return file?.type === "asset" ? String(file.source) : undefined;
      };
      const document = new JSDOM(asset("index.html")).window.document;
      assert.ok(
        document.querySelector("#root h1"),
        "initial HTML needs the real homepage",
      );
      assert.equal(document.querySelectorAll(".design-card h3").length, 6);
      assert.ok(
        document
          .querySelector("#story")
          ?.textContent?.includes("clothing label"),
      );
      assert.equal(document.querySelectorAll("h1").length, 1);
      for (const photo of document.querySelectorAll("[data-colorway]")) {
        assert.equal(photo.getAttribute("aria-busy"), "false");
        assert.ok(!photo.getAttribute("aria-label")?.includes("loading"));
      }
      const form = document.querySelector("form");
      assert.equal(form?.getAttribute("method"), "post");
      const robots = document
        .querySelector('meta[name="robots"]')
        ?.getAttribute("content");
      if (published) {
        assert.ok(robots);
        assert.ok(robots.includes("index, follow"));
        assert.ok(!robots.includes("noindex"));
        assert.equal(
          form?.getAttribute("action"),
          values.VITE_FORMSPREE_ENDPOINT,
        );
        assert.ok(form?.querySelector('input[name="consent_version"]'));
        assert.equal(
          document.querySelector('link[rel="canonical"]')?.getAttribute("href"),
          "https://360.example/",
        );
        assert.match(asset("robots.txt") ?? "", /User-agent: \*\nAllow: \/\n/);
        assert.match(
          asset("robots.txt") ?? "",
          /Sitemap: https:\/\/360.example\/sitemap.xml/,
        );
        const sitemap = new JSDOM(asset("sitemap.xml"), {
          contentType: "text/xml",
        }).window.document;
        assert.deepEqual(
          [...sitemap.querySelectorAll("loc")].map((loc) => loc.textContent),
          ["https://360.example/"],
        );
        const data = JSON.parse(
          document.querySelector('script[type="application/ld+json"]')
            ?.textContent ?? "null",
        );
        assert.ok(
          data["@graph"].some(
            (item: Record<string, unknown>) =>
              item["@type"] === "WebSite" &&
              item.url === "https://360.example/",
          ),
        );
        assert.ok(
          data["@graph"].some(
            (item: Record<string, unknown>) =>
              item["@type"] === "Organization" && item.name === "360",
          ),
        );
        assert.ok(!JSON.stringify(data).includes('"Offer"'));
        assert.equal(
          document
            .querySelector('meta[name="google-site-verification"]')
            ?.getAttribute("content"),
          "google-test-token",
        );
        assert.equal(
          document
            .querySelector('meta[name="msvalidate.01"]')
            ?.getAttribute("content"),
          "bing-test-token",
        );
      } else {
        assert.equal(robots, "noindex, nofollow");
        assert.equal(document.querySelector('link[rel="canonical"]'), null);
        assert.equal(
          document.querySelector('script[type="application/ld+json"]'),
          null,
        );
        assert.equal(
          document.querySelector('meta[name="google-site-verification"]'),
          null,
        );
        assert.equal(asset("sitemap.xml"), undefined);
        assert.equal(asset("robots.txt"), "User-agent: *\nDisallow: /\n");
        assert.equal(form?.getAttribute("action"), null);
      }
    } finally {
      for (const [key, value] of Object.entries(previous)) {
        if (value === undefined) delete process.env[key];
        else process.env[key] = value;
      }
    }
  });
}
