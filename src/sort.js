export const SORT_DIRECTIONS = {
  NONE: "none",
  ASC: "asc",
  DESC: "desc"
};

const nextDirection = {
  [SORT_DIRECTIONS.NONE]: SORT_DIRECTIONS.ASC,
  [SORT_DIRECTIONS.ASC]: SORT_DIRECTIONS.DESC,
  [SORT_DIRECTIONS.DESC]: SORT_DIRECTIONS.NONE
};

export const toggleSort = (currentSort, column) => {
  if (currentSort.column !== column) {
    return { column, direction: SORT_DIRECTIONS.ASC };
  }

  const direction = nextDirection[currentSort.direction] ?? SORT_DIRECTIONS.NONE;
  return direction === SORT_DIRECTIONS.NONE
    ? { column: null, direction: SORT_DIRECTIONS.NONE }
    : { column, direction };
};

const compareValues = (left, right) => {
  if (typeof left === "number" && typeof right === "number") {
    return left - right;
  }

  return String(left).localeCompare(String(right));
};

export const sortRows = (rows, sortState) => {
  if (!sortState.column || sortState.direction === SORT_DIRECTIONS.NONE) {
    return [...rows];
  }

  const directionMultiplier = sortState.direction === SORT_DIRECTIONS.DESC ? -1 : 1;

  return rows
    .map((row, index) => ({ row, index }))
    .sort((left, right) => {
      const comparison = compareValues(left.row[sortState.column], right.row[sortState.column]);
      if (comparison !== 0) {
        return comparison * directionMultiplier;
      }

      return left.index - right.index;
    })
    .map((entry) => entry.row);
};
