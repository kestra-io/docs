import type { AstroGlobal } from "astro"

// A /docs-preview fragment renders a doc outside /docs, so it sets the path in locals.
export const currentDocPath = (astro: Pick<AstroGlobal, "url" | "locals">) =>
    astro.locals.docPath ?? astro.url.pathname.replace(/\/$/, "")
