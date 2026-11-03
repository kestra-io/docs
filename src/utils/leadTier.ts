export type Tier = "T1" | "T2" | "T3"

const RANK: Record<Tier, number> = { T1: 3, T2: 2, T3: 1 }

export function tierFromEmployees(value: string): Tier {
    if (value === "1000+") return "T1"
    if (value === "between 100 and 999") return "T2"
    return "T3"
}

export function tierFromHeadcount(value: unknown): Tier | undefined {
    if (value === null || value === undefined || value === "") return undefined
    const count = Number(value)
    if (!Number.isFinite(count)) return undefined
    if (count >= 1000) return "T1"
    if (count >= 100) return "T2"
    return "T3"
}

export function tierFromCompany(company: {
    leadTier?: string | null
    employees?: string | number | null
}): Tier | undefined {
    const leadTier = (company.leadTier ?? "").trim().toUpperCase()
    if (leadTier in RANK) return leadTier as Tier
    return tierFromHeadcount(company.employees)
}

export function higherTier(
    ...tiers: Array<Tier | undefined>
): Tier | undefined {
    return tiers.reduce<Tier | undefined>((best, tier) => {
        if (!tier) return best
        if (!best || RANK[tier] > RANK[best]) return tier
        return best
    }, undefined)
}
