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

const files = await walk("src");
const offenders = [];
for (const file of files) {
  const text = await readFile(file, "utf8");
  if (!text.endsWith("\n")) offenders.push(`${file}: missing trailing newline`);
}

if (offenders.length) {
  console.error(offenders.join("\n"));
  process.exit(1);
}
