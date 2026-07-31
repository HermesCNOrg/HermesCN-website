import { rm } from "node:fs/promises";
import { resolve } from "node:path";

const cacheDirectories = [
  ".next/cache",
  "docs-site/node_modules/.cache",
  "docs-site/.docusaurus/production",
];

await Promise.all(
  cacheDirectories.map((directory) =>
    rm(resolve(directory), { force: true, recursive: true }),
  ),
);

console.log("Removed regenerable build caches");
