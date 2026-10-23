import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const props: Record<string, unknown> = {}
const register = vi.fn((p: Record<string, unknown>) => Object.assign(props, p))
const unregister = vi.fn((name: string) => delete props[name])
const setPersonProperties = vi.fn()
vi.mock("posthog-js", () => ({
    default: {
        get_property: (name: string) => props[name],
        register: (p: Record<string, unknown>) => register(p),
        unregister: (name: string) => unregister(name),
        setPersonProperties: (p: Record<string, unknown>) => setPersonProperties(p),
    },
}))

import { isInternalVisitor, readInternalFlagFromUrl, tagInternalVisitor } from "./internalVisitor"

let store: Record<string, string>
const replaceState = vi.fn()

const visit = (href: string) => {
    const url = new URL(href)
    vi.stubGlobal("window", { location: { href: url.href, search: url.search } })
}

beforeEach(() => {
    store = {}
    for (const k of Object.keys(props)) delete props[k]
    register.mockClear()
    unregister.mockClear()
    setPersonProperties.mockClear()
    replaceState.mockClear()
    vi.stubGlobal("localStorage", {
        getItem: (k: string) => store[k] ?? null,
        setItem: (k: string, v: string) => {
            store[k] = v
        },
        removeItem: (k: string) => {
            delete store[k]
        },
    })
    vi.stubGlobal("history", { state: { index: 3 }, replaceState })
})

afterEach(() => {
    vi.unstubAllGlobals()
})

describe("readInternalFlagFromUrl", () => {
    it("stores the flag and strips only its own parameter from the address bar", () => {
        visit("https://kestra.io/pricing?kestra_internal=1&utm_source=slack#plans")
        readInternalFlagFromUrl()

        expect(isInternalVisitor()).toBe(true)
        expect(replaceState).toHaveBeenCalledWith({ index: 3 }, "", "/pricing?utm_source=slack#plans")
    })

    it("clears the flag with kestra_internal=0", () => {
        store.ka_internal = "1"
        visit("https://kestra.io/?kestra_internal=0")
        readInternalFlagFromUrl()

        expect(isInternalVisitor()).toBe(false)
        expect(replaceState).toHaveBeenCalledWith({ index: 3 }, "", "/")
    })

    it("leaves the URL and the flag alone when the parameter is absent", () => {
        visit("https://kestra.io/docs?utm_source=newsletter")
        readInternalFlagFromUrl()

        expect(isInternalVisitor()).toBe(false)
        expect(replaceState).not.toHaveBeenCalled()
    })

    it("does not throw when localStorage is unavailable", () => {
        vi.stubGlobal("localStorage", {
            setItem: () => {
                throw new Error("blocked")
            },
        })
        visit("https://kestra.io/?kestra_internal=1")

        expect(() => readInternalFlagFromUrl()).not.toThrow()
        expect(isInternalVisitor()).toBe(false)
    })
})

describe("tagInternalVisitor", () => {
    it("registers is_internal on events and on the person once flagged", () => {
        store.ka_internal = "1"
        tagInternalVisitor()

        expect(register).toHaveBeenCalledWith({ is_internal: true })
        expect(setPersonProperties).toHaveBeenCalledWith({ is_internal: true })
    })

    it("sends nothing on later navigations while the flag is unchanged", () => {
        store.ka_internal = "1"
        tagInternalVisitor()
        tagInternalVisitor()

        expect(register).toHaveBeenCalledTimes(1)
        expect(setPersonProperties).toHaveBeenCalledTimes(1)
    })

    it("removes the property when the flag is cleared", () => {
        props.is_internal = true
        tagInternalVisitor()

        expect(unregister).toHaveBeenCalledWith("is_internal")
        expect(setPersonProperties).toHaveBeenCalledWith({ is_internal: false })
    })

    it("does nothing for an ordinary visitor", () => {
        tagInternalVisitor()

        expect(register).not.toHaveBeenCalled()
        expect(unregister).not.toHaveBeenCalled()
        expect(setPersonProperties).not.toHaveBeenCalled()
    })
})
