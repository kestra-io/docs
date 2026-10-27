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
const COOKIE = "__preview_auth"
const ALLOWED_DOMAIN = "kestra.io"

const STATE_TTL = "10m"
const HANDOFF_TTL = "60s"
const SESSION_TTL_SECONDS = 12 * 60 * 60

const GOOGLE_JWKS = createRemoteJWKSet(
    new URL("https://www.googleapis.com/oauth2/v3/certs"),
)

export const isPreviewHost = (host: string): boolean => PREVIEW_HOST.test(host)

const text = (body: string, status: number): Response =>
    new Response(body, {
        status,
        headers: { "Content-Type": "text/plain", "Cache-Control": "no-store" },
    })

const redirect = (location: string, headers?: HeadersInit): Response => {
    const response = new Response(null, { status: 302, headers })
    response.headers.set("Location", location)
    response.headers.set("Cache-Control", "no-store")
    return response
}

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

const readCookie = (request: Request, name: string): string | null => {
    for (const part of (request.headers.get("cookie") ?? "").split(";")) {
        const [key, ...value] = part.trim().split("=")
        if (key === name) {
            return value.join("=")
        }
    }
    return null
}

const callbackUrl = `https://${CALLBACK_HOST}${CALLBACK_PATH}`

async function startLogin(
    url: URL,
    config: Required<PreviewAuthConfig>,
    key: Uint8Array,
): Promise<Response> {
    const state = await sign(
        key,
        "preview-state",
        { host: url.host, path: url.pathname + url.search },
        STATE_TTL,
    )
    const google = new URL("https://accounts.google.com/o/oauth2/v2/auth")
    google.search = new URLSearchParams({
        client_id: config.clientId,
        redirect_uri: callbackUrl,
        response_type: "code",
        scope: "openid email",
        hd: ALLOWED_DOMAIN,
        prompt: "select_account",
        state,
    }).toString()
    return redirect(google.toString())
}

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

async function handleConsume(url: URL, key: Uint8Array): Promise<Response> {
    const token = url.searchParams.get("token")
    const to = url.searchParams.get("to")
    const claims = token ? await verify(key, "preview-handoff", token) : null
    if (!claims || claims.host !== url.host || !isSafePath(to)) {
        return text("Invalid or expired sign-in link", 400)
    }

    const session = await sign(
        key,
        "preview-session",
        { email: String(claims.email) },
        `${SESSION_TTL_SECONDS}s`,
    )
    return redirect(to, {
        "Set-Cookie": `${COOKIE}=${session}; Path=/; Max-Age=${SESSION_TTL_SECONDS}; HttpOnly; Secure; SameSite=Lax`,
    })
}

/**
 * Gates every `*.kestra-io.workers.dev` host behind a Google sign-in limited to
 * the kestra.io Workspace. Returns a response to short-circuit the request, or
 * null to let it through. Production hosts are never gated, except for the
 * callback path that completes the sign-in.
 */
export async function previewAuth(
    request: Request,
    config: PreviewAuthConfig,
): Promise<Response | null> {
    const url = new URL(request.url)
    const isCallback = url.host === CALLBACK_HOST && url.pathname === CALLBACK_PATH

    if (!isCallback && !isPreviewHost(url.host)) {
        return null
    }

    const { clientId, clientSecret, secret } = config
    if (!clientId || !clientSecret || !secret) {
        return text("Preview authentication is not configured", 403)
    }
    const full = { clientId, clientSecret, secret }
    const key = new TextEncoder().encode(secret)

    if (isCallback) {
        return handleCallback(url, full, key)
    }

    if (url.pathname === CONSUME_PATH) {
        return handleConsume(url, key)
    }

    const session = readCookie(request, COOKIE)
    if (session && (await verify(key, "preview-session", session))) {
        return null
    }

    return startLogin(url, full, key)
}
