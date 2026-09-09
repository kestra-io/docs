import { describe, expect, it } from "vitest"
import { getAliasMapping, redirectAlias } from "~/utils/plugins/aliasMapping"
import { generateNavigationFromSubgroups } from "~/utils/plugins/generateNavigation"
import { recursivePages } from "~/utils/navigation"
import type { Plugin } from "~/utils/plugins/plugin"

// Trimmed shape of GET /plugins/subgroups for plugin-slack: a root entry listing every element
// plus one entry per subgroup. With more than one subgroup, the canonical element URL carries the
// subgroup segment (/plugins/plugin-slack/slack-notifications/<fqcn>).
const slackPlugins = [
    {
        name: "plugin-slack",
        group: "io.kestra.plugin.slack",
        title: "Slack",
        aliases: ["io.kestra.plugin.slack.SlackIncomingWebhook"],
        tasks: [
            { cls: "io.kestra.plugin.slack.notifications.SlackIncomingWebhook" },
            { cls: "io.kestra.plugin.slack.app.chats.Post" },
        ],
    },
    {
        name: "plugin-slack",
        group: "io.kestra.plugin.slack",
        subGroup: "io.kestra.plugin.slack.notifications",
        title: "Slack Notifications",
        tasks: [{ cls: "io.kestra.plugin.slack.notifications.SlackIncomingWebhook" }],
    },
    {
        name: "plugin-slack",
        group: "io.kestra.plugin.slack",
        subGroup: "io.kestra.plugin.slack.app.chats",
        title: "Slack Chats",
        tasks: [{ cls: "io.kestra.plugin.slack.app.chats.Post" }],
    },
] as unknown as Plugin[]

const pageList = recursivePages(generateNavigationFromSubgroups(slackPlugins)[0])
const aliasMapping = getAliasMapping(slackPlugins)

const CANONICAL =
    "/plugins/plugin-slack/slack-notifications/io.kestra.plugin.slack.notifications.slackincomingwebhook"

// Canonical slug is slugify(title) — "slack-chats" — while the subGroup's own last segment is
// "chats". matchesSubGroup() accepts both, which is why the segment form renders instead of 404ing.
const CHATS_CANONICAL =
    "/plugins/plugin-slack/slack-chats/io.kestra.plugin.slack.app.chats.post"
const CHATS_FQCN = "io.kestra.plugin.slack.app.chats.Post"

describe("redirectAlias", () => {
    it("exposes the canonical subgroup URL in the page list", () => {
        expect(pageList).toContain(CANONICAL)
    })

    it("leaves a canonical URL alone", () => {
        expect(
            redirectAlias(
                aliasMapping,
                CANONICAL,
                pageList,
                "io.kestra.plugin.slack.notifications.SlackIncomingWebhook",
            ),
        ).toBeNull()
    })

    // Regression: pageList entries are lowercase but pluginType keeps the FQCN casing, so the
    // lookup used to miss, throw, and get swallowed by the caller — leaving the subgroup-less URL
    // serving a full duplicate of the canonical page.
    it("301s the subgroup-less FQCN URL to the canonical subgroup URL", () => {
        expect(
            redirectAlias(
                aliasMapping,
                "/plugins/plugin-slack/io.kestra.plugin.slack.notifications.slackincomingwebhook",
                pageList,
                "io.kestra.plugin.slack.notifications.SlackIncomingWebhook",
            ),
        ).toBe(CANONICAL)
    })

    // The other non-canonical shape, and the one measurably splitting signals: the URL carries the
    // subGroup's last segment ("chats") rather than slugify(title) ("slack-chats"). matchesSubGroup()
    // accepts that segment, so the page renders 200 instead of 404ing, and the flat-form fix alone
    // would not have covered it. Pinned so a change to matchesSubGroup or to the subgroup slug
    // source can't silently reopen it.
    it("301s the segment-form subgroup URL to the canonical subgroup URL", () => {
        expect(pageList).toContain(CHATS_CANONICAL)
        expect(
            redirectAlias(
                aliasMapping,
                "/plugins/plugin-slack/chats/io.kestra.plugin.slack.app.chats.post",
                pageList,
                CHATS_FQCN,
            ),
        ).toBe(CHATS_CANONICAL)
    })

    // /plugins has no .md route (unlike docs/blogs/resources), so the suffix was absorbed by the
    // catch-all and served the full HTML page under a self-referencing canonical that included the
    // ".md". The caller strips the suffix before building pluginType, so these now 301 to the
    // canonical HTML page in a single hop — including from an already non-canonical path.
    it.each([
        ["canonical path", CHATS_CANONICAL + ".md"],
        ["flat form", "/plugins/plugin-slack/io.kestra.plugin.slack.app.chats.post.md"],
        ["segment form", "/plugins/plugin-slack/chats/io.kestra.plugin.slack.app.chats.post.md"],
    ])("301s a .md suffix on the %s to the canonical page", (_label, slug) => {
        expect(redirectAlias(aliasMapping, slug, pageList, CHATS_FQCN)).toBe(CHATS_CANONICAL)
    })

    it("still resolves an aliased FQCN to its current location", () => {
        expect(
            redirectAlias(
                aliasMapping,
                "/plugins/plugin-slack/io.kestra.plugin.slack.slackincomingwebhook",
                pageList,
                "io.kestra.plugin.slack.SlackIncomingWebhook",
            ),
        ).toBe(CANONICAL)
    })

    it("throws when no page matches, so the caller can fall through", () => {
        expect(() =>
            redirectAlias(
                aliasMapping,
                "/plugins/plugin-slack/io.kestra.plugin.slack.does.NotExist",
                pageList,
                "io.kestra.plugin.slack.does.NotExist",
            ),
        ).toThrow(/Plugin page not found/)
    })
})
