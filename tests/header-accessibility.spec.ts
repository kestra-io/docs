import { test, expect } from "@playwright/test"

const DESKTOP_BREAKPOINT = 1200

const menuTrigger = (id: string) => `[data-desktop-menu-trigger="${id}"]`

test.describe("Header accessibility", () => {
    test.skip(
        ({ browserName }) => browserName !== "chromium",
        "Header accessibility tests run in Chromium",
    )

    test("keeps desktop top-level navigation roles semantic", async ({
        page,
    }) => {
        await page.setViewportSize({ width: 1280, height: 720 })

        await page.goto("/", { waitUntil: "networkidle" })

        await expect(page.locator(menuTrigger("product"))).toHaveAttribute(
            "aria-controls",
            "product",
        )
        await expect(page.locator(menuTrigger("solutions"))).toHaveAttribute(
            "aria-controls",
            "solutions",
        )
        await expect(page.locator(menuTrigger("resources"))).toHaveAttribute(
            "aria-controls",
            "resources",
        )
        await expect(page.locator(menuTrigger("company"))).toHaveAttribute(
            "aria-controls",
            "company",
        )

        const pluginsLink = page.locator(
            '#main-header a.nav-link[href="/plugins"]',
        )
        await expect(pluginsLink).toBeVisible()
        await expect(pluginsLink).not.toHaveAttribute("role", "button")
    })

    test("opens desktop dropdowns on focus and keeps the header reachable by keyboard", async ({
        page,
    }) => {
        await page.setViewportSize({ width: 1280, height: 720 })

        await page.goto("/", { waitUntil: "networkidle" })

        const product = page.locator(menuTrigger("product"))
        const solutions = page.locator(menuTrigger("solutions"))
        const plugins = page.locator('#main-header a.nav-link[href="/plugins"]')
        const firstProductItem = page.locator(
            '#product a.dropdown-item[href="/features"]',
        )
        const firstSolutionsItem = page.locator(
            '#solutions a.dropdown-item[href="/data"]',
        )
        const lastSolutionsItem = page.locator(
            '#solutions a.dropdown-item[href="/use-cases/healthcare"]',
        )

        await product.focus()
        await expect(product).toBeFocused()
        await expect(product).toHaveAttribute("aria-expanded", "true")
        await expect(page.locator("#product")).toHaveAttribute(
            "aria-hidden",
            "false",
        )

        await page.keyboard.press("Tab")
        await expect(solutions).toBeFocused()
        await expect(product).toHaveAttribute("aria-expanded", "false")
        await expect(solutions).toHaveAttribute("aria-expanded", "true")

        await page.keyboard.press("Enter")
        await expect(firstSolutionsItem).toBeFocused()

        await page.keyboard.press("Shift+Tab")
        await expect(solutions).toBeFocused()

        await page.keyboard.press("Enter")
        await expect(firstSolutionsItem).toBeFocused()

        await lastSolutionsItem.focus()
        await expect(lastSolutionsItem).toBeFocused()
        await page.keyboard.press("Tab")
        await expect(plugins).toBeFocused()
        await expect(solutions).toHaveAttribute("aria-expanded", "false")

        await product.focus()
        await page.keyboard.press("Enter")
        await expect(firstProductItem).toBeFocused()
        await page.keyboard.press("Escape")
        await expect(product).toBeFocused()
        await expect(product).toHaveAttribute("aria-expanded", "false")
    })

    for (const key of ["ArrowDown", " "]) {
        const label = key === " " ? "Space" : key
        test(`${label} on a desktop dropdown trigger opens the menu and focuses the first item`, async ({
            page,
        }) => {
            await page.setViewportSize({ width: 1280, height: 720 })
            await page.goto("/", { waitUntil: "networkidle" })

            const trigger = page.locator(menuTrigger("product"))
            await trigger.focus()
            await page.keyboard.press(key)

            await expect(trigger).toHaveAttribute("aria-expanded", "true")
            await expect(
                page.locator("#product a.dropdown-item").first(),
            ).toBeFocused()
        })
    }

    test("inert attribute tracks the active desktop menu", async ({ page }) => {
        await page.setViewportSize({ width: 1280, height: 720 })
        await page.goto("/", { waitUntil: "networkidle" })

        for (const id of ["product", "solutions", "resources", "company"]) {
            await expect(page.locator(`#${id}`)).toHaveAttribute("inert", "")
        }

        await page.locator(menuTrigger("product")).focus()
        await page.keyboard.press("Enter")

        await expect(page.locator("#product")).not.toHaveAttribute("inert", "")
        for (const id of ["solutions", "resources", "company"]) {
            await expect(page.locator(`#${id}`)).toHaveAttribute("inert", "")
        }
    })

    test("clicking an already-open desktop trigger keeps the menu open", async ({
        page,
    }) => {
        await page.setViewportSize({ width: 1280, height: 720 })
        await page.goto("/", { waitUntil: "networkidle" })

        const trigger = page.locator(menuTrigger("product"))
        await trigger.click()
        await expect(trigger).toHaveAttribute("aria-expanded", "true")

        await trigger.click()
        await expect(trigger).toHaveAttribute("aria-expanded", "true")
        await expect(page.locator("#product")).not.toHaveAttribute("inert", "")
    })

    test("tabbing from a dropdown trigger to a sibling non-dropdown link closes the menu", async ({
        page,
    }) => {
        await page.setViewportSize({ width: 1280, height: 720 })
        await page.goto("/", { waitUntil: "networkidle" })

        const solutions = page.locator(menuTrigger("solutions"))
        const plugins = page.locator(
            '#main-header a.nav-link[href="/plugins"]',
        )

        await solutions.focus()
        await expect(solutions).toHaveAttribute("aria-expanded", "true")

        await plugins.focus()
        await expect(plugins).toBeFocused()
        await expect(solutions).toHaveAttribute("aria-expanded", "false")
        await expect(page.locator("#solutions")).toHaveAttribute("inert", "")
    })

    test("focus leaving the navbar closes the open desktop menu", async ({
        page,
    }) => {
        await page.setViewportSize({ width: 1280, height: 720 })
        await page.goto("/", { waitUntil: "networkidle" })

        const trigger = page.locator(menuTrigger("product"))
        await trigger.focus()
        await page.keyboard.press("Enter")
        await expect(trigger).toHaveAttribute("aria-expanded", "true")

        await page.evaluate(() => {
            const target =
                (document.querySelector("main") as HTMLElement | null) ??
                (document.body as HTMLElement)
            target.setAttribute("tabindex", "-1")
            target.focus()
        })

        await expect(trigger).toHaveAttribute("aria-expanded", "false")
        await expect(page.locator("#product")).toHaveAttribute("inert", "")
    })

    test("mobile dropdown triggers control the mobile menus", async ({
        page,
    }) => {
        await page.setViewportSize({
            width: DESKTOP_BREAKPOINT - 1,
            height: 844,
        })

        await page.goto("/", { waitUntil: "networkidle" })
        await page
            .getByRole("button", { name: "Toggle navigation" })
            .click()

        for (const id of ["product", "solutions", "resources", "company"]) {
            await expect(page.locator(menuTrigger(id))).toHaveAttribute(
                "aria-controls",
                `${id}-mobile-menu`,
            )
            await expect(page.locator(`#${id}-mobile-menu`)).toBeHidden()
        }

        const product = page.locator(menuTrigger("product"))
        await product.click()

        await expect(product).toHaveAttribute("aria-expanded", "true")
        await expect(page.locator("#product-mobile-menu")).toBeVisible()
        await expect(page.locator("#product")).toBeHidden()
    })
})
