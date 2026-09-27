import { test } from "node:test";
import assert from "node:assert/strict";
import { formspreeEndpoint } from "../src/signup-config.ts";

test("no hosted endpoint preserves the local waitlist", () => {
  assert.equal(formspreeEndpoint(), undefined);
  assert.equal(formspreeEndpoint("  "), undefined);
});

test("only public Formspree submission endpoints can receive emails", () => {
  assert.equal(
    formspreeEndpoint(" https://formspree.io/f/test123 "),
    "https://formspree.io/f/test123",
  );
  for (const url of [
    "http://formspree.io/f/test123",
    "https://formspree.io.evil.example/f/test123",
    "https://user@formspree.io/f/test123",
    "https://formspree.io/f/test123?redirect=elsewhere",
    "https://formspree.io/forms",
    "javascript:alert(1)",
  ]) {
    assert.throws(() => formspreeEndpoint(url));
  }
});
