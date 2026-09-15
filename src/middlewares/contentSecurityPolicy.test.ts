import { describe, expect, it } from "vitest"
import { buildContentSecurityPolicy } from "./contentSecurityPolicy"

function directive(csp: string, name: string): string {
    const line = csp.split("; ").find((part) => part.split(" ")[0] === name)
    expect(line, `${name} missing from the policy`).toBeDefined()
    return line as string
}

describe("buildContentSecurityPolicy", () => {
    const production = buildContentSecurityPolicy(new URL("https://kestra.io/"))
    const local = buildContentSecurityPolicy(new URL("http://localhost:8787/"))

    it("allows the Google Ads conversion pixel as script and image", () => {
        expect(directive(production, "script-src")).toContain(
            "https://*.g.doubleclick.net",
        )
        expect(directive(production, "img-src")).toContain(
            "https://*.g.doubleclick.net",
        )
    })

    it("allows the googleadservices conversion beacon as script and image", () => {
        expect(directive(production, "script-src")).toContain(
            "https://www.googleadservices.com",
        )
        expect(directive(production, "img-src")).toContain(
            "https://www.googleadservices.com",
        )
    })

    it("keeps loopback out of the production policy", () => {
        expect(production).not.toContain("localhost")
        expect(production).not.toContain("127.0.0.1")
        expect(production).toContain("upgrade-insecure-requests")
    })

    it("allows loopback connections over http only", () => {
        const connect = directive(local, "connect-src")
        expect(connect).toContain("http://127.0.0.1:*")
        expect(connect).toContain("http://localhost:8787")
        expect(connect).toContain("ws://localhost:*")
        expect(directive(local, "img-src")).not.toContain("127.0.0.1")
        expect(local).not.toContain("upgrade-insecure-requests")
    })

    it("does not widen object-src", () => {
        expect(directive(local, "object-src")).toBe("object-src 'none'")
    })
})
