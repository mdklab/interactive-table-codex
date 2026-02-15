import { initCsvUpload } from "./upload.js";
import { SORT_DIRECTIONS, toggleSort } from "./sort.js";
import { filterRows, sortFilteredRows } from "./tablePerformance.js";

const people = [
  { name: "Ari", role: "Engineer", city: "Seattle" },
  { name: "Bea", role: "Designer", city: "Austin" },
  { name: "Cam", role: "PM", city: "Boston" },
  { name: "Dia", role: "Engineer", city: "Chicago" }
];

const COLUMNS = ["name", "role", "city"];

const state = {
  sort: { column: null, direction: SORT_DIRECTIONS.NONE },
  filters: { name: "", role: "", city: "" }
};

export const applyColumnFilters = (rows, filters) => filterRows(rows, filters);

export const getVisibleRows = (rows, filters, sort) => sortFilteredRows(applyColumnFilters(rows, filters), sort);

export const renderRows = (rows, target) => {
  target.innerHTML = rows
    .map((row) => `<tr><td>${row.name}</td><td>${row.role}</td><td>${row.city}</td></tr>`)
    .join("");
};

const SORT_SYMBOLS = {
  [SORT_DIRECTIONS.NONE]: "↕",
  [SORT_DIRECTIONS.ASC]: "▲",
  [SORT_DIRECTIONS.DESC]: "▼"
};

const renderSortControls = (buttons, sortState) => {
  buttons.forEach((button) => {
    const column = button.dataset.sortColumn;
    const isActiveColumn = sortState.column === column;
    const direction = isActiveColumn ? sortState.direction : SORT_DIRECTIONS.NONE;
    const symbol = SORT_SYMBOLS[direction];

    button.textContent = `${button.dataset.label} ${symbol}`;
    button.setAttribute(
      "aria-label",
      `${button.dataset.label} sorting ${direction === SORT_DIRECTIONS.NONE ? "off" : direction}`
    );
  });
};

const resetFilters = (filterInputs) => {
  COLUMNS.forEach((column) => {
    state.filters[column] = "";
    filterInputs[column].value = "";
  });
};

const init = () => {
  if (typeof document === "undefined") {
    return;
  }

  const tableBody = document.querySelector("#tableBody");
  const sortButtons = [...document.querySelectorAll("[data-sort-column]")];
  const filterInputs = Object.fromEntries(
    COLUMNS.map((column) => [column, document.querySelector(`[data-filter-column='${column}']`)])
  );
  const clearButtons = Object.fromEntries(
    COLUMNS.map((column) => [column, document.querySelector(`[data-clear-filter='${column}']`)])
  );
  const clearAllFilters = document.querySelector("#clearAllFilters");
  const csvUpload = document.querySelector("#csvUpload");
  const uploadStatus = document.querySelector("#uploadStatus");

  if (
    !tableBody ||
    sortButtons.length === 0 ||
    !clearAllFilters ||
    Object.values(filterInputs).some((input) => !input) ||
    Object.values(clearButtons).some((button) => !button)
  ) {
    return;
  }

  const refresh = () => {
    renderRows(getVisibleRows(people, state.filters, state.sort), tableBody);
    renderSortControls(sortButtons, state.sort);
  };

  COLUMNS.forEach((column) => {
    filterInputs[column].addEventListener("input", (event) => {
      state.filters[column] = event.target.value;
      refresh();
    });

    clearButtons[column].addEventListener("click", () => {
      state.filters[column] = "";
      filterInputs[column].value = "";
      refresh();
    });
  });

  clearAllFilters.addEventListener("click", () => {
    state.sort = { column: null, direction: SORT_DIRECTIONS.NONE };
    resetFilters(filterInputs);
    refresh();
  });

  sortButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.sort = toggleSort(state.sort, button.dataset.sortColumn);
      refresh();
    });
  });

  initCsvUpload({ input: csvUpload, status: uploadStatus });

  refresh();
};

init();
