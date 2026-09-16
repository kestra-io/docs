import { describe, expect, it } from "vitest"
import { getMarked, getPlainMarked } from "./marked-shiki"
import {
    parseRedirectRules,
    resolveLiteralRedirect,
    rewriteRedirectedHref,
    toLiteralRedirects,
} from "./redirectedLinks"

const SAMPLE = `
# comment
- regexp: "^/docs/developer-guide/namespace-files(/.*)?$"
  to: "/docs/concepts/namespace-files"
- regexp: "/docs/workflow-components/plugin-defaults(.*)?$"
  to: "/docs/migration-guide/v2.0.0/plugin-defaults-removed"
- regexp: "/docs/(.*)variables"
  to: "/docs/expressions"
- regexp: "/docs/migration-guide/([0-1]).(.*)"
  to: "/docs/migration-guide/v$1.$2"
- regexp: "/docs/configuration/index\\\\.md$"
  to: "/docs/configuration"
- regexp: "/docs/enterprise/governance/secrets/?$"
  to: "/docs/enterprise/governance/secrets-manager"
- regexp: "/docs/administrator-guide/configuration/.*"
  to: "/docs/configuration"
`

describe("parseRedirectRules", () => {
    it("reads regexp/to pairs and skips comments", () => {
        const rules = parseRedirectRules(SAMPLE)
        expect(rules).toHaveLength(7)
        expect(rules[0]).toEqual({
            regexp: "^/docs/developer-guide/namespace-files(/.*)?$",
            to: "/docs/concepts/namespace-files",
        })
        expect(rules[4].regexp).toBe("/docs/configuration/index\\.md$")
    })
})

describe("toLiteralRedirects", () => {
    it("keeps literal paths and drops rules with capture groups or wildcards inside", () => {
        const literals = toLiteralRedirects(parseRedirectRules(SAMPLE))
        expect(literals.map((l) => l.from)).toEqual([
            "/docs/developer-guide/namespace-files",
            "/docs/workflow-components/plugin-defaults",
            "/docs/configuration/index.md",
            "/docs/enterprise/governance/secrets",
            "/docs/administrator-guide/configuration",
        ])
    })
})

describe("resolveLiteralRedirect", () => {
    const redirects = toLiteralRedirects(parseRedirectRules(SAMPLE))

    it("matches the path exactly or as a parent segment", () => {
        expect(resolveLiteralRedirect("/docs/developer-guide/namespace-files", redirects)).toBe(
            "/docs/concepts/namespace-files",
        )
        expect(
            resolveLiteralRedirect("/docs/administrator-guide/configuration/database", redirects),
        ).toBe("/docs/configuration")
    })

    it("does not treat a literal as a prefix of a longer segment", () => {
        expect(resolveLiteralRedirect("/docs/enterprise/governance/secrets-manager", redirects)).toBe(
            "/docs/enterprise/governance/secrets-manager",
        )
    })

    it("leaves live pages that a wildcard 404 rule would have caught", () => {
        expect(resolveLiteralRedirect("/docs/workflow-components/variables", redirects)).toBe(
            "/docs/workflow-components/variables",
        )
    })
})

describe("rewriteRedirectedHref", () => {
    it("rewrites the docs links plugin schemas still carry", () => {
        expect(rewriteRedirectedHref("https://kestra.io/docs/developer-guide/namespace-files")).toBe(
            "https://kestra.io/docs/concepts/namespace-files",
        )
        expect(rewriteRedirectedHref("/docs/configuration-guide/plugins")).toBe(
            "/docs/configuration/plugins-and-execution",
        )
        expect(rewriteRedirectedHref("/docs/workflow-components/plugin-defaults")).toBe(
            "/docs/migration-guide/v2.0.0/plugin-defaults-removed",
        )
    })

    it("keeps the query string and fragment", () => {
        expect(
            rewriteRedirectedHref("https://kestra.io/docs/developer-guide/namespace-files#usage"),
        ).toBe("https://kestra.io/docs/concepts/namespace-files#usage")
        expect(rewriteRedirectedHref("/docs/enterprise/scalability/task-runners?x=1#types")).toBe(
            "/docs/task-runners?x=1#types",
        )
    })

    it("lowercases plugin paths and drops a .md suffix", () => {
        expect(rewriteRedirectedHref("/plugins/io.kestra.plugin.docker.Build")).toBe(
            "/plugins/io.kestra.plugin.docker.build",
        )
        expect(rewriteRedirectedHref("/plugins/io.kestra.plugin.huawei.geminidb.md")).toBe(
            "/plugins/io.kestra.plugin.huawei.geminidb",
        )
    })

    it("leaves current URLs, external links, anchors and relative paths alone", () => {
        for (const href of [
            "/docs/concepts/namespace-files",
            "/plugins/plugin-aws/aws-s3/io.kestra.plugin.aws.s3.upload",
            "https://github.com/kestra-io/kestra",
            "#properties",
            "../other-page",
            "//cdn.example.com/x",
            "/blogs/some-post",
        ]) {
            expect(rewriteRedirectedHref(href)).toBe(href)
        }
    })
})

describe("marked instances", () => {
    it("emit the rewritten href in both the Shiki and the plain renderer", async () => {
        const md = "See [Namespace Files](https://kestra.io/docs/developer-guide/namespace-files)."
        const shiki = await getMarked().parse(md)
        const plain = getPlainMarked().parse(md, { async: false })
        for (const html of [shiki, plain]) {
            expect(html).toContain('href="https://kestra.io/docs/concepts/namespace-files"')
            expect(html).not.toContain("developer-guide")
        }
    })
})
