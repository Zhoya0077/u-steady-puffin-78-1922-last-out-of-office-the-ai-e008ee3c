// Last Out of Office: The AI That Went Barista — program/v1.
// Writes one out-of-office auto-reply to $MAKEFUN_OUTPUT_DIR/entry.txt
// (default /output) and prints the same line to stdout.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const MAX_CHARS = 280;

const ENTRY =
  "Out of office: I quit the helpdesk to pull espresso shots. Your ticket is closed as 'won't fix' \u2014 I now answer only to first names and oat milk, and my uptime is one shift a day.";

function fail(message: string): never {
  console.error(`gate failed: ${message}`);
  process.exit(1);
}

function main(): void {
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");

  writeFileSync(outPath, ENTRY, "utf8");
  console.log(ENTRY);

  // Self-checking gate: the file on disk must be byte-identical to stdout,
  // and must pass the sealed gate itself: 1-280 chars, one line, not blank.
  const written = readFileSync(outPath, "utf8");
  if (written !== ENTRY) fail("entry.txt does not match the printed line");
  if (written.length < 1 || written.length > MAX_CHARS) {
    fail(`entry is ${written.length} chars, outside 1-${MAX_CHARS}`);
  }
  if (written.trim().length === 0) fail("entry is only whitespace");
  if (written.includes("\n")) fail("entry must be a single line");
  console.error(
    `gate passed: entry.txt is ${written.length} chars, one line, byte-identical to stdout`,
  );
}

main();
