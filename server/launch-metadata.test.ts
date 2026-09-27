import { test } from "node:test";
import assert from "node:assert/strict";
import { launchTags } from "./launch-metadata.ts";

test("private previews do not claim a public canonical domain", () => {
  for (const value of [undefined, "", "  "]) {
    const tags = launchTags(value);
    assert.ok(
      tags.every(
        (tag) =>
          tag.attrs?.rel !== "canonical" && tag.attrs?.property !== "og:url",
      ),
    );
    assert.equal(
      tags.find((tag) => tag.attrs?.property === "og:image")?.attrs?.content,
      "/social-preview.png",
    );
  }
});

test("a deployment origin gives crawlers matching absolute URLs", () => {
  const tags = launchTags(" https://360.example ");
  assert.equal(
    tags.find((tag) => tag.attrs?.rel === "canonical")?.attrs?.href,
    "https://360.example/",
  );
  assert.equal(
    tags.find((tag) => tag.attrs?.property === "og:url")?.attrs?.content,
    "https://360.example/",
  );
  for (const tag of tags.filter(
    (tag) =>
      tag.attrs?.property === "og:image" || tag.attrs?.name === "twitter:image",
  )) {
    assert.equal(tag.attrs?.content, "https://360.example/social-preview.png");
  }
});

test("invalid deployment URLs fail instead of producing broken sharing metadata", () => {
  for (const value of [
    "360.example",
    "http://360.example",
    "https://360.example/shop",
    "https://user:pass@360.example",
    "https://360.example/?test=1",
    "https://360.example/#story",
    "javascript:alert(1)",
  ]) {
    assert.throws(() => launchTags(value));
  }
});
