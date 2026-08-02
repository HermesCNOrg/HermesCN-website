import { createHash } from "node:crypto";
import {
  mkdir,
  readFile,
  readdir,
  rename,
  rm,
  writeFile,
} from "node:fs/promises";
import path from "node:path";

const projectRoot = process.cwd();
const defaultInput = path.join(
  projectRoot,
  ".cache",
  "hermes-skills",
  "skills.json",
);
const inputPath = path.resolve(process.argv[2] ?? defaultInput);
const translationInputPath = path.join(
  projectRoot,
  ".cache",
  "hermes-skills",
  "skills.zh-Hans.json",
);
const outputDir = path.join(projectRoot, "public", "skills-data");
const chunkSize = 1_000;

const categoryDefinitions = [
  {
    id: "security",
    label: "安全与合规",
    sourceCategories: ["security", "cybersecurity", "compliance"],
    keywords:
      /\b(security|cybersecurity|vulnerability|malware|phishing|pentest|audit|authentication|authorization|secrets?|privacy|compliance|owasp|threat|fraud|safety)\b|安全|漏洞|隐私|合规|审计/i,
  },
  {
    id: "finance",
    label: "金融与区块链",
    sourceCategories: [
      "blockchain",
      "finance",
      "personal-finance",
      "accounting",
      "banking",
      "payments",
      "crypto",
      "crypto-data",
      "credit-cards",
    ],
    keywords:
      /\b(finance|financial|accounting|banking|payment|invoice|stock|trading|investment|portfolio|market data|crypto|blockchain|bitcoin|ethereum|defi|web3|wallet|polymarket|tax)\b|金融|股票|投资|交易|区块链|加密货币|支付|发票/i,
  },
  {
    id: "health",
    label: "健康与医疗",
    sourceCategories: ["health", "healthcare", "fitness"],
    keywords:
      /\b(health|healthcare|medical|medicine|clinical|fitness|workout|nutrition|wellness|therapy|patient|pharmacy|mental health)\b|健康|医疗|健身|营养|心理/i,
  },
  {
    id: "marketing-sales",
    label: "营销与销售",
    sourceCategories: ["advertising", "author-marketing"],
    keywords:
      /\b(marketing|sales|seo|advertising|branding?|growth|crm|lead generation|campaign|conversion|newsletter|audience|copywriting)\b|营销|销售|广告|品牌|增长|获客/i,
  },
  {
    id: "business",
    label: "商业与运营",
    sourceCategories: [
      "domain",
      "real-estate",
      "marketplace",
      "ecommerce",
      "shopping",
      "retail",
      "jobs",
      "job-search",
      "careers",
      "legal",
      "procurement",
      "support",
    ],
    keywords:
      /\b(business|product management|project management|operations|strategy|startup|entrepreneur|customer|support|human resources|recruit|resume|career|job search|legal|contract|e-?commerce|retail|marketplace|procurement|real estate|management consulting)\b|商业|运营|产品管理|项目管理|招聘|简历|职业|法务|合同|电商|房地产/i,
  },
  {
    id: "communication-social",
    label: "沟通与社交",
    sourceCategories: [
      "communication",
      "communications",
      "social-media",
      "social",
    ],
    keywords:
      /\b(social media|community|communication|messaging|wechat|weixin|feishu|lark|slack|discord|telegram|whatsapp|twitter|mastodon|imessage)\b|社交|沟通|社区|微信|飞书|钉钉/i,
  },
  {
    id: "media-content",
    label: "媒体与内容",
    sourceCategories: [
      "media",
      "content",
      "publishing",
      "translation",
      "music",
      "news",
    ],
    keywords:
      /\b(content|writing|writer|article|blog|video|image|photo|audio|voice|music|podcast|youtube|subtitle|transcript|publishing|translation|tts|speech)\b|内容|写作|文章|视频|图像|图片|音频|播客|字幕|翻译|语音/i,
  },
  {
    id: "design-creative",
    label: "设计与创作",
    sourceCategories: ["creative"],
    keywords:
      /\b(design|designer|ui|ux|figma|creative|art|illustration|diagram|canvas|animation|motion graphics|3d|typography)\b|设计|创意|绘画|插画|动画|视觉/i,
  },
  {
    id: "research-education",
    label: "研究与教育",
    sourceCategories: [
      "research",
      "reference",
      "developer-docs",
      "documentation",
    ],
    keywords:
      /\b(research|academic|paper|arxiv|citation|literature|education|learning|teaching|course|study|science|knowledge base|documentation)\b|研究|论文|学术|教育|学习|教学|知识库|文档/i,
  },
  {
    id: "productivity",
    label: "效率与办公",
    sourceCategories: ["productivity", "apple"],
    keywords:
      /\b(productivity|workflow|automation|task|todo|calendar|email|gmail|notion|obsidian|notes?|documents?|pdf|word|powerpoint|slides?|office|file management|personal assistant|meeting|planning|reminder)\b|效率|工作流|自动化|任务|日历|邮件|笔记|文档|表格|办公|会议|计划|提醒/i,
  },
  {
    id: "data-analytics",
    label: "数据与分析",
    sourceCategories: [
      "data-science",
      "analytics",
      "business-intelligence",
      "data-extraction",
      "document-intelligence",
      "corporate-data",
      "civic-data",
    ],
    keywords:
      /\b(data science|data analysis|analytics|business intelligence|spreadsheet|excel|csv|visualization|dashboard|chart|etl|data warehouse|scraping|data extraction|statistics|dataset)\b|数据分析|数据科学|可视化|统计|数据集|数据提取/i,
  },
  {
    id: "devops-cloud",
    label: "DevOps 与云",
    sourceCategories: [
      "devops",
      "mlops",
      "networking",
      "infrastructure",
      "gpu-development",
      "migration",
      "ai-storage",
    ],
    keywords:
      /\b(devops|mlops|cloud|aws|azure|gcp|docker|kubernetes|k8s|deployment|infrastructure|terraform|ansible|networking|server|linux|monitoring|observability|ci\/?cd|sre|gpu|nvidia)\b|云计算|部署|运维|基础设施|监控|服务器|网络/i,
  },
  {
    id: "development",
    label: "软件开发",
    sourceCategories: [
      "software-development",
      "github",
      "developer-tools",
      "browser",
      "testing",
      "app-builders",
    ],
    keywords:
      /\b(api|sdk|cli|coding|code review|developer|development|programming|frontend|backend|full-?stack|web app|react|next\.?js|vue|typescript|javascript|python|rust|golang|java|swift|android|ios|github|gitlab|repository|debug|testing|test automation|database|sql|postgres|software)\b|软件开发|开发工具|编程|代码审查|前端|后端|数据库|调试|测试/i,
  },
  {
    id: "ai-agents",
    label: "AI 与智能体",
    sourceCategories: [
      "autonomous-ai-agents",
      "mcp",
      "vision-ai",
      "training-ai",
      "physical-ai",
      "agentic-ai",
      "inference-ai",
      "conversational-ai",
      "ai-agents",
      "ai-models",
      "ai-tooling",
    ],
    keywords:
      /\b(artificial intelligence|ai agents?|agentic|multi-agent|llm|large language model|machine learning|deep learning|neural|prompt engineering|rag|embeddings?|ollama|openai|anthropic|claude|gemini|gpt|mcp server)\b|人工智能|大模型|智能体|机器学习|深度学习|提示词/i,
  },
  {
    id: "lifestyle",
    label: "生活与服务",
    sourceCategories: [
      "travel",
      "restaurants",
      "sports",
      "gaming",
      "weather",
      "smart-home",
      "automotive",
      "transportation",
      "events",
      "food-delivery",
      "grocery",
      "outdoors",
      "tickets",
      "vacation-rentals",
    ],
    keywords:
      /\b(travel|trip|restaurant|food|recipe|sports|game|gaming|weather|smart home|automotive|transportation|flight|hotel|event|shopping|delivery|outdoors|ticket|vacation|home assistant)\b|旅行|旅游|餐厅|美食|菜谱|体育|游戏|天气|智能家居|汽车|交通|酒店|购物/i,
  },
];

