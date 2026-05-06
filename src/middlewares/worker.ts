import { handle } from '@astrojs/cloudflare/handler';
import contentSecurityPolicyConfig from "../../content-security-policy.config"
import { defineCFMiddleware, type CFMiddleware } from './worker.types';

const setupContentSecurityPolicyHeaders = defineCFMiddleware(async (url, next) => {
    // disable for tracking
    if (url.pathname.startsWith("/t/")) {
        return next()
    }

    const nextResponse = await next()
    const response = new Response(nextResponse.body, nextResponse)

    const localhost: string[] = []
    if (import.meta.env.DEV) {
        localhost.push(url.protocol + "//" + url.host)
    }

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
        url.protocol + "//" + url.host,
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
        response.headers.set("strict-transport-security", "max-age=31536000")
    }

    return response
})

const noIndex = defineCFMiddleware(async (url, next) => {
    // disable for tracking
    if (url.pathname.startsWith("/t/")) {
        return next()
    }

    // Check if the request is coming from the .workers.dev domain or others
    if (url.host !== "kestra.io") {
        const nextResponse = await next()
        const response = new Response(nextResponse.body, nextResponse)

        response.headers.set("X-Robots-Tag", "noindex, nofollow")

        return response
    }

    return next()
})


const middlewares: CFMiddleware[] = [setupContentSecurityPolicyHeaders, noIndex]

export default {
    async fetch(request, env, ctx) {
        let response: Response | undefined = undefined
        function next() {
            if (response) {
                return Promise.resolve(response)
            }
            return handle(request, env, ctx)
        }

        for (const middleware of middlewares) {
            response = await middleware(new URL(request.url), next, request)
        }
        return await next()
    },
} satisfies ExportedHandler;