#!/usr/bin/env node
import { readFileSync } from "node:fs";

function sortKeys(value) {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (value && typeof value === "object") {
    return Object.keys(value)
      .sort()
      .reduce((acc, key) => {
        acc[key] = sortKeys(value[key]);
        return acc;
      }, {});
  }
  return value;
}

const inputPath = process.argv[2];
if (!inputPath) {
  console.error("usage: canonicalize.mjs <openapi.json>");
  process.exit(2);
}

const raw = readFileSync(inputPath, "utf8");
const parsed = JSON.parse(raw);
process.stdout.write(JSON.stringify(sortKeys(parsed), null, 2) + "\n");
