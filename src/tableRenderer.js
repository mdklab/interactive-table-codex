const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const renderDataTable = ({ headers, rows, caption }) => {
  const headingCells = headers.map((header) => `<th scope="col">${escapeHtml(header)}</th>`).join("");
  const bodyRows = rows
    .map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`)
    .join("");

  return [
    '<table aria-label="Parsed CSV data">',
    `  <caption>${escapeHtml(caption)}</caption>`,
    `  <thead><tr>${headingCells}</tr></thead>`,
    `  <tbody>${bodyRows}</tbody>`,
    "</table>"
  ].join("");
};

export const buildAccessibleTableHTML = ({
  status,
  headers = [],
  rows = [],
  caption = "Uploaded data preview",
  errorMessage = "We could not parse the uploaded CSV file."
}) => {
  if (status === "loading") {
    return '<p role="status" aria-live="polite">Loading table data…</p>';
  }

  if (status === "error") {
    return `<p role="alert">${escapeHtml(errorMessage)}</p>`;
  }

  if (!headers.length || !rows.length) {
    return "<p>No data rows to display yet. Upload a CSV file or adjust active filters.</p>";
  }

  return renderDataTable({ headers, rows, caption });
};
