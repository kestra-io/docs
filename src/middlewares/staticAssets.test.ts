import { describe, expect, it } from "vitest"
import { isStaticAssetPath } from "./staticAssets"

describe("isStaticAssetPath", () => {
    it.each([
        "/_astro/index.Bx1a2b3c.js",
        "/_astro/index.Bx1a2b3c.css",
        "/favicon.ico",
        "/robots.txt",
        "/llms-full.txt",
        "/sitemap/index.xml",
        "/site.webmanifest",
        "/.well-known/mcp.json",
        "/icons/plugin-aws.svg",
        "/landing/home/hero.PNG",
        "/fonts/inter.woff2",
        "/videos/demo.mp4",
        // markdown variants of pages keep bypassing the cache and middlewares
        "/docs/concepts/flow.md",
        "/docs/1.2/getting-started/quickstart.md",
        "/plugins/core/flow/io.kestra.plugin.core.flow.subflow.md",
    ])("treats %s as a static asset", (pathname) => {
        expect(isStaticAssetPath(pathname)).toBe(true)
    })

    it.each([
        "/",
        "/plugins",
        "/plugins/plugin-aws",
        "/blueprints/hello-world",
        "/docs/concepts/flow",
        "/docs/1.0/getting-started/quickstart",
        // plugin element pages end with a fully qualified class name
        "/plugins/core/flow/io.kestra.plugin.core.flow.subflow",
        "/plugins/plugin-ai/tool/io.kestra.plugin.ai.tool.AIAgent",
        "/plugins/plugin-jdbc-postgres/io.kestra.plugin.jdbc.postgresql.queries",
        "/plugins/plugin-huawei/io.kestra.plugin.huawei.geminidb.md.query",
        // release pages end with a version
        "/docs/changelog/v1.3.39",
        "/docs/changelog/v2.0.0",
        "/docs/migration-guide/v0.18.0",
    ])("treats %s as a page", (pathname) => {
        expect(isStaticAssetPath(pathname)).toBe(false)
    })
})
