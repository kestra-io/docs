export const TERRITORY_ATTR = "data-kestra-territory"

export type Territory = "us-west" | "us-east" | "canada" | "latam" | "row"
export type VisitorTerritory = Territory | "unknown"

const US_WEST_STATES = new Set([
    "WA", "OR", "CA", "NV", "ID", "MT", "WY", "UT", "CO", "AZ",
    "NM", "ND", "SD", "NE", "KS", "OK", "TX", "AK", "HI",
])

const LATAM_COUNTRIES = new Set([
    "MX", "GT", "BZ", "SV", "HN", "NI", "CR", "PA",
    "CU", "DO", "HT", "JM", "PR", "TT", "BS", "BB", "AG", "DM", "GD", "KN", "LC", "VC",
    "CO", "VE", "GY", "SR", "GF", "EC", "PE", "BO", "BR", "PY", "UY", "AR", "CL",
])

export function territoryFor(
    country?: string | null,
    region?: string | null,
): Territory {
    const c = (country ?? "").toUpperCase()
    const r = (region ?? "").toUpperCase()
    if (c === "US") return US_WEST_STATES.has(r) ? "us-west" : "us-east"
    if (c === "CA") return "canada"
    if (LATAM_COUNTRIES.has(c)) return "latam"
    return "row"
}
