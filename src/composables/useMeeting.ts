export const CONNOR_MEETING_LINK =
    "https://meetings-eu1.hubspot.com/connor-alkin/website?embed=true"
export const DAVID_MEETING_LINK =
    "https://hs.kestra.io/meetings/david76/website?uuid=9eee19c1-782a-48c5-a84a-840ed3d0a99b&embed=true"
export const LUKE_MEETING_LINK =
    "https://hs.kestra.io/meetings/luke-lipan?uuid=c75c198e-f6c2-43cb-8e05-d622bd9fa06c&embed=true"

export type Tier = "T1" | "T2" | "T3"

export function tierFromEmployees(value: string): Tier {
    if (value === "1000+") return "T1"
    if (value === "between 100 and 999") return "T2"
    return "T3"
}

export function getGeoMeetingUrl() {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    if (timezone.startsWith("America")) {
        return LUKE_MEETING_LINK
    } else {
        return DAVID_MEETING_LINK
    }
}

export function getMeetingUrl(tier?: Tier) {
    if (tier === "T1") {
        return getGeoMeetingUrl()
    }
    return CONNOR_MEETING_LINK
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