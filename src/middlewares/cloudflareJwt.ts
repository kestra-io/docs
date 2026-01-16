import {jwtVerify, createRemoteJWKSet} from "jose";
import {CLOUDFLARE_TEAM_DOMAIN} from "astro:env/server";
import {CLOUDFLARE_POLICY_AUD} from "astro:env/server";
import {defineMiddleware} from "astro:middleware";


const fetch = async (request: Request): Promise<Response | null> => {
    // Verify the POLICY_AUD environment variable is set
    if (!CLOUDFLARE_POLICY_AUD) {
        return new Response("Missing required audience", {
            status: 403,
            headers: { "Content-Type": "text/plain" },
        });
    }

    // Verify the POLICY_AUD environment variable is set
    if (!CLOUDFLARE_TEAM_DOMAIN) {
        return new Response("Missing required team domain", {
            status: 403,
            headers: { "Content-Type": "text/plain" },
        });
    }

    // Get the JWT from the request headers
    const token = request.headers.get("cf-access-jwt-assertion");

    // Check if token exists
    if (!token) {
        return new Response("Missing required CF Access JWT", {
            status: 403,
            headers: { "Content-Type": "text/plain" },
        });
    }

    try {
        // Create JWKS from your team domain
        const JWKS = createRemoteJWKSet(
            new URL(`${CLOUDFLARE_TEAM_DOMAIN}/cdn-cgi/access/certs`)
        );

        // Verify the JWT
        const { payload } = await jwtVerify(token, JWKS, {
            issuer: CLOUDFLARE_TEAM_DOMAIN,
            audience: CLOUDFLARE_POLICY_AUD,
        });

        // Token is valid, proceed with your application logic
        return null;
    } catch (error) {
        // Token verification failed
        const message = error instanceof Error ? error.message : "Unknown error";
        return new Response(`Invalid token: ${message}`, {
            status: 403,
            headers: { "Content-Type": "text/plain" },
        });
    }
}

export default defineMiddleware(async (context, next) => {
    // only apply to preview
    if (!context.url.host.endsWith('-docs.kestra-io.workers.dev')) {
        return next();
    }

    const response = await fetch(context.request);

    if (response) {
        return response;
    }

    return next();
});