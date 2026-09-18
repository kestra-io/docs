import { SNAPSHOT_CUTOFF } from "astro:env/server"

function parseCutoff(value: string | undefined): Date | null {
    if (!value) return null
    const parsed = new Date(value)
    if (Number.isNaN(parsed.getTime())) {
        throw new Error(
            `SNAPSHOT_CUTOFF is not a parsable date: ${JSON.stringify(value)}`,
        )
    }
    return parsed
}

// Unset outside the visual-snapshot workflow, where beforeCutoff is a
// pass-through and the site renders its full content as usual.
const cutoff = parseCutoff(SNAPSHOT_CUTOFF)

// Drops entries dated after the cutoff. `date` reads the field the caller
// sorts on, since the collections disagree on its name.
export function beforeCutoff<T>(entries: T[], date: (entry: T) => Date): T[] {
    if (!cutoff) return entries
    return entries.filter((entry) => date(entry).getTime() <= cutoff.getTime())
}
