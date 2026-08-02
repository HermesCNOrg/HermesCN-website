import { createHash } from "node:crypto";
import { access, mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

const projectRoot = process.cwd();
const model = "deepseek-v4-flash";
const endpoint = "https://api.deepseek.com/chat/completions";
const generatedDataDir = path.join(projectRoot, "public", "skills-data");

function parseArguments(argv) {
  const options = {
    batchSize: 50,
    concurrency: 8,
    checkpointEvery: 10,
    dryRun: false,
    input: undefined,
    limit: Infinity,
    output: path.join(
      projectRoot,
      ".cache",
      "hermes-skills",
      "skills.zh-Hans.json",
    ),
    reset: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    const value = argv[index + 1];

    if (argument === "--dry-run" || argument === "--reset") {
      options[argument === "--dry-run" ? "dryRun" : "reset"] = true;
      continue;
    }

    const option = {
      "--batch-size": "batchSize",
      "--checkpoint-every": "checkpointEvery",
      "--concurrency": "concurrency",
      "--input": "input",
      "--limit": "limit",
      "--output": "output",
    }[argument];

    if (!option || value === undefined) {
      throw new Error(`Unknown or incomplete argument: ${argument}`);
    }

    options[option] = ["input", "output"].includes(option)
      ? path.resolve(value)
      : Number(value);
    index += 1;
  }

  for (const option of [
    "batchSize",
    "checkpointEvery",
    "concurrency",
    "limit",
  ]) {
    if (options[option] !== Infinity && !Number.isInteger(options[option])) {
      throw new Error(`${option} must be an integer`);
    }
    if (options[option] <= 0) throw new Error(`${option} must be positive`);
  }

  return options;
}

async function findInput(explicitInput) {
  const candidates = explicitInput
    ? [explicitInput]
    : [
        path.join(projectRoot, "public", "skills-data", "skills.json"),
        path.join(projectRoot, ".cache", "hermes-skills", "skills.json"),
      ];

  for (const candidate of candidates) {
    if (
      await access(candidate).then(
        () => true,
        () => false,
      )
    )
      return candidate;
  }

  throw new Error(`Skills source not found. Checked: ${candidates.join(", ")}`);
}

async function writeAtomic(filePath, value) {
  const temporaryPath = `${filePath}.tmp`;
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(temporaryPath, `${JSON.stringify(value)}\n`);
  await rename(temporaryPath, filePath);
}

async function loadState(outputPath, sourceSha256, reset) {
  if (!reset) {
    const existing = await readFile(outputPath, "utf8").catch(() => undefined);

    if (existing) {
      const state = JSON.parse(existing);
      if (state.sourceSha256 !== sourceSha256) {
        throw new Error(
          "Translation state belongs to a different source. Use --reset to start over.",
        );
      }
      if (!state.translations || Array.isArray(state.translations)) {
        throw new Error(
          "Invalid translation state: translations must be an object",
        );
      }
      return state;
    }

    const manifest = await readFile(
      path.join(generatedDataDir, "manifest.json"),
      "utf8",
    )
      .then(JSON.parse)
      .catch(() => null);

    if (manifest?.sourceSha256 === sourceSha256) {
      const translations = {};
      for (const [chunk] of (manifest.chunks ?? []).entries()) {
        const file = `skills-${String(chunk).padStart(3, "0")}.zh-Hans.json`;
        const rows = await readFile(path.join(generatedDataDir, file), "utf8")
          .then(JSON.parse)
          .catch(() => []);

        for (const [offset, row] of rows.entries()) {
          if (!row) continue;
          translations[chunk * (manifest.chunkSize ?? 1_000) + offset] = {
            description: row[0] ?? "",
            overview: row[1] ?? "",
          };
        }
      }

      if (Object.keys(translations).length > 0) {
        console.log("Restored translation state from generated chunks");
        return {
          version: 1,
          locale: "zh-Hans",
          model,
          sourceSha256,
          updatedAt: new Date().toISOString(),
          translations,
        };
      }
    }
  }

  return {
    version: 1,
    locale: "zh-Hans",
    model,
    sourceSha256,
    updatedAt: new Date().toISOString(),
    translations: {},
  };
}

const systemPrompt = `You are a professional software localization translator.
Translate every description and overview into natural Simplified Chinese.
Preserve Markdown structure and meaning exactly: headings, lists, links and their URLs, images, code fences, inline code, commands, paths, placeholders, variables, HTML, and product names.
Do not translate text inside inline code or fenced code blocks. Do not add explanations or invent Markdown.
Return one JSON object with this shape: {"items":[{"index":0,"description":"...","overview":"..."}]}.
Each input index must appear exactly once. Empty input fields must remain empty strings.`;

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function protectedCodeLiterals(markdown) {
  const fenced = Array.from(
    markdown.matchAll(/```[^\n]*\n([\s\S]*?)```/g),
    (match) => match[1],
  );
  const withoutFences = markdown.replace(/```[^\n]*\n[\s\S]*?```/g, "");
  const inline = Array.from(
    withoutFences.matchAll(/`([^`\n]+)`/g),
    (match) => match[1],
  );

  return [...fenced, ...inline];
}

function preservesCodeLiterals(source, translated) {
  return protectedCodeLiterals(source).every((value) =>
    translated.includes(value),
  );
}

function maskCode(markdown) {
  const values = [];
  const text = markdown.replace(
    /```[^\n]*\n[\s\S]*?```|`[^`\n]+`/g,
    (value) => {
      const placeholder = `__HERMES_CODE_${values.length}__`;
      values.push(value);
      return placeholder;
    },
  );

  return { text, values };
}

function restoreCode(markdown, values) {
  return values.reduce((text, value, index) => {
    const placeholder = `__HERMES_CODE_${index}__`;
    if (!text.includes(placeholder)) {
      throw new Error(`DeepSeek omitted ${placeholder}`);
    }
    return text.replaceAll(placeholder, value);
  }, markdown);
}

async function translateBatch(apiKey, items) {
  let lastError;
  const masks = items.map(({ description, overview }) => ({
    description: maskCode(description),
    overview: maskCode(overview),
  }));
  const requestItems = masks.map((item, index) => ({
    index,
    description: item.description.text,
    overview: item.overview.text,
  }));

  for (let attempt = 1; attempt <= 5; attempt += 1) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          thinking: { type: "disabled" },
          messages: [
            { role: "system", content: systemPrompt },
            {
              role: "user",
              content: `Translate these items and return JSON only:\n${JSON.stringify(requestItems)}`,
            },
          ],
          response_format: { type: "json_object" },
          temperature: 0.2,
          max_tokens: 16_384,
          stream: false,
        }),
      });
      const responseText = await response.text();

      if (!response.ok) {
        const error = new Error(
          `DeepSeek returned ${response.status}: ${responseText}`,
        );
        error.retryable = response.status === 429 || response.status >= 500;
        throw error;
      }

      const payload = JSON.parse(responseText);
      const content = payload.choices?.[0]?.message?.content;
      if (!content) throw new Error("DeepSeek returned empty content");

      const result = JSON.parse(content);
      if (!Array.isArray(result.items)) {
        throw new Error("DeepSeek response does not contain an items array");
      }

      const expected = new Set(requestItems.map((item) => item.index));
      const translated = new Map();

      for (const item of result.items) {
        const sourceItem = items[item.index];
        const mask = masks[item.index];
        if (
          !expected.has(item.index) ||
          typeof item.description !== "string" ||
          typeof item.overview !== "string" ||
          translated.has(item.index) ||
          !sourceItem ||
          !mask
        ) {
          throw new Error(
            "DeepSeek response contains invalid translation items",
          );
        }

        const description = restoreCode(
          item.description,
          mask.description.values,
        );
        const overview = restoreCode(item.overview, mask.overview.values);
        if (
          !preservesCodeLiterals(sourceItem.description, description) ||
          !preservesCodeLiterals(sourceItem.overview, overview)
        ) {
          throw new Error(
            "DeepSeek response contains invalid translation items",
          );
        }
        translated.set(item.index, {
          description,
          overview,
        });
      }

      if (translated.size !== expected.size) {
        throw new Error("DeepSeek response omitted one or more input items");
      }

      return new Map(
        items.map((item, index) => [item.index, translated.get(index)]),
      );
    } catch (error) {
      if (error?.retryable === false) throw error;
      lastError = error;
      if (attempt < 5) await delay(1_000 * 2 ** (attempt - 1));
    }
  }

  if (items.length > 1) {
    const middle = Math.ceil(items.length / 2);
    console.warn(
      `Retrying failed batch as ${middle} + ${items.length - middle} items`,
    );
    const [left, right] = await Promise.all([
      translateBatch(apiKey, items.slice(0, middle)),
      translateBatch(apiKey, items.slice(middle)),
    ]);
    return new Map([...left, ...right]);
  }

  throw lastError;
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  const inputPath = await findInput(options.input);
  const sourceText = await readFile(inputPath, "utf8");
  const source = JSON.parse(sourceText);

  if (!Array.isArray(source)) throw new Error("Skills source must be an array");

  const sourceSha256 = createHash("sha256").update(sourceText).digest("hex");
  const state = await loadState(options.output, sourceSha256, options.reset);
  const pending = [];

  for (const [index, skill] of source.entries()) {
    if (Object.hasOwn(state.translations, index)) continue;

    const description =
      typeof skill.description === "string" ? skill.description : "";
    const overview = typeof skill.overview === "string" ? skill.overview : "";

    if (!description && !overview) {
      state.translations[index] = { description: "", overview: "" };
      continue;
    }

    pending.push({ index, description, overview });
    if (pending.length >= options.limit) break;
  }

  console.log(
    `${source.length} total, ${Object.keys(state.translations).length} saved, ${pending.length} pending`,
  );

  if (options.dryRun || pending.length === 0) {
    if (!options.dryRun) await writeAtomic(options.output, state);
    return;
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) throw new Error("DEEPSEEK_API_KEY is required");

  const batches = [];
  for (let start = 0; start < pending.length; start += options.batchSize) {
    batches.push(pending.slice(start, start + options.batchSize));
  }

  let nextBatch = 0;
  let completedBatches = 0;
  let saveQueue = Promise.resolve();

  async function worker() {
    while (true) {
      const batchIndex = nextBatch;
      nextBatch += 1;
      if (batchIndex >= batches.length) return;

      const translated = await translateBatch(apiKey, batches[batchIndex]);
      for (const [index, value] of translated)
        state.translations[index] = value;

      completedBatches += 1;
      state.updatedAt = new Date().toISOString();
      console.log(
        `Translated ${Math.min(completedBatches * options.batchSize, pending.length)}/${pending.length}`,
      );

      if (completedBatches % options.checkpointEvery === 0) {
        saveQueue = saveQueue.then(() => writeAtomic(options.output, state));
        await saveQueue;
      }
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(options.concurrency, batches.length) }, () =>
      worker(),
    ),
  );
  await saveQueue;
  await writeAtomic(options.output, state);

  console.log(`Saved translations to ${options.output}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
