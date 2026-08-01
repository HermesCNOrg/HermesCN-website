import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [packageJson, deployScript] = await Promise.all([
  readFile(new URL("../package.json", import.meta.url), "utf8"),
  readFile(new URL("./deploy-cloudflare.mjs", import.meta.url), "utf8"),
]);

const packageConfig = JSON.parse(packageJson);

assert.equal(
  packageConfig.scripts["deploy:cloudflare"],
  "node scripts/deploy-cloudflare.mjs",
  "the repository must expose its production deployment workflow",
);
assert.equal(
  packageConfig.scripts["clean:after-deploy"],
  "node scripts/clean-after-deploy.mjs",
  "the repository must expose the post-deployment cleanup workflow",
);
assert.match(
  deployScript,
  /run\(["']pnpm["'], \[["']install["'], ["']--frozen-lockfile["']\]\)/,
  "deployment must restore dependencies from the lockfile",
);
assert.match(
  deployScript,
  /["']opennextjs-cloudflare["'], ["']build["']/,
  "deployment must create an OpenNext production artifact",
);
assert.match(
  deployScript,
  /["']opennextjs-cloudflare["'], ["']deploy["']/,
  "deployment must upload the verified artifact to Cloudflare",
);
assert.match(
  deployScript,
  /scripts\/clean-after-deploy\.mjs/,
  "deployment must clean dependencies only after verification",
);
assert.match(
  deployScript,
  /HERMESCN_DEPLOY_VERIFIED:\s*["']1["']/,
  "cleanup must require an explicit successful verification marker",
);
assert.match(
  deployScript,
  /HERMESCN_ROLLBACK_ARTIFACT:\s*artifact/,
  "cleanup must require the rollback artifact created by this deployment",
);
assert.match(
  deployScript,
  /open-next-\$\{shortSha\}\.tar\.gz/,
  "deployment must retain one rollback artifact on the data disk",
);
assert.match(
  deployScript,
  /https:\/\/hermescn\.org\/skills/,
  "deployment must verify the public Skills route",
);
assert.match(
  deployScript,
  /https:\/\/hermescn\.org\/docs\//,
  "deployment must verify the public documentation route",
);
assert.match(
  deployScript,
  /https:\/\/hermescn\.org\/sitemap\.xml/,
  "deployment must verify the public sitemap",
);

console.log("Cloudflare deployment workflow checks passed.");
