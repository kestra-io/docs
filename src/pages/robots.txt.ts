export const prerender = false

import type { APIRoute } from "astro"
import * as envField from "astro:env/server"

export const GET: APIRoute = async () => {
const disabled = import.meta.env.DEV || envField.PREVIEW
    const result = `# indexing ${disabled ? "disabled" : "enabled"}

User-agent: *
Disallow: ${disabled ? "*" : "/slack"}
${disabled ? "" : `# Block the /blueprints pagination bug (critical - 501 errors)
Disallow: /blueprints?*clid=*
Disallow: /blueprints?*size=*
# Block build assets 
Disallow: /_nuxt/
Disallow: /__nuxt_content/
Disallow: /_astro/
Disallow: /cdn-cgi/
# Block tracking parameters
Disallow: /*?q=
Disallow: /*?search=
Disallow: /*?ref=
Disallow: /*?utm_
`}${disabled ? "" : "Sitemap: https://kestra.io/sitemap/index.xml"}`

    return new Response(result, {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
        },
    })
}