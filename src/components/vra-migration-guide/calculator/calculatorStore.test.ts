import { afterEach, describe, expect, it } from "vitest"
import { nextTick } from "vue"
import { compute } from "~/utils/vra-calculator/compute"
import {
    DEFAULTS,
    SHARE_PARAM,
    STORAGE_KEY,
    resolveInputs,
} from "~/utils/vra-calculator/defaults"
import {
    decodeShareState,
    encodeShareState,
} from "~/utils/vra-calculator/share"
import type { BrowserEnv, StorageLike } from "./browser"
import { createCalculatorStore, type CalculatorStore } from "./calculatorStore"

const PAGE = "https://kestra.io/resources/migration/vra"

function memoryStorage(initial: Record<string, string> = {}) {
    const data = new Map(Object.entries(initial))
    const storage: StorageLike = {
        getItem: (k) => data.get(k) ?? null,
        setItem: (k, v) => void data.set(k, v),
        removeItem: (k) => void data.delete(k),
    }
    return { storage, data }
}

function fakeEnv({
    href = PAGE,
    locales = ["en-US"],
    stored,
}: { href?: string; locales?: string[]; stored?: string } = {}) {
    const { storage, data } = memoryStorage(
        stored ? { [STORAGE_KEY]: stored } : {},
    )
    const state = { href, replaced: [] as string[] }
    const env: BrowserEnv = {
        storage,
        href: () => state.href,
        replaceUrl: (url) => {
            state.href = url
            state.replaced.push(url)
        },
        locales: () => locales,
    }
    return { env, data, state }
}

let store: CalculatorStore
const fresh = () => (store = createCalculatorStore())
afterEach(() => store?.dispose())

describe("before hydrate (SSR and first client render)", () => {
    it("holds the engine defaults and computes from them", () => {
        fresh()
        expect({ ...store.inputs }).toEqual({ ...DEFAULTS })
        expect(store.result.value).toEqual(compute(resolveInputs()))
        expect(store.hydrated.value).toBe(false)
        expect(store.shareUrl()).toBeNull()
    })

    it("ignores a missing browser environment", () => {
        fresh()
        store.hydrate(null)
        expect(store.hydrated.value).toBe(false)
    })
})

describe("hydrate", () => {
    it("picks the currency from the visitor's locale when nothing is saved", () => {
        fresh()
        store.hydrate(fakeEnv({ locales: ["en-GB", "en"] }).env)
        expect(store.inputs.cur).toBe("GBP")
        expect(store.inputs.total).toBe(DEFAULTS.total)
    })

    it("restores saved state, including the saved currency", () => {
        fresh()
        const saved = encodeShareState(
            resolveInputs({ total: "900", cur: "EUR" }),
        )
        store.hydrate(fakeEnv({ stored: saved, locales: ["en-US"] }).env)
        expect(store.inputs.total).toBe("900")
        expect(store.inputs.cur).toBe("EUR")
    })

    it("falls back to defaults for unreadable saved state", () => {
        fresh()
        store.hydrate(
            fakeEnv({ stored: "%%garbage%%", locales: ["fr-FR"] }).env,
        )
        expect({ ...store.inputs }).toEqual({ ...DEFAULTS, cur: "EUR" })
    })

    it("prefers a ?kvc= link over saved state, saves it and removes it from the URL", () => {
        fresh()
        const link = encodeShareState(resolveInputs({ total: 77, cur: "GBP" }))
        const saved = encodeShareState(resolveInputs({ total: 900 }))
        const { env, data, state } = fakeEnv({
            href: `${PAGE}?${SHARE_PARAM}=${link}#section-7-2`,
            stored: saved,
        })
        store.hydrate(env)
        expect(store.inputs.total).toBe(77)
        expect(store.inputs.cur).toBe("GBP")
        expect(state.href).toBe(`${PAGE}#section-7-2`)
        expect(decodeShareState(data.get(STORAGE_KEY))?.total).toBe(77)
    })

    it("fills keys a link leaves out with the defaults and locale currency", () => {
        fresh()
        const partial = Buffer.from(JSON.stringify({ total: 12 })).toString(
            "base64url",
        )
        store.hydrate(
            fakeEnv({ href: `${PAGE}?kvc=${partial}`, locales: ["en-US"] }).env,
        )
        expect(store.inputs.total).toBe(12)
        expect(store.inputs.rate).toBe(DEFAULTS.rate)
        expect(store.inputs.cur).toBe("USD")
    })

    it("drops an unreadable link from the URL and keeps saved state", () => {
        fresh()
        const saved = encodeShareState(resolveInputs({ total: 900 }))
        const { env, state } = fakeEnv({
            href: `${PAGE}?kvc=***&a=1`,
            stored: saved,
        })
        store.hydrate(env)
        expect(store.inputs.total).toBe(900)
        expect(state.href).toBe(`${PAGE}?a=1`)
    })

    it("is idempotent, but still applies a link found on a later call", () => {
        fresh()
        const { env, state } = fakeEnv()
        store.hydrate(env)
        store.setInput("total", "5")
        store.hydrate(env)
        expect(store.inputs.total).toBe("5")

        state.href = `${PAGE}?kvc=${encodeShareState(resolveInputs({ total: 66 }))}`
        store.hydrate(env)
        expect(store.inputs.total).toBe(66)
        expect(state.href).toBe(PAGE)
    })
})