const categoryBySource = new Map(
  categoryDefinitions.flatMap((category) =>
    category.sourceCategories.map((source) => [source, category]),
  ),
);

function categorizeSkill(skill) {
  const sourceCategory = String(skill.category ?? "other").toLowerCase();
  const directCategory = categoryBySource.get(sourceCategory);
  const name = skill.name ?? "skill";
  let category = directCategory;

  if (!category) {
    const text = [
      skill.name,
      ...(Array.isArray(skill.tags) ? skill.tags : []),
      skill.identifier,
      skill.description,
      skill.overview,
    ]
      .filter(Boolean)
      .join(" ");
    category = categoryDefinitions.find((item) => item.keywords.test(text));
  }

  return {
    ...skill,
    category: category?.id ?? "other",
    categoryLabel: category?.label ?? "其他",
    installCmd:
      skill.installCmd ??
      (skill.source === "built-in"
        ? `hermes skills install NousResearch/hermes-agent/skills/${sourceCategory}/${name}`
        : skill.source === "optional"
          ? `hermes skills install official/${sourceCategory}/${name}`
          : undefined),
  };
}

function compactJson(value) {
  return `${JSON.stringify(value)}\n`;
}

function skillId(skill, duplicates) {
  const name = typeof skill.name === "string" ? skill.name : "skill";
  const source = typeof skill.source === "string" ? skill.source : "unknown";
  const identity =
    skill.identifier ?? skill.docsPath ?? skill.sourceUrl ?? name;
  const hash = createHash("sha256")
    .update(`${source}\0${identity}`)
    .digest("hex")
    .slice(0, 12);
  const slug = name
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 56);
  const base = `${slug || "skill"}-${hash}`;
  const duplicate = (duplicates.get(base) ?? 0) + 1;

  duplicates.set(base, duplicate);
  return duplicate === 1 ? base : `${base}-${duplicate}`;
}

