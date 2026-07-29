import { defineMiddleware } from "astro:middleware"
import { sequence } from "astro/middleware"
import YAML from "yaml"
import { $fetchApiRawCached } from "~/utils/fetch"
import {
    apiDocPath,
    decideVersionedRoute,
    frontmatterField,
    isAssetShapedDocPath,
    missingDocFallbackHref,
    stripFrontmatter,
    VERSIONED_DOCS_PATH,
} from "~/utils/versionedDocs"
import { getDocVersionsResult } from "~/utils/docVersionsFetch"
import { getDocChildren } from "~/utils/docChildrenFetch"

const redirectFileCollection = import.meta.glob("./contents/redirects/*.yml", {
    eager: true,
    import: "default",
    query: "?raw",
})

const redirectCollection: {
    id: string
    data: { regexp: string; to: string }
}[] = Object.entries(redirectFileCollection).map(([path, raw]) => ({
    id: path.split("/").slice(-1)[0].split(".")[0],
    data: YAML.parse(raw as string),
}))

const legacyCustomerStoryIdToSlug: Record<string, string> = {
    "2": "ntico-manage-geospatial-data-operations-with-kestra",
    "3": "cleverconnect-enhances-hr-integration-platform-with-kestra",
    "4": "quadis-drives-innovation-transforming-car-retail-operations-with-kestra",
    "5": "airpaz-optimizes-travel-data-workflows-with-kestra",
    "6": "clever-cloud-offloading-terabytes-of-data-with-kestra-every-month",
    "8": "copines-de-voyage-enhancing-travel-experiences-through-advanced-data-orchestration-with-kestra",
    "9": "displayce-optimized-workflow-orchestration-and-enhanced-data-management",
    "10": "reglo-automating-etl-process-with-a-simple-slack-command",
    "11": "htch-building-the-best-architect-collaborative-web-tool-with-kestra",
    "12": "bouygues-immobilier-platform-orchestrate-its-marketing-data-with-kestra",
    "13": "gorgias-using-declarative-data-engineering-orchestration-with-kestra",
    "14": "datamesh-at-scale-increased-its-data-production-by-900percent",
    "15": "a-solopreneurs-journey-how-networklessons-leverage-kestra-to-automate-his-business",
    "17": "erp-transformation-smarter-faster-fully-automated",
    "18": "sopht-scales-its-green-itops-platform-with-kestra",
    "19": "scaling-secure-infrastructure-at-credit-agricole-with-kestra",
    "22": "scaling-big-data-operations",
    "23": "boosted-productivity-slashed-costs-and-accelerated-delivery",
    "25": "when-your-api-writes-its-own-docs-with-kestra",
    "26": "orchestrating-cybersecurity-for-100-users-and-billions-of-rows",
    "27": "securing-hybrid-cloud-automation-across-it-and-ot-with-kestra",
    "28": "governed-self-service-cloud-automation-in-regulated-environments-with-kestra",
    "29": "modernizing-mission-critical-workflows-in-a-highly-regulated-environment",
    "30": "building-a-government-grade-orchestration-control-plane-with-kestra",
    "31": "modernizing-mission-critical-e-commerce-integrations-with-kestra",
    "32": "apple-ml-team-orchestrates-large-scale-data-pipelines-with-kestra",
    "33": "amdocs-delivers-integration-environments-as-a-service-with-kestra",
}

const sendRedirect = (redirectUrl: string) => {
    return new Response("", {
        status: 301,
        headers: {
            Location: redirectUrl,
        },
    })
}

const logger = defineMiddleware(async (context, next) => {
    if (
        context.url.pathname === "/api/healthcheck" ||
        context.url.pathname.startsWith("/t/") ||
        import.meta.env.DEV ||
        context.isPrerendered
    ) {
        return next()
    }

    const startAt = Date.now()

    const response = await next()

    const logParts: Record<string, any> = {
        method: context.request.method,
        url: context.request.url,
        status: response.status,
        ip: !context.isPrerendered
            ? context.request.headers.get("x-real-ip")
            : null,
        length: response.headers.get("content-length"),
        route: context.routePattern,
        routeParams: context.params,
        duration: Date.now() - startAt,
        referer: response.headers.get("referer"),
    }

    if (!logParts["ip"]) {
        logParts["ip"] = context.clientAddress
    }

    const log = JSON.stringify(logParts)

    if (response.status < 500) {
        console.log(log)
    } else {
        console.error(log)
    }

    return response
})

