import { sortRows } from "./sort.js";

export const filterRows = (rows, filters) => {
  const activeFilters = Object.entries(filters)
    .map(([column, query]) => [column, query.trim().toLowerCase()])
    .filter(([, query]) => query.length > 0);

  if (activeFilters.length === 0) {
    return [...rows];
  }

  return rows.filter((row) =>
    activeFilters.every(([column, query]) => String(row[column] ?? "").toLowerCase().includes(query))
  );
};

export const sortFilteredRows = (rows, sortState) => sortRows(rows, sortState);

export const getVisibleRange = ({
  totalRows,
  rowHeight,
  scrollTop,
  viewportHeight,
  overscan = 5
}) => {
  if (totalRows <= 0 || rowHeight <= 0 || viewportHeight <= 0) {
    return { start: 0, end: 0 };
  }

  const firstVisible = Math.floor(scrollTop / rowHeight);
  const clampedFirstVisible = Math.min(Math.max(totalRows - 1, 0), Math.max(firstVisible, 0));
  const visibleCount = Math.ceil(viewportHeight/rowHeight);
  const start = Math.max(0, clampedFirstVisible - overscan);
  const end = Math.min(totalRows, clampedFirstVisible + visibleCount + overscan);

  return { start, end };
};

export const chunkRows = async ({ rows, chunkSize = 500, onChunk, yieldToMain = () => Promise.resolve() }) => {
  if (chunkSize <= 0) {
    throw new Error("chunkSize must be greater than zero");
  }

  for (let index = 0; index < rows.length; index += chunkSize) {
    const chunk = rows.slice(index, index + chunkSize);
    onChunk(chunk, index / chunkSize);
    await yieldToMain();
  }
};
