import { TERRITORY_ATTR, type VisitorTerritory } from "~/utils/territory"
import { tierFromEmployees, type Tier } from "~/utils/leadTier"

export { tierFromEmployees }
export type { Tier }

export const CONNOR_MEETING_LINK =
    "https://meetings-eu1.hubspot.com/connor-alkin/website?embed=true"
export const CONNOR_CLOUD_MEETING_LINK =
    "https://meetings-eu1.hubspot.com/connor-alkin/cloud?embed=true"
export const DAVID_MEETING_LINK =
    "https://hs.kestra.io/meetings/david76/website?uuid=9eee19c1-782a-48c5-a84a-840ed3d0a99b&embed=true"
export const LUKE_MEETING_LINK =
    "https://hs.kestra.io/meetings/luke-lipan?uuid=c75c198e-f6c2-43cb-8e05-d622bd9fa06c&embed=true"
export const JONATHAN_MEETING_LINK =
    "https://meetings-eu1.hubspot.com/jonathan-lowe?embed=true"

export interface MeetingOptions {
    fallback?: string
    territory?: VisitorTerritory
}

export function isAmericasTimezone() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone.startsWith("America")
}

function visitorTerritory(): VisitorTerritory {
    const value = document.documentElement.getAttribute(TERRITORY_ATTR)
    return (value as VisitorTerritory | null) ?? "unknown"
}

function americasMeetingUrl(territory: VisitorTerritory) {
    if (territory === "us-west" || territory === "canada") return LUKE_MEETING_LINK
    if (territory === "us-east" || territory === "latam") return JONATHAN_MEETING_LINK
    if (territory === "unknown" && isAmericasTimezone()) return LUKE_MEETING_LINK
    return undefined
}

export function getGeoMeetingUrl(territory: VisitorTerritory = visitorTerritory()) {
    return americasMeetingUrl(territory) ?? DAVID_MEETING_LINK
}

export function getMeetingUrl(
    tier?: Tier,
    { fallback = CONNOR_MEETING_LINK, territory }: MeetingOptions = {},
) {
    if (tier === "T1") return getGeoMeetingUrl(territory)
    if (tier === "T2") return americasMeetingUrl(territory ?? visitorTerritory()) ?? fallback
    return fallback
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
        script.addEventListener("error", () => resolve())
        setTimeout(resolve, 3000)
        document.body.appendChild(script)
    })
}
