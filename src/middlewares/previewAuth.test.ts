import { SignJWT } from "jose"
import { describe, expect, it } from "vitest"
import { isPreviewHost, previewAuth } from "./previewAuth"

const config = { clientId: "id", clientSecret: "cs", secret: "s3cret" }
const key = new TextEncoder().encode(config.secret)
const PREVIEW = "https://ks-my-branch-docs.kestra-io.workers.dev"

const sign = (audience: string, payload: Record<string, string>, exp = "5m") =>
    new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setAudience(audience)
        .setIssuedAt()
        .setExpirationTime(exp)
        .sign(key)

const get = (url: string, cookie?: string) =>
    new Request(url, { headers: cookie ? { cookie } : {} })

describe("isPreviewHost", () => {
    it("matches every kestra-io.workers.dev host", () => {
        expect(isPreviewHost("ks-a-docs.kestra-io.workers.dev")).toBe(true)
        expect(isPreviewHost("abc123-docs.kestra-io.workers.dev")).toBe(true)
        expect(isPreviewHost("kestra-io.workers.dev")).toBe(true)
    })

    it("rejects production and lookalike hosts", () => {
        expect(isPreviewHost("kestra.io")).toBe(false)
        expect(isPreviewHost("evilkestra-io.workers.dev")).toBe(false)
        expect(isPreviewHost("kestra-io.workers.dev.evil.com")).toBe(false)
    })
})

describe("previewAuth", () => {
    it("lets production traffic through", async () => {
        expect(await previewAuth(get("https://kestra.io/docs"), config)).toBeNull()
    })

    it("fails closed on a preview host when secrets are missing", async () => {
        const res = await previewAuth(get(`${PREVIEW}/`), {})
        expect(res?.status).toBe(403)
    })

    it("redirects an anonymous visitor to Google restricted to kestra.io", async () => {
        const res = await previewAuth(get(`${PREVIEW}/docs?a=1`), config)
        expect(res?.status).toBe(302)
        const location = new URL(res?.headers.get("location") ?? "")
        expect(location.host).toBe("accounts.google.com")
        expect(location.searchParams.get("hd")).toBe("kestra.io")
        expect(location.searchParams.get("redirect_uri")).toBe(
            "https://kestra.io/__preview-auth/callback",
        )
    })

    it("gates static assets and tracking paths too", async () => {
        for (const path of ["/_astro/app.js", "/t/i/v0/e/"]) {
            const res = await previewAuth(get(`${PREVIEW}${path}`), config)
            expect(res?.status).toBe(302)
        }
    })

    it("accepts a valid session cookie", async () => {
        const session = await sign("preview-session", { email: "a@kestra.io" })
        const res = await previewAuth(
            get(`${PREVIEW}/docs`, `x=1; __preview_auth=${session}`),
            config,
        )
        expect(res).toBeNull()
    })

    it("rejects an expired or wrong-audience session cookie", async () => {
        const expired = await sign("preview-session", { email: "a@kestra.io" }, "-1m")
        const wrongAud = await sign("preview-handoff", { email: "a@kestra.io" })
        for (const token of [expired, wrongAud]) {
            const res = await previewAuth(get(`${PREVIEW}/`, `__preview_auth=${token}`), config)
            expect(res?.status).toBe(302)
        }
    })

    it("consumes a hand-off token into a cookie and redirects", async () => {
        const token = await sign("preview-handoff", {
            host: "ks-my-branch-docs.kestra-io.workers.dev",
            email: "a@kestra.io",
        })
        const res = await previewAuth(
            get(`${PREVIEW}/__preview-auth/consume?token=${token}&to=/docs`),
            config,
        )
        expect(res?.status).toBe(302)
        expect(res?.headers.get("location")).toBe("/docs")
        expect(res?.headers.get("set-cookie")).toMatch(/^__preview_auth=.+HttpOnly; Secure/)
    })

    it("refuses a hand-off token minted for another host or an unsafe target", async () => {
        const other = await sign("preview-handoff", {
            host: "ks-other-docs.kestra-io.workers.dev",
            email: "a@kestra.io",
        })
        const mine = await sign("preview-handoff", {
            host: "ks-my-branch-docs.kestra-io.workers.dev",
            email: "a@kestra.io",
        })
        const a = await previewAuth(get(`${PREVIEW}/__preview-auth/consume?token=${other}&to=/`), config)
        const b = await previewAuth(get(`${PREVIEW}/__preview-auth/consume?token=${mine}&to=//evil.com`), config)
        expect(a?.status).toBe(400)
        expect(b?.status).toBe(400)
    })

    it("rejects a callback whose state targets a non-preview host", async () => {
        const state = await sign("preview-state", { host: "evil.com", path: "/" })
        const res = await previewAuth(
            get(`https://kestra.io/__preview-auth/callback?code=c&state=${state}`),
            config,
        )
        expect(res?.status).toBe(400)
    })

    it("rejects a callback with a forged state", async () => {
        const res = await previewAuth(
            get("https://kestra.io/__preview-auth/callback?code=c&state=forged"),
            config,
        )
        expect(res?.status).toBe(400)
    })
})
