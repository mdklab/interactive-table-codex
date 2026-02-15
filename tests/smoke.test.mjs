import test from "node:test";
import assert from "node:assert/strict";
import { applyColumnFilters, getVisibleRows } from "../src/main.js";
import { SORT_DIRECTIONS } from "../src/sort.js";

const rows = [
  { name: "Yui", role: "Engineer", city: "Denver" },
  { name: "Ana", role: "PM", city: "Austin" },
  { name: "Ben", role: "Engineer", city: "Austin" }
];

test("applyColumnFilters supports single and multi-column filtering", () => {
  const single = applyColumnFilters(rows, { name: "", role: "engine", city: "" });
  const composed = applyColumnFilters(rows, { name: "b", role: "engine", city: "austin" });

  assert.deepEqual(
    single.map((row) => row.name),
    ["Yui", "Ben"]
  );
  assert.deepEqual(
    composed.map((row) => row.name),
    ["Ben"]
  );
});

test("getVisibleRows composes filtering with sorting and clears when filters reset", () => {
  const filteredAndSorted = getVisibleRows(
    rows,
    { name: "", role: "", city: "austin" },
    { column: "name", direction: SORT_DIRECTIONS.DESC }
  );
  const resetFilters = getVisibleRows(
    rows,
    { name: "", role: "", city: "" },
    { column: null, direction: SORT_DIRECTIONS.NONE }
  );

  assert.deepEqual(
    filteredAndSorted.map((row) => row.name),
    ["Ben", "Ana"]
  );
  assert.equal(resetFilters.length, rows.length);
});
