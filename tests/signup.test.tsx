import { createServer } from "node:http";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { DatabaseSync } from "node:sqlite";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { expect, it, vi } from "vitest";
import SignupForm from "../src/signup/SignupForm";
import { createWaitlistHandler } from "../server/waitlist";
import { launchConsent } from "../src/signup/consent";

function fill() {
  fireEvent.change(screen.getByRole("textbox", { name: "YOUR EMAIL" }), {
    target: { value: "person@example.com" },
  });
  return screen.getByRole("form", { name: "Join the circle" });
}
it("uses native Formspree submission with hosted fields and consent, without intercepting navigation", () => {
  const fetch = vi.spyOn(globalThis, "fetch");
  render(<SignupForm endpoint="https://formspree.io/f/mqpayvwr" />);
  const form = fill() as HTMLFormElement;
  expect(form.action).toBe("https://formspree.io/f/mqpayvwr");
  expect(form.method).toBe("post");
  expect(Object.fromEntries(new FormData(form))).toEqual({
    email: "person@example.com",
    _gotcha: "",
    consent_version: launchConsent.version,
    consent: launchConsent.statement,
  });
  expect(fireEvent.submit(form)).toBe(true);
  expect(fetch).not.toHaveBeenCalled();
  expect(screen.getByRole<HTMLButtonElement>("button").disabled).toBe(false);
});
it("submits the rendered local form through HTTP to SQLite and locks successful submissions", async () => {
  const directory = await mkdtemp(join(tmpdir(), "360-form-"));
  const databasePath = join(directory, "waitlist.sqlite");
  const waitlist = createWaitlistHandler({ databasePath });
  const server = createServer(waitlist.handle);
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  if (!address || typeof address === "string")
    throw new Error("Missing test server address");
  const realFetch = globalThis.fetch;
  const fetch = vi
    .spyOn(globalThis, "fetch")
    .mockImplementation((input, options) =>
      realFetch(
        new URL(String(input), `http://127.0.0.1:${address.port}`),
        options,
      ),
    );
  try {
    render(<SignupForm endpoint="" />);
    const form = fill();
    expect(fireEvent.submit(form)).toBe(false);
    fireEvent.submit(form);
    expect(fetch).toHaveBeenCalledTimes(1);
    await waitFor(() =>
      expect(screen.getByRole("status").textContent).toContain(
        "You’re on the list",
      ),
    );
    fireEvent.submit(form);
    expect(fetch).toHaveBeenCalledTimes(1);
    const db = new DatabaseSync(databasePath, { readOnly: true });
    try {
      expect(
        db.prepare("SELECT email, consent_version FROM subscribers").all(),
      ).toEqual([
        { email: "person@example.com", consent_version: launchConsent.version },
      ]);
    } finally {
      db.close();
    }
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
    waitlist.close();
    await rm(directory, { recursive: true, force: true });
  }
});
it.each([
  [400, "Please check your email"],
  [429, "A few too many attempts"],
  [503, "We couldn’t save your email"],
])("reports local %i responses and permits retry", async (status, message) => {
  const fetch = vi
    .spyOn(globalThis, "fetch")
    .mockResolvedValueOnce(new Response("{}", { status }))
    .mockResolvedValueOnce(new Response('{"subscribed":true}'));
  render(<SignupForm endpoint="" />);
  const form = fill();
  await act(async () => {
    fireEvent.submit(form);
  });
  expect(screen.getByRole("status").textContent).toContain(message);
  expect(screen.getByRole<HTMLButtonElement>("button").disabled).toBe(false);
  await act(async () => {
    fireEvent.submit(form);
  });
  expect(fetch).toHaveBeenCalledTimes(2);
  expect(screen.getByRole("status").textContent).toContain(
    "You’re on the list",
  );
});
it("recovers from network failure and rejects malformed success responses", async () => {
  vi.spyOn(globalThis, "fetch")
    .mockRejectedValueOnce(new Error("offline"))
    .mockResolvedValueOnce(new Response("{}"));
  render(<SignupForm endpoint="" />);
  const form = fill();
  await act(async () => {
    fireEvent.submit(form);
  });
  expect(screen.getByRole("status").textContent).toContain(
    "We couldn’t connect",
  );
  await act(async () => {
    fireEvent.submit(form);
  });
  expect(screen.getByRole("status").textContent).toContain("We couldn’t save");
});
