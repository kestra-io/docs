import { afterEach, describe, expect, it, vi } from "vitest"
import { effectScope, nextTick } from "vue"
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
import { createCalculatorStore } from "./calculatorStore"

const PAGE = "https://kestra.io/resources/migration/vra"

/** A store over in-memory storage, with the page URL and locale stubbed. */
function setup({
    href = PAGE,
    languages = ["en-US"],
    stored,
}: { href?: string; languages?: string[]; stored?: string } = {}) {
    const data = new Map(stored ? [[STORAGE_KEY, stored]] : [])
    const location = { href }
    vi.stubGlobal("location", location)
    vi.stubGlobal("navigator", { languages })
    vi.stubGlobal("history", {
        replaceState: (_: unknown, __: string, url: URL) => {
            location.href = url.toString()
        },
    })
    const store = createCalculatorStore({
        getItem: (k) => data.get(k) ?? null,
        setItem: (k, v) => void data.set(k, v),
        removeItem: (k) => void data.delete(k),
    })
    return { store, data, location }
}

afterEach(() => vi.unstubAllGlobals())

describe("before hydrate (SSR and first client render)", () => {
    it("holds the engine defaults, computes from them and saves nothing", async () => {
        const { store, data } = setup()
        expect({ ...store.inputs }).toEqual({ ...DEFAULTS })
        expect(store.result.value).toEqual(compute(resolveInputs()))
        store.update("total", "3")
        await nextTick()
        expect(data.size).toBe(0)
    })
})

describe("hydrate", () => {
    it("picks the currency from the visitor's locale when nothing is saved", () => {
        const { store } = setup({ languages: ["en-GB", "en"] })
        store.hydrate()
        expect(store.inputs.cur).toBe("GBP")
        expect(store.inputs.total).toBe(DEFAULTS.total)
    })

    it("restores saved state, including the saved currency", () => {
        const saved = encodeShareState(
            resolveInputs({ total: "900", cur: "EUR" }),
        )
        const { store } = setup({ stored: saved })
        store.hydrate()
        expect(store.inputs.total).toBe("900")
        expect(store.inputs.cur).toBe("EUR")
    })

    it("falls back to defaults for unreadable saved state", () => {
        const { store } = setup({ stored: "%%garbage%%", languages: ["fr-FR"] })
        store.hydrate()
        expect({ ...store.inputs }).toEqual({ ...DEFAULTS, cur: "EUR" })
    })

    it("prefers a ?kvc= link over saved state, saves it and removes it from the URL", async () => {
        const link = encodeShareState(resolveInputs({ total: 77, cur: "GBP" }))
        const { store, data, location } = setup({
            href: `${PAGE}?${SHARE_PARAM}=${link}#section-7-2`,
            stored: encodeShareState(resolveInputs({ total: 900 })),
        })
        store.hydrate()
        expect(store.inputs.total).toBe(77)
        expect(store.inputs.cur).toBe("GBP")
        expect(location.href).toBe(`${PAGE}#section-7-2`)
        await nextTick()
        expect(decodeShareState(data.get(STORAGE_KEY))?.total).toBe(77)
    })

    it("fills keys a link leaves out with the defaults and locale currency", () => {
        const partial = Buffer.from(JSON.stringify({ total: 12 })).toString(
            "base64url",
        )
        const { store } = setup({ href: `${PAGE}?kvc=${partial}` })
        store.hydrate()
        expect(store.inputs.total).toBe(12)
        expect(store.inputs.rate).toBe(DEFAULTS.rate)
        expect(store.inputs.cur).toBe("USD")
    })

    it("drops an unreadable link from the URL and keeps saved state", () => {
        const { store, location } = setup({
            href: `${PAGE}?kvc=***&a=1`,
            stored: encodeShareState(resolveInputs({ total: 900 })),
        })
        store.hydrate()
        expect(store.inputs.total).toBe(900)
        expect(location.href).toBe(`${PAGE}?a=1`)
    })

    it("is idempotent, but still applies a link found on a later call", () => {
        const { store, location } = setup()
        store.hydrate()
        store.update("total", "5")
        store.hydrate()
        expect(store.inputs.total).toBe("5")

        location.href = `${PAGE}?kvc=${encodeShareState(resolveInputs({ total: 66 }))}`
        store.hydrate()
        expect(store.inputs.total).toBe(66)
        expect(location.href).toBe(PAGE)
    })
})

describe("persistence", () => {
    it("saves edits, and one edit updates the result for every view", async () => {
        const { store, data } = setup()
        store.hydrate()
        store.update("total", "1000")
        expect(store.result.value.funnel?.total).toBe(1000)
        await nextTick()
        expect(decodeShareState(data.get(STORAGE_KEY))?.total).toBe("1000")
    })

    it("keeps nothing in storage while the state equals the defaults", async () => {
        const { store, data } = setup()
        store.hydrate()
        store.update("rate", "120")
        await nextTick()
        expect(data.has(STORAGE_KEY)).toBe(true)
        store.update("rate", 100)
        await nextTick()
        expect(data.has(STORAGE_KEY)).toBe(false)
    })

    it("keeps saving after the island that hydrated it unmounts", async () => {
        const { store, data } = setup()
        const island = effectScope()
        island.run(store.hydrate)
        island.stop()
        store.update("total", "7")
        await nextTick()
        expect(data.has(STORAGE_KEY)).toBe(true)
    })

    it("keeps working when storage throws", async () => {
        setup()
        const store = createCalculatorStore({
            getItem: () => {
                throw new Error("blocked")
            },
            setItem: () => {
                throw new Error("quota")
            },
            removeItem: () => {},
        })
        store.hydrate()
        store.update("total", "3")
        await nextTick()
        expect(store.result.value.funnel?.total).toBe(3)
    })
})

it("builds a ?kvc= link to the current state that decodes back to it", () => {
    const { store } = setup({ href: `${PAGE}?utm=x&kvc=old#section-3-1` })
    store.update("total", "250")
    const url = new URL(store.shareUrl("section-7-2"))
    expect(url.hash).toBe("#section-7-2")
    expect(url.searchParams.get("utm")).toBe("x")
    expect(decodeShareState(url.searchParams.get(SHARE_PARAM))).toEqual({
        ...store.inputs,
    })
})
