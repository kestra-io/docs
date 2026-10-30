// @ts-check
/**
 * Deletes versions of the `docs` Worker, which also closes their preview URLs.
 * Versions in the active deployment are never deleted. Dry run unless --apply.
 *
 * Selection (at least one required, filters combine with AND):
 *   --version <id>         exactly this version
 *   --alias <slug>         versions uploaded with this preview alias
 *   --no-alias             versions without a preview alias
 *   --older-than-days <n>  versions created more than n days ago
 *   --all                  every version
 * Other options:
 *   --limit <n>            stop after n candidates, oldest first
 *   --concurrency <n>      parallel deletes (default 8)
 *   --worker <name>        Worker name (default docs)
 *
 * Usage: CLOUDFLARE_ACCOUNT_ID=... CLOUDFLARE_API_TOKEN=... \
 *   node scripts/prune-worker-versions.mjs --no-alias --older-than-days 1 [--apply]
 */

const argv = process.argv
/** @param {string} name */
const flag = (name) => argv.includes(`--${name}`)
/** @param {string} name */
const option = (name) => {
    const i = argv.indexOf(`--${name}`)
    return i > -1 ? argv[i + 1] : undefined
}
/** @param {string} name @param {number} fallback */
const positive = (name, fallback) => {
    const raw = option(name)
    const value = raw === undefined ? fallback : Number(raw)
    if (Number.isNaN(value) || value <= 0) {
        console.error(`--${name} needs a positive number`)
        process.exit(1)
    }
    return value
}

const apply = flag("apply")
const worker = option("worker") ?? "docs"
const onlyVersion = option("version")
const alias = option("alias")
const noAlias = flag("no-alias")
const olderThanDays = option("older-than-days") === undefined ? undefined : positive("older-than-days", 0)
const limit = positive("limit", Infinity)
const concurrency = Math.floor(positive("concurrency", 8))

if (!onlyVersion && !alias && !noAlias && olderThanDays === undefined && !flag("all")) {
    console.error("Pick what to delete: --version, --alias, --no-alias, --older-than-days or --all")
    process.exit(1)
}
if (alias && noAlias) {
    console.error("--alias and --no-alias are mutually exclusive")
    process.exit(1)
}

const { CLOUDFLARE_ACCOUNT_ID: account, CLOUDFLARE_API_TOKEN: token } = process.env
if (!account || !token) {
    console.error("Set CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN")
    process.exit(1)
}

const base = `https://api.cloudflare.com/client/v4/accounts/${account}/workers`

/** @param {string} path @param {RequestInit} [init] */
async function api(path, init) {
    const res = await fetch(`${base}${path}`, {
        ...init,
        headers: { Authorization: `Bearer ${token}` },
    })
    const body = await res.json()
    if (!res.ok || !body.success) {
        throw new Error(`${init?.method ?? "GET"} ${path}: ${JSON.stringify(body.errors)}`)
    }
    return body
}

// Versions in the active deployment (several during a gradual rollout) must stay.
const { result: deployments } = await api(`/scripts/${worker}/deployments`)
const keep = new Set(
    (deployments.deployments?.[0]?.versions ?? []).map(
        (/** @type {{version_id: string}} */ v) => v.version_id,
    ),
)
if (keep.size === 0) {
    console.error("No active deployment found, refusing to delete anything")
    process.exit(1)
}
console.log(`Keeping versions from the active deployment: ${[...keep].join(", ")}`)

/** @typedef {{id: string, number?: number, created_on?: string, alias?: string}} Version */

const cutoff = olderThanDays === undefined ? undefined : Date.now() - olderThanDays * 86_400_000

/** @param {Version} v */
const matches = (v) =>
    !keep.has(v.id) &&
    (!alias || v.alias === alias) &&
    (!noAlias || !v.alias) &&
    (cutoff === undefined || (v.created_on !== undefined && Date.parse(v.created_on) < cutoff))

/** @type {Version[]} */
const doomed = []
if (onlyVersion) {
    doomed.push({ id: onlyVersion })
} else {
    // The list is newest first. Read it from the last page, a few pages at a time,
    // so --limit takes the oldest and an age filter can stop at the first recent page.
    const first = await api(`/scripts/${worker}/versions?page=1&per_page=100`)
    const pages = Math.max(1, Math.ceil(first.result_info.total_count / 100))
    console.log(`${first.result_info.total_count} versions, ${pages} pages`)

    scan: for (let top = pages; top >= 1; top -= 4) {
        const numbers = Array.from({ length: Math.min(4, top) }, (_, i) => top - i)
        const chunk = await Promise.all(
            numbers.map((page) =>
                page === 1
                    ? first
                    : api(`/scripts/${worker}/versions?page=${page}&per_page=100`),
            ),
        )
        console.log(`Fetched pages ${numbers.join(", ")}`)
        for (const { result } of chunk) {
            for (const item of [...result.items].reverse()) {
                /** @type {Version} */
                const v = {
                    id: item.id,
                    number: item.number,
                    created_on: item.metadata?.created_on,
                    alias: item.annotations?.["workers/alias"],
                }
                if (matches(v)) doomed.push(v)
            }
        }
        if (doomed.length >= limit) break
        // Newer pages cannot match an age filter once this chunk reached the cutoff.
        if (cutoff !== undefined) {
            const newest = chunk[chunk.length - 1].result.items[0]
            if (Date.parse(newest.metadata?.created_on) >= cutoff) break scan
        }
    }
    doomed.splice(limit)
}

console.log(`${doomed.length} to delete${apply ? "" : " (dry run, pass --apply)"}`)

let done = 0
let failed = 0

/** @param {Version} v */
async function remove(v) {
    if (!apply) {
        console.log(`would delete #${v.number ?? "?"} ${v.id} ${v.created_on ?? ""} ${v.alias ?? ""}`)
        return
    }
    // Retry rate limits and transient failures with a growing pause.
    for (let attempt = 1; attempt <= 5; attempt++) {
        try {
            await api(`/workers/${worker}/versions/${v.id}`, { method: "DELETE" })
            done++
            if (done % 50 === 0) console.log(`deleted ${done}/${doomed.length}`)
            return
        } catch (error) {
            if (attempt === 5) {
                failed++
                console.error(`${v.id}: ${String(error)}`)
                return
            }
            await new Promise((resolve) => setTimeout(resolve, attempt * 1000))
        }
    }
}

const queue = [...doomed]
await Promise.all(
    Array.from({ length: apply ? concurrency : 1 }, async () => {
        for (let v = queue.shift(); v; v = queue.shift()) {
            await remove(v)
        }
    }),
)
if (apply) console.log(`deleted ${done}, failed ${failed}`)
if (failed > 0) process.exit(1)
