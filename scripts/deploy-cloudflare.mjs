import { execFileSync } from "node:child_process";
import { access, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const projectRoot = path.resolve(import.meta.dirname, "..");
const backupRoot = "/mnt/data/artifacts/hermescn";
const expectedUuid = "a5046901-0837-4ae1-8ddf-694d208c4018";
const publicRoutes = [
  "https://hermescn.org/skills",
  "https://hermescn.org/docs/",
  "https://hermescn.org/sitemap.xml",
];

function run(command, args, options = {}) {
  console.log(`> ${command} ${args.join(" ")}`);
  return execFileSync(command, args, {
    cwd: projectRoot,
    encoding: "utf8",
    stdio: options.capture ? "pipe" : "inherit",
    env: {
      ...process.env,
      SKIP_ENV_VALIDATION: "1",
      ...options.env,
    },
  });
}

function verifyDataDisk() {
  const uuid = run(
    "findmnt",
    ["-n", "-o", "UUID", "-T", "/mnt/hermes-backups"],
    { capture: true },
  ).trim();
  if (uuid !== expectedUuid) {
    throw new Error(
      "The Hermes data disk is not mounted at the expected UUID.",
    );
  }
}

function verifyCleanWorktree() {
  const status = run("git", ["status", "--porcelain"], { capture: true });
  if (status.trim()) {
    throw new Error("Refusing production deployment from a dirty worktree.");
  }
}

function verifyPublicRoutes() {
  const cacheBust = Date.now();
  for (const route of publicRoutes) {
    const separator = route.includes("?") ? "&" : "?";
    const status = run(
      "curl",
      [
        "--compressed",
        "--fail-with-body",
        "--silent",
        "--show-error",
        "--output",
        "/dev/null",
        "--write-out",
        "%{http_code}",
        `${route}${separator}deploy=${cacheBust}`,
      ],
      { capture: true },
    ).trim();
    if (status !== "200") throw new Error(`${route} returned ${status}`);
    console.log(`Verified ${route}: ${status}`);
  }
}

verifyCleanWorktree();
verifyDataDisk();

if (process.env.CLOUDFLARE_API_TOKEN === undefined) {
  throw new Error(
    "CLOUDFLARE_API_TOKEN must be available to the deploy process.",
  );
}

run("pnpm", ["install", "--frozen-lockfile"]);
run("node", ["scripts/check-public-routes.mjs"]);
run("node", ["scripts/check-deployment-workflow.mjs"]);
run("pnpm", ["exec", "tsc", "--noEmit"]);
run("pnpm", ["exec", "opennextjs-cloudflare", "build"]);
run("pnpm", ["exec", "opennextjs-cloudflare", "deploy"]);
verifyPublicRoutes();

const shortSha = run("git", ["rev-parse", "--short", "HEAD"], {
  capture: true,
}).trim();
await mkdir(backupRoot, { recursive: true });
const artifact = path.join(backupRoot, `open-next-${shortSha}.tar.gz`);
const temporaryArtifact = `${artifact}.tmp`;
await rm(temporaryArtifact, { force: true });
run("tar", ["-C", projectRoot, "-czf", temporaryArtifact, ".open-next"]);
await access(temporaryArtifact);
run("mv", [temporaryArtifact, artifact]);
await access(artifact);

run("node", ["scripts/clean-after-deploy.mjs"], {
  env: {
    HERMESCN_DEPLOY_VERIFIED: "1",
    HERMESCN_ROLLBACK_ARTIFACT: artifact,
  },
});