const incomingRedirect = defineMiddleware(async (context, next) => {
    // disable for tracking
    if (context.url.pathname.startsWith("/t/")) {
        return next()
    }

    const originalUrl = context.url.toString()

    // we don't want .html extensions (historical reason)
    if (originalUrl.endsWith(".html")) {
        return sendRedirect(
            originalUrl
                .substring(0, originalUrl.length - 5)
                .toLocaleLowerCase(),
        )
    }

    // we don't want trailing slashes (but allow the root path '/')
    // static pages are handled by Cloudflare's asset handler (drop-trailing-slash),
    // this covers SSR (non-prerendered) pages that reach the worker
    if (!context.isPrerendered && context.url.pathname !== "/" && originalUrl.endsWith("/")) {
        return sendRedirect(originalUrl.substring(0, originalUrl.length - 1));
    }

    // all urls should be lowercase
    const match = context.url.pathname.match(/[A-Z]/)
    if (
        match &&
        !context.url.pathname.startsWith("/icons/") &&
        !context.url.pathname.startsWith("/meta/")
    ) {
        return sendRedirect(
            originalUrl.replace(
                context.url.pathname,
                context.url.pathname.toLocaleLowerCase(),
            ),
        )
    }

    // Check if the request is coming from the docs.kestra-io.workers.dev to redirect to main
    if (context.url.host === "docs.kestra-io.workers.dev") {
        const replace = new URL(context.url)
        replace.host = "kestra.io"
        replace.protocol = "https:"
        replace.port = "443"

        return sendRedirect(replace.toString())
    }

    // Double query string is invalid redirect without query string (historical reason, but can happen with some bots)
    const doubleQuery = context.url.search.match(/\?/g)?.length
    if (doubleQuery !== undefined && doubleQuery > 1) {
        return sendRedirect(
            context.url.pathname + "?" + context.url.search.split("?")[1],
        )
    }

    return next()
})

