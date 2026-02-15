import test from "node:test";
import assert from "node:assert/strict";
import { initCsvUpload, setProcessButtonState, validateCsvFile } from "../src/upload.js";

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
  assert.equal(result.message, "Unsupported file type. Upload a .csv file (UTF-8 text).");
});

test("validateCsvFile rejects text/plain when extension is not csv", () => {
  const result = validateCsvFile({
    name: "notes.txt",
    type: "text/plain",
    size: 18
  });

  assert.equal(result.valid, false);
  assert.equal(result.message, "Unsupported file type. Upload a .csv file (UTF-8 text).");
});

test("validateCsvFile rejects empty csv files", () => {
  const result = validateCsvFile({
    name: "empty.csv",
    type: "text/csv",
    size: 0
  });

  assert.equal(result.valid, false);
  assert.equal(result.message, "The selected CSV file is empty. Add at least one header row and one data row.");
});

test("setProcessButtonState syncs disabled property and attribute", () => {
  const button = {
    disabled: false,
    attrs: new Set(),
    toggleAttribute(name, force) {
      if (force) {
        this.attrs.add(name);
        return true;
      }

      this.attrs.delete(name);
      return false;
    }
  };

  setProcessButtonState(button, false);
  assert.equal(button.disabled, true);
  assert.equal(button.attrs.has("disabled"), true);

  setProcessButtonState(button, true);
  assert.equal(button.disabled, false);
  assert.equal(button.attrs.has("disabled"), false);
});

test("initCsvUpload enables process button for valid files and disables for invalid", () => {
  let onChange;
  const input = {
    files: [],
    addEventListener: (eventName, handler) => {
      if (eventName === "change") {
        onChange = handler;
      }
    }
  };
  const status = { textContent: "", dataset: {} };
  const processButton = {
    disabled: false,
    attrs: new Set(),
    toggleAttribute(name, force) {
      if (force) {
        this.attrs.add(name);
      } else {
        this.attrs.delete(name);
      }
    }
  };

  initCsvUpload({ input, status, processButton });

  assert.equal(processButton.disabled, true);
  assert.equal(processButton.attrs.has("disabled"), true);

  const validFiles = [{ name: "assessmentRuns (1).csv", type: "", size: 48 }];
  input.files = validFiles;
  onChange({ target: { files: validFiles } });

  assert.equal(processButton.disabled, false);
  assert.equal(processButton.attrs.has("disabled"), false);
  assert.equal(status.dataset.state, "success");

  const invalidFiles = [{ name: "empty.csv", type: "text/csv", size: 0 }];
  input.files = invalidFiles;
  onChange({ target: { files: invalidFiles } });

  assert.equal(processButton.disabled, true);
  assert.equal(processButton.attrs.has("disabled"), true);
  assert.equal(status.dataset.state, "error");
});
