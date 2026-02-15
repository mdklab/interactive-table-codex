import { initCsvUpload } from "./upload.js";

const people = [
  { name: "Ari", role: "Engineer", city: "Seattle" },
  { name: "Bea", role: "Designer", city: "Austin" },
  { name: "Cam", role: "PM", city: "Boston" },
  { name: "Dia", role: "Engineer", city: "Chicago" }
];

const state = {
  sortBy: "name",
  query: ""
};

export const getVisibleRows = (rows, query, sortBy) =>
  rows
    .filter((row) => {
      const haystack = `${row.name} ${row.city}`.toLowerCase();
      return haystack.includes(query.trim().toLowerCase());
    })
    .toSorted((a, b) => a[sortBy].localeCompare(b[sortBy]));

export const renderRows = (rows, target) => {
  target.innerHTML = rows
    .map((row) => `<tr><td>${row.name}</td><td>${row.role}</td><td>${row.city}</td></tr>`)
    .join("");
};

const init = () => {
  if (typeof document === "undefined") {
    return;
  }

  const tableBody = document.querySelector("#tableBody");
  const search = document.querySelector("#search");
  const sortName = document.querySelector("#sortName");
  const sortCity = document.querySelector("#sortCity");
  const csvUpload = document.querySelector("#csvUpload");
  const uploadStatus = document.querySelector("#uploadStatus");

  if (!tableBody || !search || !sortName || !sortCity) {
    return;
  }

  const refresh = () => renderRows(getVisibleRows(people, state.query, state.sortBy), tableBody);

  search.addEventListener("input", (event) => {
    state.query = event.target.value;
    refresh();
  });

  sortName.addEventListener("click", () => {
    state.sortBy = "name";
    refresh();
  });

  sortCity.addEventListener("click", () => {
    state.sortBy = "city";
    refresh();
  });

  initCsvUpload({ input: csvUpload, status: uploadStatus });

  refresh();
};

init();
