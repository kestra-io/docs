import { chromium, devices } from "@playwright/test"

// PLAYWRIGHT_CHROMIUM lets a sandbox point at a preinstalled binary.
const LAUNCH = process.env.PLAYWRIGHT_CHROMIUM
    ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM }
    : {}
const URL = "http://127.0.0.1:4173/harness/index.html"
const out = []
const check = (n, ok, d = "") => { out.push(ok); console.log(`${ok ? "PASS" : "FAIL"}  ${n}${d ? "  :: " + d : ""}`) }
const b = await chromium.launch(LAUNCH)

// mobile: collapses start closed and animate open
const ctx = await b.newContext({ ...devices["iPhone 13"] })
const p = await ctx.newPage()
p.on("pageerror", (e) => check("no page error", false, e.message))
await p.goto(URL, { waitUntil: "load" })
await p.waitForTimeout(800)

const h = (sel) => p.evaluate((s) => document.querySelector(s)?.getBoundingClientRect().height ?? -1, sel)

for (const [name, btn, panel] of [
    ["docs menu", 'button[aria-controls="docs-menu"]', "#docs-menu"],
    ["toc", ".toc-toggle", "#tocContents"],
]) {
    const closed = await h(panel)
    check(`${name} starts collapsed`, closed >= 0 && closed < 5, `h=${closed}`)
    await p.click(btn)
    await p.waitForTimeout(600)
    const open = await h(panel)
    check(`${name} expands`, open > 50, `h=${open}`)
    const aria = await p.evaluate((s) => document.querySelector(s)?.getAttribute("aria-expanded"), btn)
    check(`${name} aria-expanded true`, aria === "true", `aria=${aria}`)
    await p.click(btn)
    await p.waitForTimeout(600)
    const reclosed = await h(panel)
    check(`${name} collapses again`, reclosed < 5, `h=${reclosed}`)
}
await ctx.close()

// desktop: both panels are always open, no toggle needed
const dctx = await b.newContext({ viewport: { width: 1280, height: 900 } })
const dp = await dctx.newPage()
dp.on("pageerror", (e) => check("no page error (desktop)", false, e.message))
await dp.goto(URL, { waitUntil: "load" })
await dp.waitForTimeout(800)
for (const [name, sel] of [["docs menu", "#docs-menu"], ["toc", "#tocContents"]]) {
    const hh = await dp.evaluate((s) => document.querySelector(s)?.getBoundingClientRect().height ?? -1, sel)
    check(`${name} open by default on desktop`, hh > 50, `h=${hh}`)
}

// markdown actions dropdown
const trigger = dp.locator(".markdown-actions-trigger").first()
check("markdown actions trigger present", (await trigger.count()) > 0)
if (await trigger.count()) {
    check("menu hidden initially", !(await dp.locator(".markdown-actions-menu").first().isVisible()))
    await trigger.click(); await dp.waitForTimeout(300)
    check("menu opens on click", await dp.locator(".markdown-actions-menu").first().isVisible())
    const box = await dp.locator(".markdown-actions-menu").first().boundingBox()
    const tb = await trigger.boundingBox()
    check("menu positioned under trigger", !!box && !!tb && box.y > tb.y, JSON.stringify({ menuY: box?.y, trigY: tb?.y }))
    await dp.keyboard.press("Escape"); await dp.waitForTimeout(300)
    check("menu closes on Escape", !(await dp.locator(".markdown-actions-menu").first().isVisible()))
    await trigger.click(); await dp.waitForTimeout(300)
    await dp.mouse.click(5, 5); await dp.waitForTimeout(300)
    check("menu closes on outside click", !(await dp.locator(".markdown-actions-menu").first().isVisible()))
}
// blog toc + custom select
{
    const mctx = await b.newContext({ ...devices["iPhone 13"] })
    const mp = await mctx.newPage()
    mp.on("pageerror", (e) => check("no page error (blogtoc)", false, e.message))
    await mp.goto(URL, { waitUntil: "load" })
    await mp.waitForTimeout(800)
    const bh = () => mp.evaluate(() => document.querySelector(".blog-toc-host .bd-toc-collapse")?.getBoundingClientRect().height ?? -1)
    const closed = await bh()
    check("blog toc starts collapsed", closed >= 0 && closed < 5, `h=${closed}`)
    await mp.click(".blog-toc-host .toggle")
    await mp.waitForTimeout(600)
    const opened = await bh()
    check("blog toc expands", opened > 50, `h=${opened}`)
    await mctx.close()
}

{
    const sel = dp.locator(".select-wrapper .btn-custom").first()
    check("custom select trigger present", (await sel.count()) > 0)
    check("select menu hidden initially", !(await dp.locator(".select-menu").first().isVisible()))
    await sel.click(); await dp.waitForTimeout(300)
    check("select menu opens", await dp.locator(".select-menu").first().isVisible())
    await dp.locator(".select-item", { hasText: "Oldest" }).first().click()
    await dp.waitForTimeout(300)
    check("select closes after choosing", !(await dp.locator(".select-menu").first().isVisible()))
    check("select emits the value", (await dp.locator(".selected-readout").innerText()) === "oldest",
        await dp.locator(".selected-readout").innerText())
    await sel.click(); await dp.waitForTimeout(200)
    await dp.mouse.click(5, 5); await dp.waitForTimeout(300)
    check("select closes on outside click", !(await dp.locator(".select-menu").first().isVisible()))
}

// native <dialog> modals
{
    await dp.evaluate(() => {
        const btn = document.createElement("button")
        btn.id = "probe-modal-trigger"
        btn.dataset.modalTarget = "#search-modal"
        btn.textContent = "open"
        btn.style.cssText = "position:fixed;bottom:0;left:0;z-index:99999"
        document.body.append(btn)
    })
    check("search dialog closed initially",
        !(await dp.evaluate(() => document.querySelector("#search-modal")?.open)))
    await dp.click("#probe-modal-trigger")
    await dp.waitForTimeout(400)
    check("data-modal-target opens the dialog",
        await dp.evaluate(() => document.querySelector("#search-modal")?.open === true))
    check("dialog is in the top layer",
        await dp.evaluate(() => document.querySelector("#search-modal").matches(":modal")))
    check("body scroll locked while open",
        (await dp.evaluate(() => getComputedStyle(document.body).overflow)) === "hidden")
    await dp.keyboard.press("Escape")
    await dp.waitForTimeout(400)
    check("dialog closes on Escape",
        !(await dp.evaluate(() => document.querySelector("#search-modal")?.open)))
    check("body scroll restored",
        (await dp.evaluate(() => getComputedStyle(document.body).overflow)) !== "hidden")
    await dp.click("#probe-modal-trigger")
    await dp.waitForTimeout(400)
    await dp.mouse.click(5, 5)
    await dp.waitForTimeout(400)
    check("dialog closes on backdrop click",
        !(await dp.evaluate(() => document.querySelector("#search-modal")?.open)))
}

await b.close()
const failed = out.filter((o) => !o).length
console.log(`\n${out.length - failed}/${out.length} passed`)
process.exit(failed ? 1 : 0)
