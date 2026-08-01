import { access, rm } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const projectRoot = path.resolve(import.meta.dirname, "..");
const removable = [
  "node_modules",
  ".next",
  ".open-next",
  "public/docs",
  "docs-site/.docusaurus",
];

if (process.env.HERMESCN_DEPLOY_VERIFIED !== "1") {
  throw new Error(
    "Refusing cleanup before a successful deployment and live verification.",
  );
}

if (process.env.HERMESCN_ROLLBACK_ARTIFACT) {
  await access(process.env.HERMESCN_ROLLBACK_ARTIFACT);
} else {
  throw new Error("Refusing cleanup without a verified rollback artifact.");
}

for (const relativePath of removable) {
  await rm(path.join(projectRoot, relativePath), {
    recursive: true,
    force: true,
  });
  console.log(`Removed ${relativePath}`);
}
