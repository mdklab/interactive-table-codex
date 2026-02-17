const DEFAULT_RENDERER = (value) => (value == null ? "" : String(value));

const defaultColumn = {
  visible: true,
  formatter: (value) => value,
  renderer: DEFAULT_RENDERER
};

const resolveCallback = (candidate, fallback) =>
  typeof candidate === "function" ? candidate : fallback;

export const normalizeColumns = (columns = []) =>
  columns
    .filter((column) => column && typeof column.key === "string" && column.key.length > 0)
    .map((column, index) => ({
      ...defaultColumn,
      ...column,
      order: Number.isFinite(column.order) ? column.order : index
    }))
    .sort((left, right) => left.order - right.order)
    .filter((column) => column.visible);

const renderCellValue = (column, row) => {
  const formatter = resolveCallback(column.formatter, defaultColumn.formatter);
  const renderer = resolveCallback(column.renderer, defaultColumn.renderer);
  const mapped = column.value ? column.value(row) : row[column.key];
  const formatted = formatter(mapped, row);
  const rendered = renderer(formatted, row);

  return typeof rendered === "string" ? rendered : DEFAULT_RENDERER(rendered);
};

export const renderRowCells = (columns, row) =>
  normalizeColumns(columns).map((column) => ({
    key: column.key,
    content: renderCellValue(column, row)
  }));
