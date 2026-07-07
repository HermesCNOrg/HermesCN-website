import { useEffect, useMemo, useState } from "react";
import useBaseUrl, { useBaseUrlUtils } from "@docusaurus/useBaseUrl";

type SearchIndexItem = {
  title: string;
  url: string;
  content: string;
};

export default function NavbarSearch() {
  const searchIndexUrl = useBaseUrl("/search-index.json");
  const { withBaseUrl } = useBaseUrlUtils();
  const [items, setItems] = useState<SearchIndexItem[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let isMounted = true;

    fetch(searchIndexUrl)
      .then((response) => (response.ok ? response.json() : []))
      .then((data: SearchIndexItem[]) => {
        if (isMounted) {
          setItems(data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setItems([]);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [searchIndexUrl]);

  const results = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    if (!keyword) {
      return [];
    }

    return items
      .filter((item) => {
        const searchable = `${item.title} ${item.content}`.toLowerCase();

        return searchable.includes(keyword);
      })
      .slice(0, 6);
  }, [items, query]);

  return (
    <div className="hermes-doc-search">
      <input
        aria-label="搜索文档"
        className="hermes-doc-search__input"
        onChange={(event) => setQuery(event.target.value)}
        placeholder="搜索文档"
        type="search"
        value={query}
      />

      {results.length > 0 ? (
        <div className="hermes-doc-search__results">
          {results.map((item) => (
            <a
              className="hermes-doc-search__result"
              href={withBaseUrl(item.url)}
              key={item.url}
              onClick={() => setQuery("")}
            >
              {item.title}
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
}
