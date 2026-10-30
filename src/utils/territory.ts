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

const COUNTRY_CODES: Record<string, string> = {
    "united states": "US",
    usa: "US",
    "united states of america": "US",
    canada: "CA",
    mexico: "MX",
    guatemala: "GT",
    belize: "BZ",
    "el salvador": "SV",
    honduras: "HN",
    nicaragua: "NI",
    "costa rica": "CR",
    panama: "PA",
    cuba: "CU",
    "dominican republic": "DO",
    haiti: "HT",
    jamaica: "JM",
    "puerto rico": "PR",
    "trinidad and tobago": "TT",
    bahamas: "BS",
    barbados: "BB",
    "antigua and barbuda": "AG",
    dominica: "DM",
    grenada: "GD",
    "saint kitts and nevis": "KN",
    "saint lucia": "LC",
    "saint vincent and the grenadines": "VC",
    colombia: "CO",
    venezuela: "VE",
    guyana: "GY",
    suriname: "SR",
    "french guiana": "GF",
    ecuador: "EC",
    peru: "PE",
    bolivia: "BO",
    brazil: "BR",
    paraguay: "PY",
    uruguay: "UY",
    argentina: "AR",
    chile: "CL",
}

const OTHER_COUNTRY = "ZZ"

const STATE_CODES: Record<string, string> = {
    alabama: "AL",
    alaska: "AK",
    arizona: "AZ",
    arkansas: "AR",
    california: "CA",
    colorado: "CO",
    connecticut: "CT",
    delaware: "DE",
    "district of columbia": "DC",
    florida: "FL",
    georgia: "GA",
    hawaii: "HI",
    idaho: "ID",
    illinois: "IL",
    indiana: "IN",
    iowa: "IA",
    kansas: "KS",
    kentucky: "KY",
    louisiana: "LA",
    maine: "ME",
    maryland: "MD",
    massachusetts: "MA",
    michigan: "MI",
    minnesota: "MN",
    mississippi: "MS",
    missouri: "MO",
    montana: "MT",
    nebraska: "NE",
    nevada: "NV",
    "new hampshire": "NH",
    "new jersey": "NJ",
    "new mexico": "NM",
    "new york": "NY",
    "north carolina": "NC",
    "north dakota": "ND",
    ohio: "OH",
    oklahoma: "OK",
    oregon: "OR",
    pennsylvania: "PA",
    "rhode island": "RI",
    "south carolina": "SC",
    "south dakota": "SD",
    tennessee: "TN",
    texas: "TX",
    utah: "UT",
    vermont: "VT",
    virginia: "VA",
    washington: "WA",
    "west virginia": "WV",
    wisconsin: "WI",
    wyoming: "WY",
}

export interface HqFields {
    countryCode?: string | null
    country?: string | null
    stateCode?: string | null
    state?: string | null
}

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

function hqCountry({ countryCode, country }: HqFields) {
    const code = (countryCode ?? "").trim().toUpperCase()
    if (code.length === 2) return code
    const name = (country ?? "").trim().toLowerCase()
    if (!name) return undefined
    return COUNTRY_CODES[name] ?? OTHER_COUNTRY
}

function hqRegion({ stateCode, state }: HqFields) {
    const code = (stateCode ?? "").trim().toUpperCase()
    if (code.length === 2) return code
    const name = (state ?? "").trim()
    if (name.length === 2) return name.toUpperCase()
    return STATE_CODES[name.toLowerCase()]
}

export function territoryFromHq(hq: HqFields): Territory | undefined {
    const country = hqCountry(hq)
    if (!country) return undefined
    const region = hqRegion(hq)
    if (country === "US" && !region) return undefined
    return territoryFor(country, region)
}
