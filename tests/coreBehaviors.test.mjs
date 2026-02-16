import test from "node:test";
import assert from "node:assert/strict";
import { applyColumnFilters, getVisibleRows, renderRowsChunked } from "../src/main.js";
import { SORT_DIRECTIONS, sortRows, toggleSort } from "../src/sort.js";

test("sortRows handles empty data and mixed/nullish values without mutating source", () => {
  assert.deepEqual(sortRows([], { column: "name", direction: SORT_DIRECTIONS.ASC }), []);

  const rows = [
    { name: "Zed", score: null },
    { name: "Ana", score: 2 },
    { name: "Bob", score: undefined },
    { name: "Cam", score: "10" }
  ];

  const asc = sortRows(rows, { column: "score", direction: SORT_DIRECTIONS.ASC });
  const desc = sortRows(rows, { column: "score", direction: SORT_DIRECTIONS.DESC });

  assert.deepEqual(
    asc.map((row) => row.name),
    ["Cam", "Ana", "Zed", "Bob"]
  );
  assert.deepEqual(
    desc.map((row) => row.name),
    ["Bob", "Zed", "Ana", "Cam"]
  );
  assert.deepEqual(
    rows.map((row) => row.name),
    ["Zed", "Ana", "Bob", "Cam"]
  );
});

test("applyColumnFilters supports trimmed case-insensitive queries with nullish cell values", () => {
  const rows = [
    { name: "Ari", role: "Engineer", city: null },
    { name: "Bea", role: undefined, city: "Austin" },
    { name: "Cam", role: "Designer", city: "Boston" }
  ];

  const filtered = applyColumnFilters(rows, { name: "  a  ", role: "", city: "" });
  const nullishMatch = applyColumnFilters(rows, { name: "", role: "", city: "null" });

  assert.deepEqual(
    filtered.map((row) => row.name),
    ["Ari", "Bea", "Cam"]
  );
  assert.deepEqual(
    nullishMatch.map((row) => row.name),
    []
  );
});

test("toggleSort falls back to NONE on unknown direction before restarting cycle", () => {
  const invalid = { column: "name", direction: "sideways" };
  const reset = toggleSort(invalid, "name");
  const asc = toggleSort(reset, "name");

  assert.deepEqual(reset, { column: null, direction: SORT_DIRECTIONS.NONE });
  assert.deepEqual(asc, { column: "name", direction: SORT_DIRECTIONS.ASC });
});

test("getVisibleRows memoizes by reference and recomputes when inputs change", () => {
  const rows = [
    { name: "Ari", role: "Engineer", city: "Seattle" },
    { name: "Bea", role: "PM", city: "Austin" }
  ];
  const filters = { name: "", role: "", city: "" };
  const sort = { column: "name", direction: SORT_DIRECTIONS.ASC };

  const first = getVisibleRows(rows, filters, sort);
  const second = getVisibleRows(rows, filters, sort);

  assert.equal(first, second);

  const nextFilters = { ...filters, city: "austin" };
  const next = getVisibleRows(rows, nextFilters, sort);

  assert.notEqual(first, next);
  assert.deepEqual(
    next.map((row) => row.name),
    ["Bea"]
  );
});

test("renderRowsChunked appends chunks and stops when cancellation token flips", async () => {
  const rows = [
    { name: "A", role: "R1", city: "C1" },
    { name: "B", role: "R2", city: "C2" },
    { name: "C", role: "R3", city: "C3" }
  ];

  const target = {
    innerHTML: "stale",
    insertAdjacentHTML(_position, html) {
      this.innerHTML += html;
    }
  };

  let scheduleCount = 0;
  await renderRowsChunked(rows, target, {
    chunkSize: 2,
    schedule: async () => {
      scheduleCount += 1;
    }
  });

  assert.equal(scheduleCount, 2);
  assert.match(target.innerHTML, /<td>A<\/td>/);
  assert.match(target.innerHTML, /<td>C<\/td>/);

  const cancelledTarget = {
    innerHTML: "",
    insertAdjacentHTML(_position, html) {
      this.innerHTML += html;
    }
  };

  let cancelled = false;
  await renderRowsChunked(rows, cancelledTarget, {
    chunkSize: 1,
    schedule: async () => {
      cancelled = true;
    },
    isCancelled: () => cancelled
  });

  assert.match(cancelledTarget.innerHTML, /<td>A<\/td>/);
  assert.doesNotMatch(cancelledTarget.innerHTML, /<td>B<\/td>/);
});
