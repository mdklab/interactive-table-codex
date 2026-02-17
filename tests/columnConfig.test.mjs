import test from "node:test";
import assert from "node:assert/strict";
import { normalizeColumns, renderRowCells } from "../src/columnConfig.js";

test("normalizeColumns keeps valid columns, applies defaults, and sorts by order", () => {
  const normalized = normalizeColumns([
    null,
    { key: "city", order: 2 },
    { key: "name", order: 0 },
    { key: "role", order: 1, visible: false },
    { key: "" }
  ]);

  assert.deepEqual(
    normalized.map(({ key, order, visible }) => ({ key, order, visible })),
    [
      { key: "name", order: 0, visible: true },
      { key: "city", order: 2, visible: true }
    ]
  );
});

test("normalizeColumns preserves insertion order when order is missing", () => {
  const normalized = normalizeColumns([{ key: "name" }, { key: "role" }, { key: "city" }]);

  assert.deepEqual(
    normalized.map(({ key, order }) => ({ key, order })),
    [
      { key: "name", order: 0 },
      { key: "role", order: 1 },
      { key: "city", order: 2 }
    ]
  );
});

test("renderRowCells supports value mapping, formatting, and renderer contracts", () => {
  const row = { name: "Ari", role: "engineer", city: "Seattle" };

  const cells = renderRowCells(
    [
      { key: "name", renderer: (value) => `<strong>${value}</strong>` },
      {
        key: "role",
        value: (record) => record.role,
        formatter: (value) => value.toUpperCase(),
        renderer: (value) => `Role: ${value}`
      }
    ],
    row
  );

  assert.deepEqual(cells, [
    { key: "name", content: "<strong>Ari</strong>" },
    { key: "role", content: "Role: ENGINEER" }
  ]);
});

test("renderRowCells falls back to safe string conversion for invalid renderer output", () => {
  const row = { name: "Ari", role: null, city: "Seattle" };

  const cells = renderRowCells(
    [
      { key: "name", renderer: () => 42 },
      { key: "role" },
      { key: "city", visible: false }
    ],
    row
  );

  assert.deepEqual(cells, [
    { key: "name", content: "42" },
    { key: "role", content: "" }
  ]);
});
