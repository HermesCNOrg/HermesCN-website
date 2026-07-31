import type { ReactNode } from "react";
import Layout from "@theme/Layout";

import type { Props } from "@theme/BlogLayout";

export default function BlogLayout(props: Props): ReactNode {
  const { toc, children, sidebar: _sidebar, ...layoutProps } = props;

  return (
    <Layout {...layoutProps}>
      <div className="container margin-vert--lg">
        <div className="row">
          <main className={toc ? "col col--9" : "col"}>{children}</main>
          {toc && <div className="col col--3">{toc}</div>}
        </div>
      </div>
    </Layout>
  );
}
