import test from "node:test";
import assert from "node:assert/strict";
import { parseCsv } from "../src/csvParser.js";

test("parseCsv parses simple comma-separated values", () => {
  const result = parseCsv("name,city\nAri,Seattle\nBea,Austin");

  assert.equal(result.ok, true);
  assert.deepEqual(result.headers, ["name", "city"]);
  assert.deepEqual(result.rows, [
    ["Ari", "Seattle"],
    ["Bea", "Austin"]
  ]);
});

test("parseCsv handles quoted values and escaped quotes", () => {
  const result = parseCsv('name,notes\n"Ari","Says ""hello"", loudly"');

  assert.equal(result.ok, true);
  assert.deepEqual(result.rows, [["Ari", 'Says "hello", loudly']]);
});

test("parseCsv ignores blank lines and normalizes line endings", () => {
  const result = parseCsv("name,city\r\n\r\nAri,Seattle\rBea,Austin\n");

  assert.equal(result.ok, true);
  assert.deepEqual(result.rows, [
    ["Ari", "Seattle"],
    ["Bea", "Austin"]
  ]);
});

test("parseCsv returns malformed_csv for unclosed quoted field", () => {
  const result = parseCsv('name,city\n"Ari,Seattle');

  assert.equal(result.ok, false);
  assert.equal(result.error.code, "malformed_csv");
});

test("parseCsv returns column_mismatch for row length mismatch", () => {
  const result = parseCsv("name,city\nAri");

  assert.equal(result.ok, false);
  assert.equal(result.error.code, "column_mismatch");
});

test("parseCsv returns invalid_encoding for non-UTF-8 bytes", () => {
  const result = parseCsv(new Uint8Array([0xc3, 0x28]));

  assert.equal(result.ok, false);
  assert.equal(result.error.code, "invalid_encoding");
});
