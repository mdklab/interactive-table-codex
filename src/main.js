import { initCsvUpload } from "./upload.js";
import { SORT_DIRECTIONS, sortRows, toggleSort } from "./sort.js";

const people = [
  { name: "Ari", role: "Engineer", city: "Seattle" },
  { name: "Bea", role: "Designer", city: "Austin" },
  { name: "Cam", role: "PM", city: "Boston" },
  { name: "Dia", role: "Engineer", city: "Chicago" }
];

const state = {
  sort: { column: null, direction: SORT_DIRECTIONS.NONE },
  query: ""
};

export const getVisibleRows = (rows, query, sort) => {
  const filteredRows = rows.filter((row) => {
    const haystack = `${row.name} ${row.city}`.toLowerCase();
    return haystack.includes(query.trim().toLowerCase());
  });

  return sortRows(filteredRows, sort);
};

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

const init = () => {
  if (typeof document === "undefined") {
    return;
  }

  const tableBody = document.querySelector("#tableBody");
  const search = document.querySelector("#search");
  const sortButtons = [...document.querySelectorAll("[data-sort-column]")];
  const csvUpload = document.querySelector("#csvUpload");
  const uploadStatus = document.querySelector("#uploadStatus");

  if (!tableBody || !search || sortButtons.length === 0) {
    return;
  }

  const refresh = () => {
    renderRows(getVisibleRows(people, state.query, state.sort), tableBody);
    renderSortControls(sortButtons, state.sort);
  };

  search.addEventListener("input", (event) => {
    state.query = event.target.value;
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
