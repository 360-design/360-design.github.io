import { DatabaseSync } from "node:sqlite";
import { defaultDatabasePath } from "./waitlist.ts";

const database = new DatabaseSync(defaultDatabasePath, { readOnly: true });
try {
  const rows = database
    .prepare(
      "SELECT email, created_at, consent_version FROM subscribers ORDER BY created_at",
    )
    .all();
  // Neutralize spreadsheet formula prefixes in user-provided email addresses.
  const csv = (value: unknown) => {
    const text = String(value);
    return `"${(/^[=+@-]/.test(text) ? "'" + text : text).replaceAll('"', '""')}"`;
  };
  process.stdout.write("email,created_at,consent_version\n");
  for (const row of rows)
    process.stdout.write(
      [row.email, row.created_at, row.consent_version].map(csv).join(",") +
        "\n",
    );
} finally {
  database.close();
}