// Serve /docs/{major.minor}/... from api.kestra.io, rendered inline. Latest docs
// don't match the version regex and fall through to Astro's static handling.
const versionedDocs = defineMiddleware(async (context, next) => {
    // Mirrors the latest docs' "append .md to any /docs/* URL" convention
    // (DocsLayout's llms-directive: "/docs/x" -> "/docs/x.md", the version
    // itself included, e.g. "/docs/1.2" -> "/docs/1.2.md"), so
    // MarkdownActionsMenu's "View as Markdown" works unmodified for versioned
    // pages too. Stripped from the pathname BEFORE matching the version/path
    // regex, so it doesn't have to account for ".md" landing inside either
    // capture group.
    const isMarkdownRequest = context.url.pathname.endsWith(".md")
    const testPathname = isMarkdownRequest
        ? context.url.pathname.slice(0, -3)
        : context.url.pathname
    const match = VERSIONED_DOCS_PATH.exec(testPathname)
    if (!match) {
        return next()
    }

    const version = match[1]
    const path = (match[2] ?? "").replace(/^\/+|\/+$/g, "")

    const unavailable = () =>
        new Response("Documentation temporarily unavailable", {
            status: 503,
            headers: {
                "content-type": "text/plain;charset=utf-8",
                "cache-control": "no-store",
                "retry-after": "30",
            },
        })

    // Routing policy (unknown version → 404, list outage → 503, newest
    // version → canonical latest, older → archived copy) lives in the pure,
    // tested decideVersionedRoute — this middleware only executes it.
    const { versions: knownVersions, ok: versionsOk } = await getDocVersionsResult()
    const decision = decideVersionedRoute({
        version,
        path,
        isMarkdownRequest,
        search: context.url.search,
        versions: knownVersions,
        versionsOk,
    })
    if (decision.kind === "pass") return next()
    if (decision.kind === "unavailable") return unavailable()
    if (decision.kind === "redirect") {
        return new Response("", {
            status: 302,
            headers: { Location: decision.location },
        })
    }

    let markdown: string | null = null
    // Asset-shaped paths deterministically 500 at the origin (see
    // isAssetShapedDocPath) — skip the fetch and treat them as missing, so
    // they don't turn the transient-failure 503 below into a permanent one.
    if (!isAssetShapedDocPath(path)) {
        try {
            const docRes = await $fetchApiRawCached(apiDocPath(version, path))
            markdown = (await docRes.text()) || null
        } catch (error) {
            // A 404 just means this page doesn't exist for this version (the
            // expected case the fallback below handles). Anything else is a
            // transient origin failure — surface it instead of letting an API
            // blip masquerade as the missing-page redirect below.
            const status = (error as { response?: { status?: number } })?.response?.status
            if (status !== 404) {
                console.error(`Failed to fetch versioned doc ${version}/${path}:`, error)
                return unavailable()
            }
            markdown = null
        }
    }

    if (markdown === null) {
        // The version's own home page is missing: a real 404 rather than
        // silently switching the reader to the latest docs.
        if (!path) {
            return next()
        }
        return new Response("", {
            status: 302,
            headers: {
                Location: missingDocFallbackHref(version, isMarkdownRequest, context.url.search),
            },
        })
    }

    if (isMarkdownRequest) {
        // Matches [...docsPath].md.ts's format for the latest docs: an
        // "# {title}" header over the frontmatter-stripped body, not the raw
        // frontmatter block.
        const title = frontmatterField(markdown, "title") ?? "Documentation"
        const body = `# ${title}\n\n${stripFrontmatter(markdown)}`
        return new Response(body, {
            headers: {
                "content-type": "text/markdown;charset=utf-8",
                "X-Robots-Tag": "noindex",
            },
        })
    }

    // Children feed the nav sidebar; memoized, not fetched per request. The
    // version list is fetched independently by DocsLayout via getDocVersions().
    const children = await getDocChildren(version)

    context.locals.versionedDoc = { version, path, markdown, children }
    const response = await next("/docs-versioned")
    response.headers.set("X-Robots-Tag", "noindex")
    return response
})

const notFoundRedirect = defineMiddleware(async (context, next) => {
    // disable for tracking
    if (context.url.pathname.startsWith("/t/")) {
        return next()
    }

    const response = await next()

    if (response.status !== 404) {
        return response
    }

    // A versioned plugin URL (/plugins/<name>/vX.Y.Z/...) only 404s when the version was never
    // released. Let that 404 surface instead of letting the /plugins/plugin-*.* catch-all rewrite
    // it to the plugin root (a soft-404). Real-but-unavailable versions render latest, not a 404.
    if (/^\/plugins\/[^/]+\/v\d+\.\d+\.\d+(\/|$)/.test(context.url.pathname)) {
        return response
    }

    const storyIdMatch = context.url.pathname.match(/^\/(?:use-cases\/stories|customers)\/(\d+)(?:-|$)/)
    if (storyIdMatch) {
        const slug = legacyCustomerStoryIdToSlug[storyIdMatch[1]]
        if (slug) {
            return sendRedirect(`/customers/${slug}`)
        }
    }

    const originalUrl = new URL(context.url)
    const split = originalUrl.pathname.split("/")

    const allEntries = redirectCollection
        .filter((item) => item.id === (split.length > 2 ? split[1] : "index"))
        .flatMap((item) => item.data)
        .map((item) => {
            const regexp = new RegExp(item.regexp)
            const match = originalUrl.pathname.match(regexp)
            if (match) {
                return originalUrl.pathname.replace(regexp, item.to)
            }

            return null
        })
        .filter((item) => item !== null)

    if (allEntries.length > 0) {
        return sendRedirect(allEntries[0])
    }

    return response
})

export const onRequest = sequence(
    logger,
    incomingRedirect,
    versionedDocs,
    notFoundRedirect,
)
