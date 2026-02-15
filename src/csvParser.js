const decoder = new TextDecoder("utf-8", { fatal: true });

const parseCsvLine = (line) => {
  const cells = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];

    if (char === '"') {
      const nextChar = line[i + 1];
      if (inQuotes && nextChar === '"') {
        current += '"';
        i += 1;
        continue;
      }
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      cells.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  if (inQuotes) {
    return { ok: false, code: "malformed_csv", message: "Unclosed quoted field detected." };
  }

  cells.push(current);
  return { ok: true, cells };
};

const decodeInput = (input) => {
  if (typeof input === "string") {
    return { ok: true, text: input };
  }

  if (input instanceof Uint8Array) {
    try {
      return { ok: true, text: decoder.decode(input) };
    } catch {
      return {
        ok: false,
        error: {
          code: "invalid_encoding",
          message: "Input bytes are not valid UTF-8."
        }
      };
    }
  }

  return {
    ok: false,
    error: {
      code: "invalid_input",
      message: "CSV input must be a string or Uint8Array."
    }
  };
};

export const parseCsv = (input) => {
  const decoded = decodeInput(input);
  if (!decoded.ok) {
    return decoded;
  }

  const normalized = decoded.text.replaceAll("\r\n", "\n").replaceAll("\r", "\n");
  const lines = normalized.split("\n").filter((line) => line.trim() !== "");

  if (!lines.length) {
    return {
      ok: false,
      error: {
        code: "empty_input",
        message: "CSV content is empty after removing blank lines."
      }
    };
  }

  const headerResult = parseCsvLine(lines[0]);
  if (!headerResult.ok) {
    return { ok: false, error: headerResult };
  }

  const headers = headerResult.cells;
  const rows = [];

  for (let index = 1; index < lines.length; index += 1) {
    const lineResult = parseCsvLine(lines[index]);

    if (!lineResult.ok) {
      return {
        ok: false,
        error: {
          ...lineResult,
          message: `Line ${index + 1}: ${lineResult.message}`
        }
      };
    }

    if (lineResult.cells.length !== headers.length) {
      return {
        ok: false,
        error: {
          code: "column_mismatch",
          message: `Line ${index + 1}: expected ${headers.length} columns but found ${lineResult.cells.length}.`
        }
      };
    }

    rows.push(lineResult.cells);
  }

  return { ok: true, headers, rows };
};
