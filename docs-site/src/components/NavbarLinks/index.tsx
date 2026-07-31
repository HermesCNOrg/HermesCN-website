import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

type CustomFields = {
  mainSiteBaseUrl?: string;
  githubHref?: string;
};

function ArrowUpRightIcon() {
  return (
    <svg
      aria-hidden="true"
      className="hermes-doc-nav-link__icon"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M7 17L17 7M9 7h8v8"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg
      aria-hidden="true"
      className="hermes-doc-nav-link__icon"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.86 8.36 6.84 9.72.5.1.68-.22.68-.49 0-.24-.01-1.04-.01-1.89-2.78.62-3.37-1.22-3.37-1.22-.45-1.19-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.35 1.12 2.92.86.09-.66.35-1.12.64-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.32 9.32 0 0 1 12 6.99c.85 0 1.7.12 2.5.35 1.9-1.33 2.74-1.05 2.74-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.95.68 1.92 0 1.38-.01 2.49-.01 2.83 0 .27.18.6.69.49A10.2 10.2 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z" />
    </svg>
  );
}

export function MainSiteLink() {
  const { siteConfig } = useDocusaurusContext();
  const { mainSiteBaseUrl = "https://hermescn.org" } =
    siteConfig.customFields as CustomFields;

  return (
    <a
      className="navbar__item navbar__link hermes-doc-nav-link"
      href={mainSiteBaseUrl}
    >
      <i
        aria-hidden="true"
        className="hermes-doc-nav-link__remix-icon ri-home-4-line"
      />
      <span>主站</span>
      <ArrowUpRightIcon />
    </a>
  );
}

export function GithubLink() {
  const { siteConfig } = useDocusaurusContext();
  const { githubHref = "https://github.com/HermesCNOrg" } =
    siteConfig.customFields as CustomFields;

  return (
    <a
      className="navbar__item navbar__link hermes-doc-nav-link"
      href={githubHref}
      rel="noopener noreferrer"
      target="_blank"
    >
      <GithubIcon />
      <span>GitHub</span>
      <ArrowUpRightIcon />
    </a>
  );
}
