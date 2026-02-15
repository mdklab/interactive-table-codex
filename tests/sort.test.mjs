import test from "node:test";
import assert from "node:assert/strict";
import { SORT_DIRECTIONS, sortRows, toggleSort } from "../src/sort.js";

test("sortRows sorts numeric values ascending and descending", () => {
  const rows = [{ score: 2 }, { score: 10 }, { score: 1 }];

  const asc = sortRows(rows, { column: "score", direction: SORT_DIRECTIONS.ASC });
  const desc = sortRows(rows, { column: "score", direction: SORT_DIRECTIONS.DESC });

  assert.deepEqual(
    asc.map((row) => row.score),
    [1, 2, 10]
  );
  assert.deepEqual(
    desc.map((row) => row.score),
    [10, 2, 1]
  );
});

test("sortRows is stable and does not mutate source data", () => {
  const rows = [
    { name: "Ari", city: "Austin" },
    { name: "Bea", city: "Austin" },
    { name: "Cam", city: "Boston" }
  ];

  const sorted = sortRows(rows, { column: "city", direction: SORT_DIRECTIONS.ASC });

  assert.deepEqual(
    sorted.map((row) => row.name),
    ["Ari", "Bea", "Cam"]
  );
  assert.notEqual(sorted, rows);
});

test("toggleSort cycles none -> asc -> desc -> none and resets on new column", () => {
  const start = { column: null, direction: SORT_DIRECTIONS.NONE };
  const asc = toggleSort(start, "name");
  const desc = toggleSort(asc, "name");
  const none = toggleSort(desc, "name");
  const cityAsc = toggleSort(desc, "city");

  assert.deepEqual(asc, { column: "name", direction: SORT_DIRECTIONS.ASC });
  assert.deepEqual(desc, { column: "name", direction: SORT_DIRECTIONS.DESC });
  assert.deepEqual(none, { column: null, direction: SORT_DIRECTIONS.NONE });
  assert.deepEqual(cityAsc, { column: "city", direction: SORT_DIRECTIONS.ASC });
});
