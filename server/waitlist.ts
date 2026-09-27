import { launchConsent } from "../src/signup/consent.ts";
import type { IncomingMessage, ServerResponse } from "node:http";
import { mkdirSync, chmodSync } from "node:fs";
import { dirname, join } from "node:path";
import { homedir } from "node:os";
import { DatabaseSync } from "node:sqlite";

export const defaultDatabasePath = join(
  homedir(),
  ".local",
  "share",
  "360",
  "waitlist.sqlite",
);

export function createWaitlistHandler({
  databasePath,
}: {
  databasePath: string;
}) {
  let database: DatabaseSync | undefined;
  const attempts = new Map<string, { count: number; reset: number }>();
  function reply(response: ServerResponse, status: number, body: object) {
    response.writeHead(status, {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    });
    response.end(JSON.stringify(body));
  }
  function save(email: string) {
    if (!database) {
      mkdirSync(dirname(databasePath), { recursive: true, mode: 0o700 });
      const opened = new DatabaseSync(databasePath);
      try {
        chmodSync(databasePath, 0o600);
        opened.exec(`CREATE TABLE IF NOT EXISTS subscribers (
          email TEXT PRIMARY KEY,
          created_at TEXT NOT NULL,
          consent_version TEXT NOT NULL
        )`);
        database = opened;
      } catch (error) {
        opened.close();
        throw error;
      }
    }
    database
      .prepare(
        "INSERT OR IGNORE INTO subscribers (email, created_at, consent_version) VALUES (?, ?, ?)",
      )
      .run(email, new Date().toISOString(), launchConsent.version);
  }

  return {
    handle(request: IncomingMessage, response: ServerResponse) {
      if (request.method !== "POST") {
        response.setHeader("Allow", "POST");
        reply(response, 405, { error: "Method not allowed" });
        return;
      }
      if (request.headers.origin) {
        try {
          if (new URL(request.headers.origin).host !== request.headers.host) {
            reply(response, 403, { error: "Origin not allowed" });
            return;
          }
        } catch {
          reply(response, 403, { error: "Invalid origin" });
          return;
        }
      }
      if (
        request.headers["content-type"]?.split(";")[0].trim() !==
        "application/json"
      ) {
        reply(response, 415, { error: "JSON required" });
        return;
      }
      const now = Date.now();
      for (const [key, value] of attempts)
        if (value.reset <= now) attempts.delete(key);
      const address = request.socket.remoteAddress ?? "unknown";
      const attempt = attempts.get(address) ?? { count: 0, reset: now + 60000 };
      attempts.set(address, attempt);
      if (++attempt.count > 10) {
        response.setHeader(
          "Retry-After",
          String(Math.max(1, Math.ceil((attempt.reset - now) / 1000))),
        );
        reply(response, 429, { error: "Please retry later" });
        return;
      }
      let size = 0;
      const chunks: Buffer[] = [];
      request.setTimeout(10000, () => request.destroy());
      request.on("data", (chunk: Buffer) => {
        size += chunk.length;
        if (size <= 4096) chunks.push(chunk);
        else if (!response.writableEnded)
          reply(response, 413, { error: "Request too large" });
      });
      request.on("error", () => {
        if (!response.writableEnded)
          reply(response, 400, { error: "Incomplete request" });
      });
      request.on("end", () => {
        if (response.writableEnded) return;
        let input: unknown;
        try {
          input = JSON.parse(Buffer.concat(chunks).toString("utf8"));
        } catch {
          reply(response, 400, { error: "Invalid JSON" });
          return;
        }
        if (
          typeof input !== "object" ||
          input === null ||
          !("email" in input) ||
          typeof input.email !== "string" ||
          ("website" in input && input.website !== "" && input.website !== null)
        ) {
          reply(response, 400, { error: "Invalid signup" });
          return;
        }
        const email = input.email.trim().toLowerCase();
        if (
          email.length > 254 ||
          !/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/i.test(
            email,
          )
        ) {
          reply(response, 400, { error: "Invalid email" });
          return;
        }
        try {
          save(email);
          reply(response, 200, { subscribed: true });
        } catch {
          reply(response, 503, { error: "Waitlist unavailable" });
        }
      });
    },
    close() {
      database?.close();
      database = undefined;
      attempts.clear();
    },
  };
}
