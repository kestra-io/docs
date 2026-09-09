// @ts-check
/**
 * Record-and-replay proxy for the Kestra API, used by the Lighthouse benchmark.
 *
 * `/blueprints` is server-rendered and fans out ~15 live API calls per request,
 * so its LCP moved with WAN latency rather than with the code under test. The
 * benchmark builds the site with API_URL pointed here instead: recorded URLs
 * are served from disk, everything else is proxied to the real API untouched.
 *
 * On a miss inside the recorded prefix the response is fetched upstream and
 * written to FIXTURE_DIR, so the first CI run produces the fixture set as an
 * artifact and later runs replay it. Commit that set to freeze the page.
 *
 * Usage (environment variables):
 *   PORT            – Port to listen on (default: 9001)
 *   UPSTREAM        – Real API origin (default: https://api.kestra.io)
 *   FIXTURE_DIR     – Fixture directory (default: tests/fixtures/api)
 *   FIXTURE_PATHS   – Comma-separated paths to record; a trailing * is a
 *                     prefix (default: /v1/blueprints*,/v1/plugins,
 *                     /v1/plugins/subgroups)
 *   RECORD          – "false" to never write new fixtures (default: record)
 *
 * GET /__fixtures/stats returns the hit/record/passthrough counters as JSON.
 */

import { createServer } from "node:http"
import { createHash } from "node:crypto"
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs"
import { resolve, sep } from "node:path"

const PORT = Number(process.env.PORT ?? 9001)
const UPSTREAM = (process.env.UPSTREAM ?? "https://api.kestra.io").replace(
    /\/$/,
    "",
)
const FIXTURE_DIR = process.env.FIXTURE_DIR ?? "tests/fixtures/api"
const FIXTURE_ROOT = resolve(FIXTURE_DIR)
// The two exact plugin paths are what the blueprints page's tool index asks
// for. The rest of /v1/plugins stays live: it is hundreds of build-time
// schema fetches for the prerendered plugin docs, not this page's latency.
const FIXTURE_PATHS = (
    process.env.FIXTURE_PATHS ??
    "/v1/blueprints*,/v1/plugins,/v1/plugins/subgroups"
)
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
const RECORD = process.env.RECORD !== "false"
const UPSTREAM_TIMEOUT_MS = 30000

const stats = { hits: 0, records: 0, passthrough: 0, errors: 0 }

/**
 * Whether a request path is recorded. Exact matchers ignore the query string,
 * so /v1/plugins does not swallow /v1/plugins/core.
 *
 * @param {string} path
 * @returns {boolean}
 */
function isRecorded(path) {
    const pathname = path.split("?")[0]
    return FIXTURE_PATHS.some((matcher) =>
        matcher.endsWith("*")
            ? path.startsWith(matcher.slice(0, -1))
            : pathname === matcher,
    )
}

/**
 * Absolute fixture path for a request path: a readable slug plus a hash of the
 * full path, since query strings collide once the slug is truncated.
 *
 * @param {string} path
 * @returns {string}
 */
function fixtureFile(path) {
    const hash = createHash("sha1").update(path).digest("hex").slice(0, 8)
    const slug = path
        .replace(/^\/v1\//, "")
        .replace(/[^a-zA-Z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 80)

    // The slug is request-derived, so the name is checked rather than trusted,
    // and the result has to land inside the fixture directory.
    const name = `${slug}.${hash}.json`
    const file = resolve(
        FIXTURE_ROOT,
        /^[a-zA-Z0-9][a-zA-Z0-9.-]*$/.test(name) ? name : `${hash}.json`,
    )
    if (!file.startsWith(`${FIXTURE_ROOT}${sep}`)) {
        throw new Error(`fixture path escapes ${FIXTURE_ROOT}: ${file}`)
    }

    return file
}

/**
 * Reads a recorded response, or null when it has not been recorded yet.
 *
 * @param {string} path
 * @returns {{ status: number; contentType: string; body: string } | null}
 */
function readFixture(path) {
    try {
        const file = fixtureFile(path)
        if (!existsSync(file)) return null

        const fixture = JSON.parse(readFileSync(file, "utf8"))
        return {
            status: fixture.status ?? 200,
            contentType: fixture.contentType ?? "application/json",
            body:
                typeof fixture.body === "string"
                    ? fixture.body
                    : JSON.stringify(fixture.body),
        }
    } catch (err) {
        console.warn(`  fixture unreadable, refetching ${path}: ${err}`)
        return null
    }
}

/**
 * Writes a response to disk. JSON bodies are stored parsed so the fixtures
 * stay reviewable in a diff.
 *
 * @param {string} path
 * @param {{ status: number; contentType: string; body: string }} response
 */
function writeFixture(path, response) {
    mkdirSync(FIXTURE_ROOT, { recursive: true })

    let body = /** @type {unknown} */ (response.body)
    if (response.contentType.includes("json")) {
        try {
            body = JSON.parse(response.body)
        } catch {
            // Not valid JSON despite the header, keep the raw text.
        }
    }

    const file = fixtureFile(path)
    const fixture = {
        path,
        status: response.status,
        contentType: response.contentType,
        body,
    }
    writeFileSync(file, JSON.stringify(fixture, null, 2))
}

/**
 * Fetches a path from the real API.
 *
 * @param {string} path
 * @returns {Promise<{ status: number; contentType: string; body: string }>}
 */
async function fetchUpstream(path) {
    const response = await fetch(`${UPSTREAM}${path}`, {
        signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    })

    return {
        status: response.status,
        contentType: response.headers.get("content-type") ?? "text/plain",
        body: await response.text(),
    }
}

const server = createServer(async (req, res) => {
    const path = req.url ?? "/"

    if (path === "/__fixtures/stats") {
        res.writeHead(200, { "content-type": "application/json" })
        res.end(JSON.stringify(stats))
        return
    }

    const recorded = isRecorded(path)

    if (recorded) {
        const fixture = readFixture(path)
        if (fixture) {
            stats.hits++
            res.writeHead(fixture.status, {
                "content-type": fixture.contentType,
                "cache-control": "no-store",
            })
            res.end(fixture.body)
            return
        }
    }

    try {
        const response = await fetchUpstream(path)
        if (recorded && RECORD && response.status === 200) {
            // A fixture that cannot be written still serves the live response.
            try {
                writeFixture(path, response)
                stats.records++
                console.log(`  recorded ${path}`)
            } catch (err) {
                stats.errors++
                console.log(`  could not record ${path}: ${err}`)
            }
        } else if (recorded) {
            stats.errors++
            console.log(`  upstream ${response.status} for ${path}`)
        } else {
            stats.passthrough++
        }

        res.writeHead(response.status, {
            "content-type": response.contentType,
            "cache-control": "no-store",
        })
        res.end(response.body)
    } catch (err) {
        stats.errors++
        const message = err instanceof Error ? err.message : String(err)
        console.log(`  upstream failed for ${path}: ${message}`)
        // The detail stays in the log: the body reaches the page under test.
        res.writeHead(502, { "content-type": "application/json" })
        res.end(JSON.stringify({ error: "upstream fetch failed" }))
    }
})

server.listen(PORT, "127.0.0.1", () => {
    console.log(`API fixtures on http://127.0.0.1:${PORT}`)
    console.log(`  upstream : ${UPSTREAM}`)
    console.log(`  fixtures : ${FIXTURE_ROOT}`)
    console.log(`  recorded : ${FIXTURE_PATHS.join(" ")}`)
    console.log(`  recording: ${RECORD ? "on" : "off"}`)
})
