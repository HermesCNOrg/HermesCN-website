const devDocsBase = "http://localhost:3079";
const productionDocsBase = "/docs";

export const docsHref =
  process.env.NODE_ENV === "production"
    ? `${productionDocsBase}/`
    : `${devDocsBase}/`;

export const tutorialHref =
  process.env.NODE_ENV === "production"
    ? `${productionDocsBase}/tutorials/`
    : `${devDocsBase}/tutorials/`;

export const openClawMigrationHref =
  process.env.NODE_ENV === "production"
    ? `${productionDocsBase}/zh-Hans/guides/migrate-from-openclaw`
    : `${devDocsBase}/zh-Hans/guides/migrate-from-openclaw`;
