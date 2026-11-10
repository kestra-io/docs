import { afterEach, describe, expect, it, vi } from "vitest"
import { copyWithFeedback } from "./code-copy"

// Just enough DOM for copyWithFeedback: a button's classList and a body to
// hold the live region.
function stubDom(writeText?: (text: string) => Promise<void>) {
    const live = { setAttribute() {}, textContent: "", isConnected: true }
    vi.stubGlobal("document", {
        createElement: () => live,
        body: { appendChild() {} },
    })
    vi.stubGlobal("navigator", writeText ? { clipboard: { writeText } } : {})
    const classes = new Set<string>()
    const button = {
        classList: {
            add: (c: string) => classes.add(c),
            remove: (c: string) => classes.delete(c),
        },
    } as unknown as HTMLElement
    return { button, classes, live }
}

afterEach(() => {
    vi.unstubAllGlobals()
    vi.useRealTimers()
})

describe("copyWithFeedback", () => {
    it("copies, marks the button and reports success", async () => {
        vi.useFakeTimers()
        const written: string[] = []
        const { button, classes, live } = stubDom(async (t) => {
            written.push(t)
        })
        expect(
            await copyWithFeedback(button, "pipx install x", "Link copied."),
        ).toBe(true)
        expect(written).toEqual(["pipx install x"])
        expect(classes.has("copied")).toBe(true)
        vi.advanceTimersByTime(0)
        expect(live.textContent).toBe("Link copied.")
    })

    it("reports failure, without marking the button, when the clipboard rejects", async () => {
        vi.spyOn(console, "error").mockImplementation(() => {})
        const { button, classes } = stubDom(() =>
            Promise.reject(new Error("denied")),
        )
        expect(await copyWithFeedback(button, "x")).toBe(false)
        expect(classes.has("copied")).toBe(false)
    })

    it("reports failure without a clipboard or text", async () => {
        const { button } = stubDom()
        expect(await copyWithFeedback(button, "x")).toBe(false)
        const withClipboard = stubDom(async () => {})
        expect(await copyWithFeedback(withClipboard.button, "")).toBe(false)
    })
})
