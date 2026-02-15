import test from "node:test";
import assert from "node:assert/strict";
import { validateCsvFile } from "../src/upload.js";

test("validateCsvFile accepts csv by extension", () => {
  const result = validateCsvFile({
    name: "people.csv",
    type: "application/octet-stream",
    size: 32
  });

  assert.equal(result.valid, true);
  assert.match(result.message, /Ready to process people\.csv\./);
});

test("validateCsvFile rejects non-csv file types", () => {
  const result = validateCsvFile({
    name: "people.json",
    type: "application/json",
    size: 12
  });

  assert.equal(result.valid, false);
  assert.equal(result.message, "Invalid file type. Please upload a .csv file.");
});

test("validateCsvFile rejects empty csv files", () => {
  const result = validateCsvFile({
    name: "empty.csv",
    type: "text/csv",
    size: 0
  });

  assert.equal(result.valid, false);
  assert.equal(result.message, "The selected CSV file is empty. Please choose a file with data.");
});
