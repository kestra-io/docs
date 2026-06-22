import { defineMiddleware } from "astro:middleware"
import { sequence } from "astro/middleware"
import YAML from "yaml"

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

// Legacy numbered customer-story IDs -> canonical /customers/{slug}.
// The slug MUST match what /customers/[slug].astro generates, i.e.
// slugify(companyName) (or the content-collection id when companyName is unset).
// Previously these mapped to the content-collection ids, which 404 because the
// /customers route is keyed on slugify(companyName), not the folder name.
const legacyCustomerStoryIdToSlug: Record<string, string> = {
    "2": "ntico",
    "3": "cleverconnect",
    "4": "quadis",
    "5": "airpaz",
    "6": "clever-cloud-offloading-terabytes-of-data-with-kestra-every-month",
    "8": "copines-de-voyage",
    "9": "displayce",
    "10": "reglo",
    "11": "htch",
    "12": "bouygues-immobilier-platform-orchestrate-its-marketing-data-with-kestra",
    "13": "gorgias",
    "14": "leroy-merlin-france",
    "15": "networklessons",
    "17": "fila",
    "18": "sopht",
    "19": "credit-agricole",
    "22": "acxiom",
    "23": "foundation-data",
    "25": "gravitee",
    "26": "jpmorgan-chase",
    "27": "fortune-500-company",
    "28": "software-provider",
    "29": "pharmacy-retailer",
    "30": "dataport",
    "31": "vissimo",
    "32": "apple",
    "33": "amdocs",
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
    notFoundRedirect,
)
