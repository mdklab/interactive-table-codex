import test from "node:test";
import assert from "node:assert/strict";
import { buildAccessibleTableHTML } from "../src/tableRenderer.js";

test("buildAccessibleTableHTML renders loading state with live region", () => {
  const html = buildAccessibleTableHTML({ status: "loading" });
  assert.match(html, /role="status"/);
  assert.match(html, /aria-live="polite"/);
});

test("buildAccessibleTableHTML renders parse error state as alert", () => {
  const html = buildAccessibleTableHTML({ status: "error", errorMessage: "Invalid CSV" });
  assert.match(html, /role="alert"/);
  assert.match(html, /Invalid CSV/);
});

test("buildAccessibleTableHTML renders empty-data state", () => {
  const html = buildAccessibleTableHTML({ status: "ready", headers: ["Name"], rows: [] });
  assert.match(html, /No data available to display/);
});

test("buildAccessibleTableHTML renders semantic table from parser output", () => {
  const html = buildAccessibleTableHTML({
    status: "ready",
    headers: ["Name", "City"],
    rows: [
      ["Ari", "Seattle"],
      ["Bea", "Austin"]
    ]
  });

  assert.match(html, /<caption>Uploaded data preview<\/caption>/);
  assert.equal((html.match(/<th scope="col">/g) ?? []).length, 2);
  assert.equal((html.match(/<tr>/g) ?? []).length, 3);
  assert.equal((html.match(/<td>/g) ?? []).length, 4);
});
