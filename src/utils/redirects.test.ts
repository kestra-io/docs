import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"
import YAML from "yaml"
import { type RedirectRule, resolveRedirect } from "~/utils/redirects"

const redirectsDir = fileURLToPath(
    new URL("../contents/redirects", import.meta.url),
)

const loadRules = (file: string): RedirectRule[] =>
    YAML.parse(readFileSync(`${redirectsDir}/${file}.yml`, "utf8")) ?? []

const docsRules = loadRules("docs")

describe("docs redirects", () => {
    // Every case below was a live 404 or a multi-hop chain ending in one.
    it.each([
        // Glued together by the unanchored "/docs/developer-guide/" prefix rule,
        // then bounced through two more rules into a 404.
        ["/docs/developer-guide/namespace-files", "/docs/concepts/namespace-files"],
        ["/docs/developer-guide/git-sync", "/docs/version-control-cicd/git"],
        ["/docs/developer-guide/triggers", "/docs/workflow-components/triggers"],
        // Targets that were themselves 404s.
        ["/docs/concepts/expression/basic-usage", "/docs/expressions"],
        ["/docs/developer-guide/variables", "/docs/expressions"],
        ["/docs/tutorial/docker", "/docs/scripts"],
        // Targets that were themselves redirected (chains).
        ["/docs/administrator-guide/server-cli", "/docs/kestra-cli"],
        ["/docs/user-interface-guide/blueprints", "/docs/concepts/blueprints"],
        // Linked from plugin property descriptions and blueprint markdown, i.e.
        // generated outside this repo, so only a redirect can fix them here.
        [
            "/docs/configuration-guide/plugins",
            "/docs/configuration/plugins-and-execution",
        ],
        ["/docs/workflow-components/task-runners", "/docs/task-runners"],
        [
            "/docs/workflow-components/tasks/flow/pause",
            "/docs/how-to-guides/pause-resume",
        ],
        ["/docs/concepts/expression", "/docs/expressions"],
        ["/docs/enterprise/api-tokens", "/docs/enterprise/auth/api-tokens"],
        [
            "/docs/enterprise/auditing/audit-logs",
            "/docs/enterprise/governance/audit-logs",
        ],
    ])("%s resolves to %s", (from, to) => {
        expect(resolveRedirect(from, docsRules)).toBe(to)
    })

    it("sends unmatched developer-guide children to the section root without gluing the child onto it", () => {
        expect(resolveRedirect("/docs/developer-guide/anything", docsRules)).toBe(
            "/docs/plugin-developer-guide",
        )
        expect(resolveRedirect("/docs/developer-guide", docsRules)).toBe(
            "/docs/plugin-developer-guide",
        )
    })

    it("keeps the anchored /docs/concepts/expression rule from shadowing its children", () => {
        expect(
            resolveRedirect("/docs/concepts/expression/filter/date", docsRules),
        ).toBe("/docs/expressions")
    })
})

describe("docs redirect rule set", () => {
    // A target that is itself matched by a rule in the same file is a redirect
    // chain, and a dead end when the second hop mangles the path — which is how
    // /docs/developer-guide/<child> ended up on /docs/workflow-components/plugins<child>.
    // Rules with a backreference in `to` build their target from the request, so
    // there is no single static target to check.
    //
    // Scoped to docs.yml: the same check does not hold yet for index.yml and
    // plugins.yml, whose unanchored rules match their own targets. Those are
    // latent (the targets are live pages, so the 404-only middleware never fires
    // on them) and left for a follow-up.
    it("has no target matched by another rule", () => {
        const chains = docsRules
            .filter((rule) => !rule.to.includes("$"))
            .map((rule) => ({
                rule: rule.regexp,
                to: rule.to,
                next: resolveRedirect(rule.to.split("#")[0], docsRules),
            }))
            .filter((entry) => entry.next !== null && entry.next !== entry.to)

        expect(chains).toEqual([])
    })
})
