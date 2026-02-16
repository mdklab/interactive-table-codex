import test from "node:test";
import assert from "node:assert/strict";
import { getVisibleRows, renderRowsChunked } from "../src/main.js";
import { SORT_DIRECTIONS } from "../src/sort.js";
import { buildPeopleRows } from "./fixtures.mjs";

const buildRows = (count) =>
  buildPeopleRows({ count, seed: 61 }).map((row, index) => ({
    ...row,
    name: `Person ${String(count - index).padStart(5, "0")}`,
    role: index % 2 === 0 ? "Engineer" : "Designer",
    city: index % 3 === 0 ? "Austin" : "Seattle"
  }));

test("getVisibleRows handles 10,000-row filter + sort correctly", () => {
  const rows = buildRows(10_000);
  const filters = { name: "person 0", role: "engineer", city: "austin" };
  const sort = { column: "name", direction: SORT_DIRECTIONS.ASC };

  const visible = getVisibleRows(rows, filters, sort);

  assert.equal(visible.length, 1666);
  assert.ok(visible.every((row) => row.role === "Engineer"));
  assert.ok(visible.every((row) => row.city === "Austin"));
  assert.equal(visible[0].name, "Person 00004");
  assert.equal(visible.at(-1).name, "Person 09994");
});

test("renderRowsChunked yields in multiple chunks for large datasets", async () => {
  const rows = buildRows(600);
  const target = {
    innerHTML: "placeholder",
    insertAdjacentHTML(position, value) {
      assert.equal(position, "beforeend");
      this.innerHTML += value;
    }
  };

  let ticks = 0;
  await renderRowsChunked(rows, target, {
    chunkSize: 200,
    schedule: async () => {
      ticks += 1;
    }
  });

  assert.equal(ticks, 3);
  assert.equal((target.innerHTML.match(/<tr>/g) ?? []).length, 600);
});
