import { jwtVerify, createRemoteJWKSet } from "jose"
import { CLOUDFLARE_TEAM_DOMAIN } from "astro:env/server"
import { CLOUDFLARE_POLICY_AUD } from "astro:env/server"
import { defineMiddleware } from "astro:middleware"

const sendError = (body: string): Response => {
    return new Response(body, {
        status: 403,
        headers: { "Content-Type": "text/plain" },
    })
}

const fetch = async (
    request: Request,
    jwtAssertionToken: string | null,
): Promise<Response | null> => {
    // Verify the POLICY_AUD environment variable is set
    if (!CLOUDFLARE_POLICY_AUD) {
        return sendError("Missing required audience")
    }

    // Verify the POLICY_AUD environment variable is set
    if (!CLOUDFLARE_TEAM_DOMAIN) {
        return sendError("Missing required team domain")
    }

    // Get the JWT from the request headers
    // Check if token exists
    if (!jwtAssertionToken) {
        return sendError("Missing required CF Access JWT")
    }

    // Create JWKS from your team domain
    let JWKS = null
    try {
        JWKS = createRemoteJWKSet(new URL(`${CLOUDFLARE_TEAM_DOMAIN}/cdn-cgi/access/certs`))
    } catch (error) {
        // Token verification failed
        const message = error instanceof Error ? error.message : "Unknown error"
        const full = error instanceof Error ? JSON.stringify(error) : ""
        const debug = JSON.stringify({
            CLOUDFLARE_TEAM_DOMAIN,
            CLOUDFLARE_POLICY_AUD,
            jwtAssertionToken,
        })
        const stacktrace = error instanceof Error ? error.stack : ""

        return sendError(`Invalid createRemoteJWKSet: ${message}\n${full}\n${debug}\n${stacktrace}`)
    }

    // Verify the JWT
    try {
        await jwtVerify(jwtAssertionToken, JWKS, {
            issuer: CLOUDFLARE_TEAM_DOMAIN,
            audience: CLOUDFLARE_POLICY_AUD,
        })

        // Token is valid, proceed with your application logic
        return null
    } catch (error) {
        // Token verification failed
        const message = error instanceof Error ? error.message : "Unknown error"
        const full = error instanceof Error ? JSON.stringify(error) : ""
        const debug = JSON.stringify({
            CLOUDFLARE_TEAM_DOMAIN,
            CLOUDFLARE_POLICY_AUD,
            jwtAssertionToken,
        })
        const stacktrace = error instanceof Error ? error.stack : ""

        return sendError(`Invalid jwtVerify: ${message}\n${full}\n${debug}\n${stacktrace}`)
    }
}

export default defineMiddleware(async (context, next) => {
    // only apply to preview
    if (!context.url.host.endsWith("-docs.kestra-io.workers.dev")) {
        return next()
    }

    const response = await fetch(
        context.request,
        context.request.headers.get("cf-access-jwt-assertion"),
    )

    if (response) {
        return response
    }

    return next()
})