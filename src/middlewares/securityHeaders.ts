import { defineMiddleware } from "astro:middleware"
import contentSecurityPolicyConfig from "../../content-security-policy.config"

export const noIndex = defineMiddleware(async (context, next) => {
    // disable for tracking
    if (context.url.pathname.startsWith("/t/")) {
        return next()
    }

    // Check if the request is coming from the .workers.dev domain or others
    if (context.url.host !== "kestra.io") {
        const response = (await next()).clone()

        response.headers.set("X-Robots-Tag", "noindex, nofollow")

        return response
    }

    return next()
})

export const securityHeaders = defineMiddleware(async (context, next) => {
    // disable for tracking
    if (context.url.pathname.startsWith("/t/")) {
        return next()
    }

    const localhost: string[] = []
    if (import.meta.env.DEV) {
        localhost.push(context.url.protocol + "//" + context.url.host)
    }

    const response = (await next()).clone()

    const contentSecurityPolicy: string = Object.entries(
        contentSecurityPolicyConfig as Record<string, Array<string> | boolean>,
    )
        .filter(
            ([key]) =>
                import.meta.env.DEV && key !== "upgrade-insecure-requests",
        )
        .map(([key, value]) => {
            let line = key

            if (typeof value !== "boolean") {
                if (value.length === 1 && value[0] === "'none'") {
                    line += " " + value.join(" ")
                } else {
                    line += " " + localhost.concat(value).join(" ")
                }
            }

            return line
        })
        .join("; ")

    response.headers.set(
        "x-frame-options",
        import.meta.env.DEV ? "SAMEORIGIN" : "DENY",
    )
    response.headers.set("x-content-type-options", "nosniff")
    response.headers.set("x-download-options", "nosniff")
    response.headers.set(
        "access-control-allow-origin",
        context.url.protocol + "//" + context.url.host,
    )
    response.headers.set("cross-origin-opener-policy", "same-origin")
    response.headers.set("cross-origin-resource-policy", "same-origin")
    response.headers.set(
        "permissions-policy",
        "camera=(), display-capture=(), fullscreen=(*), geolocation=(), microphone=()",
    )
    response.headers.set("referrer-policy", "strict-origin-when-cross-origin")
    response.headers.set("x-permitted-cross-domain-policies", "none")
    response.headers.set("content-security-policy", contentSecurityPolicy)

    if (!import.meta.env.DEV) {
        response.headers.set("strict-transport-security", "max-age=15552000")
    }

    return response
})
