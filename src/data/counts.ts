import { DISABLE_GITHUB } from "astro:env/server"
import { $fetchApiCached, $fetchCached } from "~/utils/fetch"
import { calculateTotalPlugins } from "~/composables/usePluginsCount"
import type { Plugin } from "~/utils/plugins/plugin"
import FALLBACK from "./counts.fallback.json"

/**
 * Live counters for the figures the site publishes.
 *
 * Two rules drive this module:
 *
 * 1. No figure ships without a live source, so each count is fetched while the
 *    page is rendered and inlined into the HTML. Fetching from the browser is
 *    not an option: crawlers and AI assistants do not reliably execute JS, and
 *    the number is exactly what we want them to read.
 * 2. A count we could not verify must never reach a visitor. A failed fetch
 *    falls back to the committed value in counts.fallback.json; a fetched but
 *    implausible plugin count fails the build instead of shipping. That second
 *    rule is what stops "0+ Plugins" from going out again.
 *
 * Each counter is fetched and memoised independently, so a page pays only for
 * the figures it actually renders — /plugins/subgroups is a ~3.4 MB payload and
 * has no business being pulled in by pages that just show a star count.
 */

/**
 * Below these floors, a fetched value is not a smaller Kestra, it is a broken
 * response.
 *
 * The plugin floor is enforced: api.kestra.io is our own infrastructure and a
 * bad answer there is a bug we want to hear about loudly. The star floor only
 * warns, because api.github.com is third-party and rate-limits anonymous
 * callers at 60 requests/hour per IP — a throttled CI runner must not be able
 * to block a deploy.
 */
const MIN_PLUGINS = 1_000
const MIN_STARS = 10_000
const MIN_BLUEPRINTS = 100

/** Round down, never up: the displayed figure carries a "+", so flooring is
 * what keeps the claim true between builds as the real count drifts. */
function floorTo(value: number, step: number): number {
    return Math.floor(value / step) * step
}

function usingFallback(what: string, value: number, extra = ""): void {
    console.warn(
        `[counts] using committed fallback ${what} (${value}, as of ${FALLBACK.updatedAt}).${extra}`,
    )
}

/** Resolve once per process and share; without this each of the ~30 /vs pages
 * would refetch, since $fetchApiCached only sets Cloudflare cache hints and
 * does not cache in-process. */
function memoise<T>(resolver: () => Promise<T>): () => Promise<T> {
    let pending: Promise<T> | undefined
    return () => (pending ??= resolver())
}

const resolvePlugins = memoise(async () => {
    let fetched: number | null = null

    try {
        const groups = await $fetchApiCached<Plugin[]>("/plugins/subgroups")
        fetched = calculateTotalPlugins(groups)
    } catch (error) {
        console.error("[counts] plugin count fetch failed:", error)
    }

    if (fetched === null) usingFallback("plugin count", FALLBACK.plugins)

    return {
        count: fetched ?? FALLBACK.plugins,
        // Flagged rather than thrown here, so only the consumers that publish
        // the figure refuse it. Throwing from the shared resolver would also
        // take down on-demand pages that merely read a different counter.
        suspect: fetched !== null && fetched < MIN_PLUGINS,
        fetched,
    }
})

const resolveBlueprints = memoise(async () => {
    let fetched: number | null = null

    try {
        const { total } = await $fetchApiCached<{ total: number }>(
            "/blueprints/versions/latest?size=1&page=1",
        )
        fetched = total ?? null
    } catch (error) {
        console.error("[counts] blueprint count fetch failed:", error)
    }

    if (fetched === null) {
        usingFallback("blueprint count", FALLBACK.blueprints)
    } else if (fetched < MIN_BLUEPRINTS) {
        console.warn(
            `[counts] blueprint count came back as ${fetched}, below the ${MIN_BLUEPRINTS} floor. Check api.kestra.io.`,
        )
    }

    return fetched ?? FALLBACK.blueprints
})

const resolveStars = memoise(async () => {
    let fetched: number | null = null

    if (!DISABLE_GITHUB) {
        try {
            const repo = await $fetchCached<{ stargazers_count: number }>(
                "https://api.github.com/repos/kestra-io/kestra",
                { headers: { "User-Agent": "request" } },
            )
            fetched = repo.stargazers_count ?? null
        } catch (error) {
            console.error("[counts] star count fetch failed:", error)
        }
    }

    if (fetched === null) {
        usingFallback(
            "star count",
            FALLBACK.stars,
            DISABLE_GITHUB ? " DISABLE_GITHUB is set." : "",
        )
    } else if (fetched < MIN_STARS) {
        console.warn(
            `[counts] star count came back as ${fetched}, below the ${MIN_STARS} floor. Using it anyway; check api.github.com.`,
        )
    }

    return fetched ?? FALLBACK.stars
})

/**
 * Plugin count floored to the hundred, without the trailing "+", e.g. "1900".
 *
 * Throws when the API answered with an implausible count. Every page that
 * publishes a plugin figure is prerendered, so this fails the build — which is
 * the point: "0+ Plugins" reached production because nothing refused it.
 */
export async function getPluginCountRounded(): Promise<string> {
    const { count, suspect } = await resolvePlugins()

    if (suspect) {
        throw new Error(
            `[counts] plugin count came back as ${count}, below the ${MIN_PLUGINS} floor. ` +
                `Refusing to build rather than publish it: this is the failure mode that ` +
                `shipped "0+ Plugins" to /enterprise. Check https://api.kestra.io/v1/plugins/subgroups.`,
        )
    }

    return `${floorTo(count, 100)}`
}

/** Blueprint count floored to the ten, without the trailing "+", e.g. "480". */
export async function getBlueprintCountRounded(): Promise<string> {
    return `${floorTo(await resolveBlueprints(), 10)}`
}

/** Stargazers on kestra-io/kestra, thousands-separated, e.g. "27,849". */
export async function getStarCountFormatted(): Promise<string> {
    return Intl.NumberFormat("en-US").format(await resolveStars())
}
