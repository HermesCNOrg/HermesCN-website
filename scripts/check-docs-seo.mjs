import fs from "node:fs";
import path from "node:path";

const contentRoots = ["docs-site/docs", "docs-site/blog"];
const errors = [];
const warnings = [];
const records = [];

function getFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const filePath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      return getFiles(filePath);
    }

    return /\.(md|mdx)$/.test(entry.name) ? [filePath] : [];
  });
}

function readFrontMatter(source) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return match?.[1] ?? "";
}

function readField(frontMatter, field) {
  const value = frontMatter.match(new RegExp(`^${field}:\\s*(.+)$`, "m"))?.[1];

  return value?.replace(/^['"]|['"]$/g, "").trim();
}

function stripMarkup(value) {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`>#]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function inferDescription(source) {
  const body = source.replace(/^---[\s\S]*?---/, "");
  const paragraphs = body.split(/\r?\n\r?\n/);

  for (const paragraph of paragraphs) {
    if (
      !paragraph.trim() ||
      /^(\s*#|\s*import\s|\s*export\s|\s*:::|\s*```|\s*[-|])/.test(paragraph)
    ) {
      continue;
    }

    const description = stripMarkup(paragraph);
    if (description.length >= 20) {
      return description.slice(0, 180);
    }
  }

  return "";
}

for (const root of contentRoots) {
  for (const filePath of getFiles(root)) {
    const source = fs.readFileSync(filePath, "utf8");
    const frontMatter = readFrontMatter(source);
    const title =
      readField(frontMatter, "title") ??
      stripMarkup(source.match(/^#\s+(.+)$/m)?.[1] ?? "");
    const explicitDescription = readField(frontMatter, "description");
    const description = explicitDescription ?? inferDescription(source);
    const isTutorial = filePath.includes("/tutorials/guide/");
    const isBlog = filePath.startsWith("docs-site/blog/");

    if (!title) {
      errors.push(`${filePath}: 缺少可解析的标题`);
    }

    if (!description) {
      errors.push(`${filePath}: 缺少可解析的描述`);
    }

    if (title.length > 70) {
      warnings.push(`${filePath}: 标题超过 70 个字符`);
    }

    if (description && (description.length < 20 || description.length > 180)) {
      warnings.push(`${filePath}: 描述长度应控制在 20–180 个字符`);
    }

    if ((isTutorial || isBlog) && !explicitDescription) {
      errors.push(`${filePath}: 高价值内容必须设置显式 description`);
    }

    if (isTutorial && !readField(frontMatter, "title")) {
      errors.push(`${filePath}: 教程必须设置显式 title`);
    }

    if (isTutorial && !/^keywords:/m.test(frontMatter)) {
      errors.push(`${filePath}: 教程必须设置 keywords`);
    }

    if (isTutorial && !/^last_update:/m.test(frontMatter)) {
      errors.push(`${filePath}: 教程必须记录 last_update`);
    }

    if (isBlog && !/^image:/m.test(frontMatter)) {
      errors.push(`${filePath}: 博客必须设置分享图 image`);
    }

    if (/hermes-cn-org\.vercel\.app/.test(source)) {
      errors.push(`${filePath}: 包含旧站点域名`);
    }

    records.push({ filePath, title, description });
  }
}

for (const field of ["title", "description"]) {
  const seen = new Map();

  for (const record of records) {
    const value = record[field];
    if (!value) continue;

    const duplicate = seen.get(value);
    if (duplicate) {
      warnings.push(`${record.filePath}: ${field} 与 ${duplicate} 重复`);
    } else {
      seen.set(value, record.filePath);
    }
  }
}

console.log(`SEO 检查完成：${records.length} 篇内容`);
console.log(`错误：${errors.length}；提醒：${warnings.length}`);

for (const warning of warnings) {
  console.warn(`WARN ${warning}`);
}

for (const error of errors) {
  console.error(`ERROR ${error}`);
}

if (errors.length > 0) {
  process.exitCode = 1;
}
