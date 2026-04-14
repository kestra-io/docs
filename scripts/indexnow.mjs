/**
 * IndexNow submission script.
 * Detects changed content files from the latest git commit and notifies
 * Bing/Yandex/Naver via the IndexNow protocol for faster indexing.
 *
 * Usage: node scripts/indexnow.mjs
 * Env:   INDEXNOW_KEY (optional, defaults to the checked-in key)
 */

const SITE_URL = "https://kestra.io";
const KEY = process.env.INDEXNOW_KEY || "d1521169794f4a80965bf3e6d7e49ac6";
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

import { execSync } from "node:child_process";

function getChangedUrls() {
    const diff = execSync("git diff --name-only HEAD~1 HEAD", {
        encoding: "utf-8",
    }).trim();

    if (!diff) {
        console.log("No changed files detected.");
        return [];
    }

    const urls = diff
        .split("\n")
        .filter((f) => f.startsWith("src/contents/blogs/") || f.startsWith("src/contents/docs/"))
        .map((f) => {
            // src/contents/blogs/2024-08-06-release-0-18/index.md → /blogs/2024-08-06-release-0-18
            // src/contents/docs/02.installation/index.md → /docs/installation
            return f
                .replace(/^src\/contents/, "")
                .replace(/\/index\.mdx?$/, "")
                .replace(/\/index$/, "")
                .replace(/\/\d+\./g, "/"); // remove numeric prefixes like 02.
        })
        .filter(Boolean)
        .map((path) => `${SITE_URL}${path}`);

    // Deduplicate
    return [...new Set(urls)];
}

async function submitToIndexNow(urls) {
    if (urls.length === 0) {
        console.log("No content URLs to submit.");
        return;
    }

    console.log(`Submitting ${urls.length} URL(s) to IndexNow:`);
    urls.forEach((u) => console.log(`  ${u}`));

    const body = {
        host: "kestra.io",
        key: KEY,
        keyLocation: `${SITE_URL}/${KEY}.txt`,
        urlList: urls.slice(0, 10000), // IndexNow max 10,000 per request
    };

    const response = await fetch(INDEXNOW_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    if (response.ok || response.status === 202) {
        console.log(`IndexNow accepted (HTTP ${response.status}).`);
    } else {
        console.error(`IndexNow rejected (HTTP ${response.status}): ${await response.text()}`);
        process.exitCode = 1;
    }
}

const urls = getChangedUrls();
await submitToIndexNow(urls);
