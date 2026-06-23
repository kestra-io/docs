import { defineMiddleware } from "astro:middleware"
import { sequence } from "astro/middleware"
import YAML from "yaml"
import { API_URL } from "astro:env/client"
import { $fetchApiRawCached } from "~/utils/fetch"
import { apiDocPath, VERSIONED_DOCS_PATH } from "~/utils/versionedDocs"
import { getDocVersions } from "~/utils/docVersionsFetch"
import { getDocChildren } from "~/utils/docChildrenFetch"
import { renderVersionedDocHtml } from "~/utils/renderVersionedDoc"

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
    const match = VERSIONED_DOCS_PATH.exec(context.url.pathname)
    if (!match) {
        return next()
    }

    const version = match[1]
    const path = (match[2] ?? "").replace(/^\/+|\/+$/g, "")

    let markdown: string | null = null
    try {
        const docRes = await $fetchApiRawCached(apiDocPath(version, path))
        markdown = await docRes.text()
    } catch {
        markdown = null
    }

    // Page doesn't exist for this version (markdown null), or it failed to
    // render (a malformed relic directive can throw): fall back to the version
    // home, unless we're already there (avoid a redirect loop) -> latest docs.
    const fallback = () =>
        new Response("", {
            status: 302,
            headers: { Location: path === "" ? "/docs" : `/docs/${version}` },
        })

    if (markdown === null) {
        return fallback()
    }

    try {
        // Versions feed the selector and children feed the nav sidebar; both are
        // memoized (not fetched per request) and fetched together.
        const [versions, children] = await Promise.all([
            getDocVersions(),
            getDocChildren(version),
        ])
        const html = await renderVersionedDocHtml({
            version,
            path,
            markdown,
            versions,
            children,
            apiUrl: API_URL,
        })
        return new Response(html, {
            headers: { "content-type": "text/html;charset=utf-8" },
        })
    } catch {
        return fallback()
    }
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
