import { initCsvUpload } from "./upload.js";
import { SORT_DIRECTIONS, sortRows, toggleSort } from "./sort.js";

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


const DEFAULT_RENDER_CHUNK_SIZE = 250;

export const applyColumnFilters = (rows, filters) =>
  rows.filter((row) =>
    Object.entries(filters).every(([column, query]) => {
      const normalizedQuery = query.trim().toLowerCase();
      if (!normalizedQuery) {
        return true;
      }

      return String(row[column] ?? "").toLowerCase().includes(normalizedQuery);
    })
  );

let memoizedInput = null;
let memoizedFilters = null;
let memoizedSort = null;
let memoizedResult = [];

export const getVisibleRows = (rows, filters, sort) => {
  if (memoizedInput === rows && memoizedFilters === filters && memoizedSort === sort) {
    return memoizedResult;
  }

  memoizedInput = rows;
  memoizedFilters = filters;
  memoizedSort = sort;
  memoizedResult = sortRows(applyColumnFilters(rows, filters), sort);

  return memoizedResult;
};

const renderRowHtml = (row) => `<tr><td>${row.name}</td><td>${row.role}</td><td>${row.city}</td></tr>`;

export const renderRows = (rows, target) => {
  target.innerHTML = rows.map(renderRowHtml).join("");
};

const nextPaint =
  typeof window !== "undefined" && typeof window.requestAnimationFrame === "function"
    ? () => new Promise((resolve) => window.requestAnimationFrame(() => resolve()))
    : () => Promise.resolve();

export const renderRowsChunked = async (
  rows,
  target,
  { chunkSize = DEFAULT_RENDER_CHUNK_SIZE, schedule = nextPaint, isCancelled = () => false } = {}
) => {
  target.innerHTML = "";

  for (let index = 0; index < rows.length; index += chunkSize) {
    if (isCancelled()) {
      return;
    }

    target.insertAdjacentHTML("beforeend", rows.slice(index, index + chunkSize).map(renderRowHtml).join(""));
    await schedule();
  }
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
  const processCsv = document.querySelector("#processCsv");

  if (
    !tableBody ||
    sortButtons.length === 0 ||
    !clearAllFilters ||
    Object.values(filterInputs).some((input) => !input) ||
    Object.values(clearButtons).some((button) => !button) ||
    !processCsv
  ) {
    return;
  }

  let renderToken = 0;

  const refresh = () => {
    const visibleRows = getVisibleRows(people, state.filters, state.sort);
    renderSortControls(sortButtons, state.sort);

    renderToken += 1;
    const token = renderToken;

    return renderRowsChunked(visibleRows, tableBody, {
      isCancelled: () => token !== renderToken
    });
  };

  COLUMNS.forEach((column) => {
    filterInputs[column].addEventListener("input", (event) => {
      state.filters[column] = event.target.value;
      void refresh();
    });

    clearButtons[column].addEventListener("click", () => {
      state.filters[column] = "";
      filterInputs[column].value = "";
      void refresh();
    });
  });

  clearAllFilters.addEventListener("click", () => {
    state.sort = { column: null, direction: SORT_DIRECTIONS.NONE };
    resetFilters(filterInputs);
    void refresh();
  });

  sortButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.sort = toggleSort(state.sort, button.dataset.sortColumn);
      void refresh();
    });
  });

  initCsvUpload({ input: csvUpload, status: uploadStatus, processButton: processCsv });

  void refresh();
};

init();
