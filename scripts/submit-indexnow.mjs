const siteUrl = "https://hermescn.org";
const key = process.env.INDEXNOW_KEY;
const urls = process.argv.slice(2);

if (!key || !/^[A-Za-z0-9-]{8,128}$/.test(key)) {
  console.error("请先设置合法的 INDEXNOW_KEY（8–128 位字母、数字或短横线）。");
  process.exit(1);
}

if (urls.length === 0) {
  console.error(
    "请传入本次新增、更新或删除的完整 URL，例如：pnpm seo:indexnow -- https://hermescn.org/docs/blog/example",
  );
  process.exit(1);
}

for (const value of urls) {
  const url = new URL(value);

  if (url.origin !== siteUrl) {
    console.error(`跳过非本站 URL：${value}`);
    process.exit(1);
  }
}

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=utf-8",
  },
  body: JSON.stringify({
    host: "hermescn.org",
    key,
    keyLocation: `${siteUrl}/indexnow-key.txt`,
    urlList: urls,
  }),
});

if (!response.ok && response.status !== 202) {
  console.error(`IndexNow 提交失败：HTTP ${response.status}`);
  process.exit(1);
}

console.log(`IndexNow 已接收 ${urls.length} 个 URL：HTTP ${response.status}`);
