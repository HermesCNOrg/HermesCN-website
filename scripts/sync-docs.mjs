import { cp, mkdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const source = resolve("docs-site/build");
const target = resolve("public/docs");

if (!existsSync(source)) {
  console.error(
    "docs-site/build does not exist. Run `pnpm docs:build` first.",
  );
  process.exit(1);
}

await rm(target, { force: true, recursive: true });
await mkdir(target, { recursive: true });
await cp(source, target, { recursive: true });
await rm(source, { force: true, recursive: true });

console.log(`Synced Docusaurus build to ${target} and removed the source copy`);
