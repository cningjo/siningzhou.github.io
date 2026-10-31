#!/usr/bin/env node
// Sets (or changes) the site password by rewriting the config block in gate.js.
//
//   GATE_PASSWORD='your long passphrase' npm run gate:set-password
//
// Only a random salt, a PBKDF2-SHA256 hash of the password, and a random unlock
// token are written to gate.js. The password itself is never printed or stored.
// Running this again with a new password also signs everyone out, because the
// unlock token changes.
//
// Optional: pass a different gate.js path as the first argument.

import { pbkdf2Sync, randomBytes } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const ITERATIONS = 600000;
const MIN_LENGTH = 10;

const target = process.argv[2] ?? fileURLToPath(new URL("../../gate.js", import.meta.url));
const password = process.env.GATE_PASSWORD;

if (!password) {
  console.error("Set the GATE_PASSWORD environment variable, e.g.:");
  console.error("  GATE_PASSWORD='your long passphrase' npm run gate:set-password");
  process.exit(1);
}
if (password.length < MIN_LENGTH) {
  console.error(`Please use at least ${MIN_LENGTH} characters. Someone can guess offline against the stored hash, so a longer passphrase is much safer.`);
  process.exit(1);
}

const salt = randomBytes(16);
const token = randomBytes(16).toString("hex");
// NFKC matches the normalize("NFKC") call in the browser, so accents and
// compatibility characters hash the same way on both sides.
const verifier = pbkdf2Sync(password.normalize("NFKC"), salt, ITERATIONS, 32, "sha256").toString("hex");

const config = `var CONFIG = { salt: "${salt.toString("hex")}", iterations: ${ITERATIONS}, verifier: "${verifier}", token: "${token}" };`;

const source = readFileSync(target, "utf8");
const pattern = /(\/\* GATE-CONFIG:START \*\/\n\s*)var CONFIG = [^\n]*\n(\s*\/\* GATE-CONFIG:END \*\/)/;
if (!pattern.test(source)) {
  console.error(`Couldn't find the GATE-CONFIG block in ${target}.`);
  process.exit(1);
}

writeFileSync(target, source.replace(pattern, (_, start, end) => `${start}${config}\n${end}`));
console.log(`Password updated in ${target}. Commit and push gate.js to apply it.`);
