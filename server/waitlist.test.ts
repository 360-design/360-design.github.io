import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm, mkdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createServer } from "node:http";
import { DatabaseSync } from "node:sqlite";
import { createWaitlistHandler } from "./waitlist.ts";

test("signups persist once across concurrent submissions and server restarts", async (t) => {
  const directory = await mkdtemp(join(tmpdir(), "360-waitlist-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const databasePath = join(directory, "waitlist.sqlite");
  async function start() {
    const waitlist = createWaitlistHandler({ databasePath });
    const server = createServer(waitlist.handle);
    await new Promise<void>((resolve) =>
      server.listen(0, "127.0.0.1", resolve),
    );
    const address = server.address();
    assert(address && typeof address !== "string");
    return {
      url: `http://127.0.0.1:${address.port}/api/signup`,
      close: async () => {
        await new Promise<void>((resolve, reject) =>
          server.close((error) => (error ? reject(error) : resolve())),
        );
        waitlist.close();
      },
    };
  }
  const first = await start();
  try {
    const responses = await Promise.all(
      [" Person@Example.com ", "person@example.com"].map((email) =>
        fetch(first.url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }),
      ),
    );
    for (const response of responses) {
      assert.equal(response.status, 200);
      assert.deepEqual(await response.json(), { subscribed: true });
    }
  } finally {
    await first.close();
  }
  const second = await start();
  try {
    const response = await fetch(second.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "person@example.com" }),
    });
    assert.equal(response.status, 200);
    const db = new DatabaseSync(databasePath, { readOnly: true });
    try {
      const rows = db
        .prepare("SELECT email, consent_version, created_at FROM subscribers")
        .all();
      assert.equal(rows.length, 1);
      assert.equal(rows[0].email, "person@example.com");
      assert.equal(rows[0].consent_version, "launch-updates-v1");
      assert(Number.isFinite(Date.parse(String(rows[0].created_at))));
    } finally {
      db.close();
    }
  } finally {
    await second.close();
  }
});

test("invalid, cross-origin, oversized and repeated requests cannot add subscribers", async (t) => {
  const directory = await mkdtemp(join(tmpdir(), "360-waitlist-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const waitlist = createWaitlistHandler({
    databasePath: join(directory, "list.sqlite"),
  });
  const server = createServer(waitlist.handle);
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(async () => {
    await new Promise<void>((resolve) => server.close(() => resolve()));
    waitlist.close();
  });
  const address = server.address();
  assert(address && typeof address !== "string");
  const url = `http://127.0.0.1:${address.port}/api/signup`;
  const post = (body: string, headers = {}) =>
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body,
    });
  assert.equal((await fetch(url)).status, 405);
  assert.equal((await post('{"email":"bad"}')).status, 400);
  assert.equal((await post("not json")).status, 400);
  assert.equal(
    (
      await post('{"email":"person@example.com"}', {
        Origin: "https://another-site.example",
      })
    ).status,
    403,
  );
  assert.equal((await post("x".repeat(5000))).status, 413);
  assert.equal(
    (await post('{"email":"person@example.com","website":"spam"}')).status,
    400,
  );
  let response = await post('{"email":"valid@example.com"}');
  for (let i = 0; i < 12 && response.status !== 429; i++)
    response = await post('{"email":"valid@example.com"}');
  assert.equal(response.status, 429);
  assert(response.headers.get("retry-after"));
});

test("storage failure returns an error instead of claiming success", async (t) => {
  const directory = await mkdtemp(join(tmpdir(), "360-waitlist-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const databasePath = join(directory, "directory-instead-of-file");
  await mkdir(databasePath);
  const waitlist = createWaitlistHandler({ databasePath });
  const server = createServer(waitlist.handle);
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(async () => {
    await new Promise<void>((resolve) => server.close(() => resolve()));
    waitlist.close();
  });
  const address = server.address();
  assert(address && typeof address !== "string");
  const response = await fetch(`http://127.0.0.1:${address.port}/api/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: '{"email":"valid@example.com"}',
  });
  assert.equal(response.status, 503);
  assert.notDeepEqual(await response.json(), { subscribed: true });
});