describe("persistence", () => {
    it("saves edits, and one edit updates the result for every view", async () => {
        fresh()
        const { env, data } = fakeEnv()
        store.hydrate(env)
        store.setInput("total", "1000")
        expect(store.result.value.funnel?.total).toBe(1000)
        await nextTick()
        expect(decodeShareState(data.get(STORAGE_KEY))?.total).toBe("1000")
    })

    it("keeps nothing in storage while the state equals the defaults", async () => {
        fresh()
        const { env, data } = fakeEnv({ locales: ["en-US"] })
        store.hydrate(env)
        store.setInput("rate", "120")
        await nextTick()
        expect(data.has(STORAGE_KEY)).toBe(true)
        store.setInput("rate", 100)
        await nextTick()
        expect(data.has(STORAGE_KEY)).toBe(false)
    })

    it("reset returns to the defaults with the locale currency and clears storage", async () => {
        fresh()
        const { env, data } = fakeEnv({ locales: ["en-GB"] })
        store.hydrate(env)
        store.setInput("cur", "USD")
        store.setInput("mult", 5)
        await nextTick()
        expect(data.has(STORAGE_KEY)).toBe(true)
        store.reset()
        await nextTick()
        expect({ ...store.inputs }).toEqual({ ...DEFAULTS, cur: "GBP" })
        expect(data.has(STORAGE_KEY)).toBe(false)
    })

    it("keeps working when storage throws", async () => {
        fresh()
        const { env } = fakeEnv()
        env.storage = {
            getItem: () => {
                throw new Error("blocked")
            },
            setItem: () => {
                throw new Error("quota")
            },
            removeItem: () => {},
        }
        store.hydrate(env)
        store.setInput("total", "3")
        await nextTick()
        expect(store.result.value.funnel?.total).toBe(3)
    })

    it("does not save before hydrate", async () => {
        fresh()
        const { data } = fakeEnv()
        store.setInput("total", "3")
        await nextTick()
        expect(data.size).toBe(0)
    })
})

describe("share and CSV", () => {
    it("builds a ?kvc= link to the current state that decodes back to it", () => {
        fresh()
        store.hydrate(fakeEnv({ href: `${PAGE}?utm=x#section-3-1` }).env)
        store.setInput("total", "250")
        const url = new URL(store.shareUrl("section-7-2")!)
        expect(url.hash).toBe("#section-7-2")
        expect(url.searchParams.get("utm")).toBe("x")
        expect(decodeShareState(url.searchParams.get(SHARE_PARAM))).toEqual({
            ...store.inputs,
        })
    })

    it("exports the current state as CSV", () => {
        fresh()
        store.setInput("total", "250")
        const file = store.csvFile(new Date("2026-10-19T00:00:00Z"))
        expect(file.filename).toBe("vra-kestra-payback.csv")
        expect(file.content).toContain("Generated,2026-10-19")
        expect(file.content).toContain("vRO workflows in the raw export,250")
    })
})
