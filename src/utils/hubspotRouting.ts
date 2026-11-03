import {
    higherTier,
    tierFromCompany,
    tierFromEmployees,
    type Tier,
} from "~/utils/leadTier"
import { territoryFromHq, type Territory } from "~/utils/territory"

export interface Routing {
    tier?: Tier
    territory?: Territory
}

export interface HqRoutingInput {
    token?: string
    email?: string
    employees?: string
    submitted: Promise<boolean>
}

interface Deps {
    fetch?: typeof fetch
    sleep?: (ms: number) => Promise<void>
}

type Properties = Record<string, string | null | undefined>

const HUBSPOT_API = "https://api.hubapi.com/crm/v3/objects"
const COMPANY_PROPERTIES = [
    "hs_country_code",
    "country",
    "hs_state_code",
    "state",
    "lead_tier",
    "numberofemployees",
]
const CONTACT_ATTEMPTS = 3
const CONTACT_RETRY_MS = 1500

const wait = (ms: number) =>
    new Promise<void>((resolve) => setTimeout(resolve, ms))

function hubspotClient(token: string, fetchFn: typeof fetch) {
    const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    }

    async function request<T>(
        url: string,
        init?: RequestInit,
    ): Promise<T | undefined> {
        try {
            const response = await fetchFn(url, { ...init, headers })
            if (!response.ok) return undefined
            return (await response.json()) as T
        } catch (error) {
            console.error("HubSpot CRM lookup failed:", error)
            return undefined
        }
    }

    return {
        async companyByDomain(domain: string) {
            const result = await request<{
                results?: Array<{ properties?: Properties }>
            }>(`${HUBSPOT_API}/companies/search`, {
                method: "POST",
                body: JSON.stringify({
                    filterGroups: [
                        {
                            filters: [
                                {
                                    propertyName: "domain",
                                    operator: "EQ",
                                    value: domain,
                                },
                            ],
                        },
                    ],
                    properties: COMPANY_PROPERTIES,
                    sorts: [
                        { propertyName: "createdate", direction: "ASCENDING" },
                    ],
                    limit: 1,
                }),
            })
            return result?.results?.[0]?.properties
        },

        async companyViaContact(
            email: string,
            sleep: (ms: number) => Promise<void>,
        ) {
            for (let attempt = 1; attempt <= CONTACT_ATTEMPTS; attempt++) {
                if (attempt > 1) await sleep(CONTACT_RETRY_MS)
                const contact = await request<{
                    associations?: {
                        companies?: { results?: Array<{ id: string }> }
                    }
                }>(
                    `${HUBSPOT_API}/contacts/${encodeURIComponent(email)}?idProperty=email&associations=companies&properties=email`,
                )
                const companyId = contact?.associations?.companies?.results?.[0]?.id
                if (!companyId) continue
                const company = await request<{ properties?: Properties }>(
                    `${HUBSPOT_API}/companies/${companyId}?properties=${COMPANY_PROPERTIES.join(",")}`,
                )
                return company?.properties
            }
            return undefined
        },
    }
}

function toRouting(
    properties: Properties,
    employees?: string,
): Routing | undefined {
    const tier = higherTier(
        tierFromCompany({
            leadTier: properties.lead_tier,
            employees: properties.numberofemployees,
        }),
        employees ? tierFromEmployees(employees) : undefined,
    )
    const territory = territoryFromHq({
        countryCode: properties.hs_country_code,
        country: properties.country,
        stateCode: properties.hs_state_code,
        state: properties.state,
    })
    if (!tier && !territory) return undefined
    return { ...(tier && { tier }), ...(territory && { territory }) }
}

export async function resolveHqRouting(
    input: HqRoutingInput,
    deps: Deps = {},
): Promise<Routing | undefined> {
    const email = (input.email ?? "").trim().toLowerCase()
    const domain = email.split("@")[1]
    if (!input.token || !domain) return undefined

    const client = hubspotClient(input.token, deps.fetch ?? fetch)

    let properties = await client.companyByDomain(domain)
    if (!properties && (await input.submitted)) {
        properties = await client.companyViaContact(email, deps.sleep ?? wait)
    }
    return properties ? toRouting(properties, input.employees) : undefined
}
