const ICONS = {
    copy: "M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z",
    check: "M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,6.58L21,7Z",
}

const icon = (name: keyof typeof ICONS): string =>
    `<svg class="icon-${name}" viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="${ICONS[name]}"/></svg>`

const COPY_BUTTON = `<button class="code-copy" type="button" title="Copy to clipboard" aria-label="Copy code to clipboard">${icon("copy")}${icon("check")}</button>`

export function injectCopyButtons(html: string): string {
    return html.replaceAll("<pre>", `<pre>${COPY_BUTTON}`)
}

// How long the copied state stays visible. Matches Copy.vue and
// SchemaToCode.vue so every copy affordance on the site behaves the same.
const FEEDBACK_DURATION = 2000

let liveRegion: HTMLElement | null = null
let liveTimer: ReturnType<typeof setTimeout> | undefined

function getLiveRegion(): HTMLElement {
    if (liveRegion && liveRegion.isConnected) return liveRegion
    liveRegion = document.createElement("span")
    liveRegion.setAttribute("aria-live", "polite")
    liveRegion.setAttribute(
        "style",
        "position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0",
    )
    document.body.appendChild(liveRegion)
    return liveRegion
}

function announce(message: string): void {
    const live = getLiveRegion()
    clearTimeout(liveTimer)

    // Empty the region first: screen readers skip a mutation that leaves the
    // text unchanged, so copying twice in a row would only announce once.
    live.textContent = ""
    setTimeout(() => {
        live.textContent = message
    })

    liveTimer = setTimeout(() => {
        live.textContent = ""
    }, FEEDBACK_DURATION)
}

const resetTimers = new WeakMap<HTMLElement, ReturnType<typeof setTimeout>>()

/**
 * Copy `text` and confirm it on `button`: a `copied` class for the icon swap,
 * plus a live-region announcement for screen readers. Shared by the injected
 * markdown copy buttons and the get-started hero so both stay in step.
 */
export async function copyWithFeedback(
    button: HTMLElement,
    text: string,
): Promise<void> {
    if (!navigator.clipboard || !text) {
        return
    }

    try {
        await navigator.clipboard.writeText(text)
    } catch (error) {
        // Nothing was copied, so don't claim otherwise.
        console.error("Failed to copy to clipboard: ", error)
        return
    }

    button.classList.add("copied")
    announce("Copied to clipboard")

    clearTimeout(resetTimers.get(button))
    resetTimers.set(
        button,
        setTimeout(() => {
            button.classList.remove("copied")
            resetTimers.delete(button)
        }, FEEDBACK_DURATION),
    )
}

export function handleCopyClick({ target }: MouseEvent): void {
    const button = (target as HTMLElement).closest<HTMLButtonElement>(
        ".code-copy",
    )
    const code = button?.parentElement?.querySelector("code")

    if (!button || !code) {
        return
    }

    void copyWithFeedback(button, code.textContent?.trimEnd() ?? "")
}
