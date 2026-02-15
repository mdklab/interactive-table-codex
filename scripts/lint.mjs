import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const walk = async (dir) => {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) return walk(path);
      return path;
    })
  );
  return files.flat();
};

const files = (await walk("src")).filter((file) => file.endsWith(".js") || file.endsWith(".html"));
const violations = [];

for (const file of files) {
  const text = await readFile(file, "utf8");
  if (text.includes("\t")) {
    violations.push(`${file}: contains tab characters`);
  }
  if (text.includes("console.log(")) {
    violations.push(`${file}: contains console.log`);
  }
}

if (violations.length) {
  console.error(violations.join("\n"));
  process.exit(1);
}
