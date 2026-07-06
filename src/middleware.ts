import { NextResponse, type NextRequest } from "next/server";

const devDocsBase = "http://localhost:3079/docs";

export function middleware(request: NextRequest) {
  if (process.env.NODE_ENV === "development") {
    const docsPath = request.nextUrl.pathname.replace(/^\/docs\/?/, "");
    const target = docsPath ? `${devDocsBase}/${docsPath}` : `${devDocsBase}/`;

    return NextResponse.redirect(target);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/docs", "/docs/:path*"],
};
