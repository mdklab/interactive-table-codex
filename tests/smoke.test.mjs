import test from "node:test";
import assert from "node:assert/strict";
import { getVisibleRows } from "../src/main.js";

test("getVisibleRows filters by query and sorts by city", () => {
  const rows = [
    { name: "Yui", role: "Engineer", city: "Denver" },
    { name: "Ana", role: "PM", city: "Austin" }
  ];

  const result = getVisibleRows(rows, "", "city");
  assert.equal(result[0].city, "Austin");
});
