import { SignJWT } from "jose"
import { describe, expect, it } from "vitest"
import { isPreviewHost, previewAuth } from "./previewAuth"

const config = { clientId: "id", clientSecret: "cs", secret: "s3cret" }
const key = new TextEncoder().encode(config.secret)
const CALLBACK = "https://kestra.io/__preview-auth/callback"

const sign = (audience: string, payload: Record<string, string>) =>
    new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setAudience(audience)
        .setIssuedAt()
        .setExpirationTime("5m")
        .sign(key)

const get = (url: string) => new Request(url)

describe("isPreviewHost", () => {
    it("matches every kestra-io.workers.dev host", () => {
        expect(isPreviewHost("ks-a-docs.kestra-io.workers.dev")).toBe(true)
        expect(isPreviewHost("kestra-io.workers.dev")).toBe(true)
    })

    it("rejects production and lookalike hosts", () => {
        expect(isPreviewHost("kestra.io")).toBe(false)
        expect(isPreviewHost("evilkestra-io.workers.dev")).toBe(false)
        expect(isPreviewHost("kestra-io.workers.dev.evil.com")).toBe(false)
    })
})

describe("previewAuth callback", () => {
    it("ignores every other path and host", async () => {
        expect(await previewAuth(get("https://kestra.io/docs"), config)).toBeNull()
        expect(
            await previewAuth(get("https://ks-a-docs.kestra-io.workers.dev/__preview-auth/callback"), config),
        ).toBeNull()
    })

    it("fails closed when secrets are missing", async () => {
        expect((await previewAuth(get(CALLBACK), {}))?.status).toBe(403)
    })

    it("rejects a missing code or state", async () => {
        expect((await previewAuth(get(CALLBACK), config))?.status).toBe(400)
    })

    it("rejects a forged state", async () => {
        const res = await previewAuth(get(`${CALLBACK}?code=c&state=forged`), config)
        expect(res?.status).toBe(400)
    })

    it("rejects a state targeting a non-preview host or unsafe path", async () => {
        for (const payload of [
            { host: "evil.com", path: "/" },
            { host: "ks-a-docs.kestra-io.workers.dev", path: "//evil.com" },
        ]) {
            const state = await sign("preview-state", payload)
            const res = await previewAuth(get(`${CALLBACK}?code=c&state=${state}`), config)
            expect(res?.status).toBe(400)
        }
    })
})
