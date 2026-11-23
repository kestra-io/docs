import { afterEach, describe, expect, it, vi } from "vitest"
import { parseIconParam, themeIconSrc, updateThemeIcons } from "./themeIcons"

// Just enough DOM for updateThemeIcons: the html class list and a root that
// yields `<img data-theme-responsive>` stand-ins.
function stubDom(dark: boolean, srcs: (string | null)[]) {
    vi.stubGlobal("document", {
        documentElement: {
            classList: { contains: (c: string) => dark && c === "dark" },
        },
    })
    const icons = srcs.map((src) => ({
        src,
        getAttribute: function () {
            return this.src
        },
        setAttribute: function (_name: string, value: string) {
            this.src = value
        },
    }))
    const root = {
        querySelectorAll: (selector: string) =>
            selector === "img[data-theme-responsive]" ? icons : [],
    } as unknown as ParentNode
    return { root, icons }
}

afterEach(() => {
    vi.unstubAllGlobals()
})

describe("themeIconSrc", () => {
    it("appends the theme suffix to a neutral icon", () => {
        expect(
            themeIconSrc("/icons/io.kestra.plugin.git.Clone.svg", true),
        ).toBe("/icons/io.kestra.plugin.git.Clone-white.svg")
        expect(
            themeIconSrc("/icons/io.kestra.plugin.git.Clone.svg", false),
        ).toBe("/icons/io.kestra.plugin.git.Clone-black.svg")
    })

    it("swaps an existing suffix instead of stacking them", () => {
        expect(themeIconSrc("/icons/a-black.svg", true)).toBe(
            "/icons/a-white.svg",
        )
        expect(themeIconSrc("/icons/a-white.svg", false)).toBe(
            "/icons/a-black.svg",
        )
        expect(themeIconSrc("/icons/a-white.svg", true)).toBe(
            "/icons/a-white.svg",
        )
    })

    it("leaves non-svg sources alone", () => {
        expect(themeIconSrc("/logo.png", true)).toBe("/logo.png")
    })
})

describe("updateThemeIcons", () => {
    it("re-points every icon under the root at the current theme", () => {
        const { root, icons } = stubDom(true, [
            "/icons/a.svg",
            "/icons/b-black.svg",
            null,
        ])
        updateThemeIcons(root)
        expect(icons.map((i) => i.src)).toEqual([
            "/icons/a-white.svg",
            "/icons/b-white.svg",
            null,
        ])
    })

    it("defaults to the whole document", () => {
        const { root, icons } = stubDom(false, ["/icons/a-white.svg"])
        vi.stubGlobal("document", {
            documentElement: { classList: { contains: () => false } },
            querySelectorAll: root.querySelectorAll,
        })
        updateThemeIcons()
        expect(icons[0].src).toBe("/icons/a-black.svg")
    })
})

describe("parseIconParam", () => {
    it("returns the class unchanged when there is no variant", () => {
        expect(parseIconParam("io.kestra.plugin.git.Clone")).toEqual({
            cls: "io.kestra.plugin.git.Clone",
        })
    })

    it("strips a -white / -black variant", () => {
        expect(parseIconParam("io.kestra.plugin.git.Clone-white")).toEqual({
            cls: "io.kestra.plugin.git.Clone",
            modifier: "white",
        })
        expect(parseIconParam("io.kestra.plugin.git.Clone-black")).toEqual({
            cls: "io.kestra.plugin.git.Clone",
            modifier: "black",
        })
    })

    it("keeps hyphens that belong to the plugin group", () => {
        expect(parseIconParam("io.kestra.plugin.ee.new-relic")).toEqual({
            cls: "io.kestra.plugin.ee.new-relic",
        })
        expect(parseIconParam("io.kestra.plugin.ee.new-relic-white")).toEqual({
            cls: "io.kestra.plugin.ee.new-relic",
            modifier: "white",
        })
    })

    it("does not treat the round trip of themeIconSrc as part of the class", () => {
        const src = themeIconSrc(
            "/icons/io.kestra.plugin.ee.new-relic.svg",
            true,
        )
        const param = src.replace(/^\/icons\//, "").replace(/\.svg$/, "")
        expect(parseIconParam(param).cls).toBe("io.kestra.plugin.ee.new-relic")
    })
})
