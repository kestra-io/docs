import type { Contributor } from "~/components/community/types"

export const rankContributors = (contributors: Contributor[]) =>
    contributors
        .filter((contributor) => !contributor.name.endsWith("[bot]"))
        .toSorted((a, b) => (b.count ?? 0) - (a.count ?? 0))
