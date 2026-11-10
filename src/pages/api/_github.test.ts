// Underscore-prefixed so Astro does not build this as the /api/github.test
// route and try to import vitest while prerendering.
import { beforeEach, describe, expect, it, vi } from "vitest"

const { envServer, store } = vi.hoisted(() => ({
    envServer: {
        DISABLE_GITHUB: false,
        GITHUB_TOKEN: undefined as string | undefined,
    },
    store: new Map<string, string>(),
}))

vi.mock("astro:env/server", () => envServer)
vi.mock("cloudflare:workers", () => ({
    env: {
        GITHUB_CACHE: {
            get: async (key: string) => {
                const value = store.get(key)
                return value ? JSON.parse(value) : null
            },
            put: async (key: string, value: string) => {
                store.set(key, value)
            },
        },
    },
}))

const REPO = {
    stargazers_count: 1,
    watchers_count: 2,
    open_issues_count: 3,
    forks: 4,
    network_count: 5,
    subscribers_count: 6,
    size: 7,
}

const contributors = (last: number) =>
    new Response(null, {
        headers: {
            Link: `<https://api.github.com/x?page=${last}>; rel="last"`,
        },
    })

function stubGithub(handlers: {
    contributors: () => Response
    repo: () => Response
}) {
    const fetchMock = vi.fn(async (url: string) =>
        url.includes("/contributors")
            ? handlers.contributors()
            : handlers.repo(),
    )
    vi.stubGlobal("fetch", fetchMock)
    return fetchMock
}

async function get() {
    const { GET } = await import("./github")
    const response = await GET({
        locals: { cfContext: { waitUntil: vi.fn() } },
    } as never)
    return { status: response.status, body: await response.json() }
}

beforeEach(() => {
    vi.resetModules()
    vi.unstubAllGlobals()
    vi.spyOn(console, "error").mockImplementation(() => {})
    store.clear()
    envServer.DISABLE_GITHUB = false
    envServer.GITHUB_TOKEN = undefined
})

describe("GET /api/github", () => {
    it("maps the repo fields and reads contributors from the Link header", async () => {
        stubGithub({
            contributors: () => contributors(742),
            repo: () => Response.json(REPO),
        })

        expect(await get()).toEqual({
            status: 200,
            body: {
                stargazers: 1,
                watchers: 2,
                issues: 3,
                forks: 4,
                network: 5,
                subscribers: 6,
                size: 7,
                contributors: 742,
            },
        })
    })

    it("keeps the contributor count when only the repo call fails", async () => {
        stubGithub({
            contributors: () => contributors(742),
            repo: () => new Response(null, { status: 500 }),
        })

        const { status, body } = await get()

        expect(status).toBe(200)
        expect(body).toMatchObject({ contributors: 742, stargazers: 0 })
    })

    it("returns 503 without caching when both calls fail", async () => {
        const fetchMock = stubGithub({
            contributors: () => new Response(null, { status: 403 }),
            repo: () => new Response(null, { status: 403 }),
        })

        expect((await get()).status).toBe(503)
        expect((await get()).status).toBe(503)
        // The second request hits the cooldown instead of GitHub.
        expect(fetchMock).toHaveBeenCalledTimes(2)
    })

    it("sends GITHUB_TOKEN as a bearer token when set", async () => {
        envServer.GITHUB_TOKEN = "secret"
        const fetchMock = stubGithub({
            contributors: () => contributors(1),
            repo: () => Response.json(REPO),
        })

        await get()

        const [, init] = fetchMock.mock.calls[0] as unknown as [
            string,
            RequestInit,
        ]
        expect(new Headers(init.headers).get("Authorization")).toBe(
            "Bearer secret",
        )
    })
})