async function writeAtomic(filePath, value) {
  const temporaryPath = `${filePath}.tmp`;

  await writeFile(temporaryPath, compactJson(value));
  await rename(temporaryPath, filePath);
}

async function removeOldGeneratedFiles() {
  const files = await readdir(outputDir).catch(() => []);

  await Promise.all(
    files
      .filter(
        (name) =>
          /^skills-\d{3}\.json$/.test(name) ||
          /^skills-\d{3}\.zh-Hans\.json$/.test(name) ||
          name === "manifest.json" ||
          name === "search-index.json",
      )
      .map((name) => rm(path.join(outputDir, name))),
  );
}

async function loadTranslations(sourceSha256) {
  const translationText = await readFile(translationInputPath, "utf8").catch(
    () => "",
  );

  if (translationText) {
    const state = JSON.parse(translationText);
    if (state.sourceSha256 !== sourceSha256) {
      throw new Error(
        "Chinese translations belong to a different Skills source",
      );
    }
    return state.translations ?? {};
  }

  const manifest = await readFile(path.join(outputDir, "manifest.json"), "utf8")
    .then(JSON.parse)
    .catch(() => null);

  if (manifest?.sourceSha256 !== sourceSha256) return {};

  const translations = {};
  for (const [chunk, item] of (manifest.chunks ?? []).entries()) {
    const file = `skills-${String(chunk).padStart(3, "0")}.zh-Hans.json`;
    const rows = await readFile(path.join(outputDir, file), "utf8")
      .then(JSON.parse)
      .catch(() => []);

    for (const [offset, row] of rows.entries()) {
      if (!row) continue;
      translations[chunk * chunkSize + offset] = {
        description: row[0] ?? "",
        overview: row[1] ?? "",
      };
    }

    if (item.count !== rows.length) {
      throw new Error(`Invalid Chinese translation chunk: ${file}`);
    }
  }

  return translations;
}

async function main() {
  const sourceText = await readFile(inputPath, "utf8");
  const source = JSON.parse(sourceText);
  const sourceSha256 = createHash("sha256").update(sourceText).digest("hex");

  if (!Array.isArray(source) || source.length === 0) {
    throw new Error("Skills source must be a non-empty JSON array");
  }

  const translations = await loadTranslations(sourceSha256);
  const translationSha256 = createHash("sha256")
    .update(compactJson(translations))
    .digest("hex");

  await mkdir(outputDir, { recursive: true });
  await removeOldGeneratedFiles();

  const duplicates = new Map();
  const categoryCounts = new Map();
  const searchIndex = [];
  const chunks = [];

  for (let start = 0; start < source.length; start += chunkSize) {
    const items = source
      .slice(start, start + chunkSize)
      .map((skill) => categorizeSkill(skill));
    const chunk = chunks.length;
    const file = `skills-${String(chunk).padStart(3, "0")}.json`;
    const translationFile = `skills-${String(chunk).padStart(3, "0")}.zh-Hans.json`;

    for (const [offset, skill] of items.entries()) {
      categoryCounts.set(
        skill.category,
        (categoryCounts.get(skill.category) ?? 0) + 1,
      );
      searchIndex.push([
        skillId(skill, duplicates),
        skill.name ?? "",
        skill.category ?? "other",
        skill.categoryLabel ?? skill.category ?? "Other",
        skill.source ?? "unknown",
        skill.identifier ?? "",
        chunk,
        offset,
      ]);
    }

    await writeAtomic(path.join(outputDir, file), items);
    await writeAtomic(
      path.join(outputDir, translationFile),
      items.map((_, offset) => {
        const translation = translations[start + offset];
        return translation
          ? [translation.description ?? "", translation.overview ?? ""]
          : null;
      }),
    );
    chunks.push({ file, count: items.length });
  }

  await writeAtomic(path.join(outputDir, "search-index.json"), searchIndex);
  await writeAtomic(path.join(outputDir, "manifest.json"), {
    version: 2,
    categoryVersion: 1,
    catalogSha256: createHash("sha256")
      .update(compactJson(searchIndex))
      .digest("hex"),
    sourceSha256,
    translations: {
      "zh-Hans": {
        sha256: translationSha256,
        translatedSkills: Object.keys(translations).length,
        complete: Object.keys(translations).length === source.length,
      },
    },
    totalSkills: source.length,
    chunkSize,
    searchIndex: "search-index.json",
    categories: [
      ...categoryDefinitions.map(({ id, label }) => ({
        id,
        label,
        count: categoryCounts.get(id) ?? 0,
      })),
      {
        id: "other",
        label: "其他",
        count: categoryCounts.get("other") ?? 0,
      },
    ].filter((category) => category.count > 0),
    chunks,
  });

  console.log(
    `Built ${source.length} Skills into ${chunks.length} chunks in ${outputDir}`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
