import { describe, expect, it } from "vitest"
import { isEventInModal } from "~/utils/modal"

const searchInput = {} as Node
const aiTextarea = {} as Node
const dialog = (open: boolean) => ({
    open,
    contains: (node: Node | null) => node === searchInput,
})

describe("isEventInModal", () => {
    it("accepts keys typed inside the open dialog", () => {
        expect(isEventInModal(dialog(true), { target: searchInput })).toBe(true)
    })

    // Regression: Enter in the Ask AI dialog, stacked over the still-open
    // search dialog, clicked the selected search result and navigated away.
    it("ignores keys typed in a dialog stacked over it", () => {
        expect(isEventInModal(dialog(true), { target: aiTextarea })).toBe(false)
    })

    it("ignores keys while the dialog is closed", () => {
        expect(isEventInModal(dialog(false), { target: searchInput })).toBe(false)
        expect(isEventInModal(null, { target: searchInput })).toBe(false)
    })
})
