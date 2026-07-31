/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import { fileURLToPath } from "node:url";

import "./src/env.js";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));

/** @type {import("next").NextConfig} */
const config = {
  output: process.env.NEXT_OUTPUT === "standalone" ? "standalone" : undefined,
  outputFileTracingRoot: projectRoot,
  turbopack: {
    root: projectRoot,
  },
};

export default config;

if (process.env.NODE_ENV === "development") {
  process.env.WRANGLER_REGISTRY_PATH ??= fileURLToPath(
    new URL(".wrangler/registry", import.meta.url),
  );

  void import("@opennextjs/cloudflare").then((module) =>
    module.initOpenNextCloudflareForDev(),
  );
}
