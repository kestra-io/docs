import { SignJWT, createRemoteJWKSet, jwtVerify } from "jose"

export interface PreviewAuthConfig {
    clientId?: string
    clientSecret?: string
    secret?: string
}

const PREVIEW_HOST = /^([a-z0-9-]+\.)*kestra-io\.workers\.dev$/
// Google only accepts exact redirect URIs, so one fixed host receives the
// callback for every preview and hands the visitor back to their preview host.
const CALLBACK_HOST = "kestra.io"
const CALLBACK_PATH = "/__preview-auth/callback"
const CONSUME_PATH = "/__preview-auth/consume"
const ALLOWED_DOMAIN = "kestra.io"
const HANDOFF_TTL = "60s"

const GOOGLE_JWKS = createRemoteJWKSet(
    new URL("https://www.googleapis.com/oauth2/v3/certs"),
)

export const isPreviewHost = (host: string): boolean => PREVIEW_HOST.test(host)

const text = (body: string, status: number): Response =>
    new Response(body, {
        status,
        headers: { "Content-Type": "text/plain", "Cache-Control": "no-store" },
    })

const redirect = (location: string): Response =>
    new Response(null, {
        status: 302,
        headers: { Location: location, "Cache-Control": "no-store" },
    })

const isSafePath = (path: unknown): path is string =>
    typeof path === "string" &&
    path.startsWith("/") &&
    !path.startsWith("//") &&
    !path.startsWith("/\\")

const sign = (
    key: Uint8Array,
    audience: string,
    payload: Record<string, string>,
    ttl: string,
) =>
    new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setAudience(audience)
        .setIssuedAt()
        .setExpirationTime(ttl)
        .sign(key)

const verify = async (
    key: Uint8Array,
    audience: string,
    token: string,
): Promise<Record<string, unknown> | null> => {
    try {
        const { payload } = await jwtVerify(token, key, {
            audience,
            algorithms: ["HS256"],
        })
        return payload
    } catch {
        return null
    }
}

const callbackUrl = `https://${CALLBACK_HOST}${CALLBACK_PATH}`

async function handleCallback(
    url: URL,
    config: Required<PreviewAuthConfig>,
    key: Uint8Array,
): Promise<Response> {
    const code = url.searchParams.get("code")
    const state = url.searchParams.get("state")
    if (!code || !state) {
        return text("Missing code or state", 400)
    }

    const target = await verify(key, "preview-state", state)
    if (
        !target ||
        typeof target.host !== "string" ||
        !isPreviewHost(target.host) ||
        !isSafePath(target.path)
    ) {
        return text("Invalid or expired state", 400)
    }

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            code,
            client_id: config.clientId,
            client_secret: config.clientSecret,
            redirect_uri: callbackUrl,
            grant_type: "authorization_code",
        }),
    })
    if (!tokenResponse.ok) {
        return text("Google sign-in failed", 401)
    }

    const { id_token: idToken } = (await tokenResponse.json()) as {
        id_token?: string
    }
    if (!idToken) {
        return text("Google sign-in failed", 401)
    }

    let claims: Record<string, unknown>
    try {
        const { payload } = await jwtVerify(idToken, GOOGLE_JWKS, {
            issuer: ["https://accounts.google.com", "accounts.google.com"],
            audience: config.clientId,
        })
        claims = payload
    } catch {
        return text("Google sign-in failed", 401)
    }

    if (
        claims.hd !== ALLOWED_DOMAIN ||
        claims.email_verified !== true ||
        typeof claims.email !== "string"
    ) {
        return text(`Access restricted to @${ALLOWED_DOMAIN} accounts`, 403)
    }

    const token = await sign(
        key,
        "preview-handoff",
        { host: target.host, email: claims.email },
        HANDOFF_TTL,
    )
    const back = new URL(`https://${target.host}${CONSUME_PATH}`)
    back.searchParams.set("token", token)
    back.searchParams.set("to", target.path)
    return redirect(back.toString())
}

/**
 * Completes the Google sign-in for preview hosts. Only the callback path on
 * production is handled; everything else returns null and is untouched.
 */
export async function previewAuth(
    request: Request,
    config: PreviewAuthConfig,
): Promise<Response | null> {
    const url = new URL(request.url)
    if (url.host !== CALLBACK_HOST || url.pathname !== CALLBACK_PATH) {
        return null
    }

    const { clientId, clientSecret, secret } = config
    if (!clientId || !clientSecret || !secret) {
        return text("Preview authentication is not configured", 403)
    }

    return handleCallback(
        url,
        { clientId, clientSecret, secret },
        new TextEncoder().encode(secret),
    )
}
