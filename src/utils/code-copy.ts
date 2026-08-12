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

export function handleCopyClick({ target }: MouseEvent): void {
    const button = (target as HTMLElement).closest<HTMLButtonElement>(
        ".code-copy",
    )
    const code = button?.parentElement?.querySelector("code")

    if (!button || !code || !navigator.clipboard) {
        return
    }

    void navigator.clipboard.writeText(code.textContent?.trimEnd() ?? "")
    button.classList.add("copied")

    setTimeout(() => {
        button.classList.remove("copied")
    }, 2000)
}
