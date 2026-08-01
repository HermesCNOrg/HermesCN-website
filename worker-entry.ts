// @ts-nocheck -- OpenNext generates these imports after the Next.js build phase.
import openNextWorker from "./.open-next/worker.js";
import { syncSkillsCatalog, type SkillsSyncEnv } from "./src/lib/skills-sync";

export { DOQueueHandler } from "./.open-next/.build/durable-objects/queue.js";
export { DOShardedTagCache } from "./.open-next/.build/durable-objects/sharded-tag-cache.js";
export { BucketCachePurge } from "./.open-next/.build/durable-objects/bucket-cache-purge.js";

export default {
  fetch: openNextWorker.fetch,
  async scheduled(
    _controller: unknown,
    env: SkillsSyncEnv,
    ctx: { waitUntil(promise: Promise<unknown>): void },
  ) {
    ctx.waitUntil(syncSkillsCatalog(env));
  },
};
