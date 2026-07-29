import { describe, it, expect } from "vitest"
import { prevNext, type NavItem } from "./navigation"

describe("prevNext", () => {
    it("skips section headers when landing on the tree's root (not found anywhere)", () => {
        const navigation: NavItem[] = [
            {
                title: "Documentation",
                children: [
                    {
                        title: "Get Started",
                        isSection: true,
                        path: "#",
                        children: [{ path: "/docs/quickstart", title: "Quickstart" }],
                    },
                    {
                        title: "Build",
                        isSection: true,
                        path: "#",
                        children: [{ path: "/docs/tutorial", title: "Tutorial" }],
                    },
                ],
            },
        ]
        const { prev, next } = prevNext(navigation, "/docs")
        expect(prev).toBeUndefined()
        expect(next?.path).toBe("/docs/quickstart")
    })

    it("finds prev/next around the current page in a flat (non-sectioned) tree", () => {
        const navigation: NavItem[] = [
            {
                title: "Documentation",
                children: [
                    { path: "/docs/a", title: "A" },
                    { path: "/docs/b", title: "B" },
                    { path: "/docs/c", title: "C" },
                ],
            },
        ]
        const { prev, next } = prevNext(navigation, "/docs/b")
        expect(prev?.path).toBe("/docs/a")
        expect(next?.path).toBe("/docs/c")
    })

    it("falls back to rootPath for prev when the current page is the tree's first leaf", () => {
        const navigation: NavItem[] = [
            {
                title: "Documentation",
                children: [
                    { path: "/docs/a", title: "A" },
                    { path: "/docs/b", title: "B" },
                ],
            },
        ]
        const { prev } = prevNext(navigation, "/docs/a", "/docs/1.2")
        expect(prev?.path).toBe("/docs/1.2")
    })
})
