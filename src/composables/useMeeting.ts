export function getMeetingUrl() {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    if (timezone.startsWith("America")) {
        // North or South America
        return "https://hs.kestra.io/meetings/luke-lipan?uuid=c75c198e-f6c2-43cb-8e05-d622bd9fa06c&embed=true"
    } else {
        // Everyone else
        return "https://hs.kestra.io/meetings/david76/website?uuid=9eee19c1-782a-48c5-a84a-840ed3d0a99b&embed=true"
    }
}

export function ensureMeetingsScriptLoaded(): Promise<void> {
    return new Promise((resolve) => {
        if (document.querySelector('script[src*="MeetingsEmbedCode.js"]')) {
            resolve()
            return
        }
        const script = document.createElement("script")
        script.src = "https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js"
        script.defer = true
        script.addEventListener("load", () => resolve())
        document.body.appendChild(script)
    })
}