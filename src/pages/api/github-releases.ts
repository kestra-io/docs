import type { APIRoute } from "astro";

export const prerender = false;


interface GitHubRelease {
    tag_name: string
    published_at: string | null
    draft: boolean
}

export interface ReleaseInfo {
    version: string
    publishedAt: string | null
    kestraVersion?: string | null
}

const cache: { [key: string]: { data: any; expiry: number } } = {};

async function getFromCache(keys: string[]) {
    const cacheKey = keys.join(':');
    const cachedEntry = cache[cacheKey];

    if (cachedEntry && cachedEntry.expiry > Date.now()) {
        return cachedEntry.data;
    }
    return null;
}

async function addToCache(data: any, keys: string[], ttl: number) {
    const cacheKey = keys.join(':');
    cache[cacheKey] = {
        data,
        expiry: Date.now() + ttl * 1000,
    };
}

export async function retrieveRepoReleases(repo: string) {
    const cached = await getFromCache([]);

    const headers: Record<string, string> = { 'User-Agent': 'request' }

    const response = await fetch(`https://api.github.com/repos/kestra-io/${repo}/releases`, { headers })

    if (!response.ok) {
        if (response.status === 404) {
            const result = { versions: [] }
            await addToCache(result, [], 3600)
            return result
        }
        console.error(`GitHub API error for ${repo}: ${response.status} ${response.statusText}`)
        throw new Error(`GitHub API returned ${response.status}`)
    }

    const releases = await response.json() as GitHubRelease[]

    const versions: ReleaseInfo[] = await Promise.all(
        releases
            .filter(release => !release.draft)
            .map(async (release) => {
                const version = release.tag_name.replace(/^v/, '');
                let kestraVersion: string | null = null;
                const response = await fetch(`https://raw.githubusercontent.com/kestra-io/${repo}/${release.tag_name}/gradle.properties`, { headers });
                if (response.ok) {
                    const content = await response.text();
                    kestraVersion = content.match(/kestraVersion\s*=\s*(.+)/)?.[1]?.trim() ?? null;
                }
                return {
                    version,
                    publishedAt: release.published_at,
                    kestraVersion
                };
            })
    )

    const result = { versions }
    await addToCache(result, [], 3600)

    return result
}

export const GET: APIRoute = async ({ params }) => {
    const data = await retrieveRepoReleases(params.repo ?? 'kestra');
    return new Response(JSON.stringify(data),{
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'max-age=86400',
        },
      });
}