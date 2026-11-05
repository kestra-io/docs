import type { Contributor } from "~/components/community/types"

export const SHUFFLE_POOL = 200

const byName = (a: Contributor, b: Contributor) =>
    a.name < b.name ? -1 : a.name > b.name ? 1 : 0

const isAutomation = ({ name }: Contributor) =>
    name.endsWith("[bot]") || name === "actions-user"

export const rankContributors = (contributors: Contributor[]) =>
    contributors
        .filter((contributor) => !isAutomation(contributor))
        .toSorted((a, b) => (b.count ?? 0) - (a.count ?? 0) || byName(a, b))

const seededRandom = (seed: number) => () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

export const shuffleWithSeed = <T>(items: readonly T[], seed: number) => {
    const out = [...items]
    const random = seededRandom(seed)
    for (let i = out.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1))
        ;[out[i], out[j]] = [out[j], out[i]]
    }
    return out
}

export const orderContributors = (
    contributors: Contributor[],
    seed?: number,
) => {
    const ranked = rankContributors(contributors)
    if (seed === undefined) return ranked
    return [
        ...shuffleWithSeed(ranked.slice(0, SHUFFLE_POOL), seed),
        ...ranked.slice(SHUFFLE_POOL),
    ]
}

export const hourlySeed = (now = Date.now()) => Math.floor(now / 3_600_000)
