import test from "node:test";
import assert from "node:assert/strict";
import { SORT_DIRECTIONS } from "../src/sort.js";
import { chunkRows, filterRows, getVisibleRange, sortFilteredRows } from "../src/tablePerformance.js";

const buildRows = (count) =>
  Array.from({ length: count }, (_, index) => ({
    id: index,
    name: `Person ${index}`,
    role: index % 2 === 0 ? "Engineer" : "Designer",
    city: index % 3 === 0 ? "Austin" : "Seattle"
  }));

test("filterRows handles 10,000-row datasets with multi-column filters", () => {
  const rows = buildRows(10_000);

  const filtered = filterRows(rows, {
    name: "person 12",
    role: "engineer",
    city: "austin"
  });

  assert.ok(filtered.length > 0);
  assert.ok(filtered.every((row) => row.name.toLowerCase().includes("person 12")));
  assert.ok(filtered.every((row) => row.role === "Engineer"));
  assert.ok(filtered.every((row) => row.city === "Austin"));
});

test("sortFilteredRows preserves sort correctness for large numeric values", () => {
  const rows = buildRows(10_000).map((row) => ({ ...row, score: 10_000 - row.id }));
  const sorted = sortFilteredRows(rows, { column: "score", direction: SORT_DIRECTIONS.ASC });

  assert.equal(sorted[0].score, 1);
  assert.equal(sorted.at(-1).score, 10_000);
});

test("getVisibleRange computes bounded windows for virtualization", () => {
  const range = getVisibleRange({
    totalRows: 10_000,
    rowHeight: 28,
    scrollTop: 28 * 200,
    viewportHeight: 28 * 20,
    overscan: 3
  });

  assert.deepEqual(range, { start: 197, end: 223 });
});

test("chunkRows yields deterministic chunk batches", async () => {
  const rows = buildRows(105);
  const chunks = [];

  await chunkRows({
    rows,
    chunkSize: 20,
    onChunk: (chunk) => chunks.push(chunk.length),
    yieldToMain: async () => undefined
  });

  assert.deepEqual(chunks, [20, 20, 20, 20, 20, 5]);
});
