export function formspreeEndpoint(value?: string): string | undefined {
  const endpoint = value?.trim();
  if (!endpoint) return undefined;
  if (!/^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/.test(endpoint)) {
    throw new Error(
      "VITE_FORMSPREE_ENDPOINT must be a public form endpoint such as https://formspree.io/f/yourFormId.",
    );
  }
  return endpoint;
}
