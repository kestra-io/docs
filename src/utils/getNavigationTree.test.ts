import { describe, it, expect } from "vitest"
import { getNavigationTree, type NavigationItem } from "./getNavigationTree"
import { prevNext } from "./navigation"

const page = (id: string, file: string, data: Record<string, unknown>) =>
    ({ id, filePath: `src/contents/docs/${file}`, data }) as any

const docs = () => [
    page("ai-tools", "ai-tools/index.mdx", { title: "AI Tools" }),
    page("ai-tools/ai-copilot", "ai-tools/01.ai-copilot/index.md", {
        title: "AI Copilot",
        sidebarGroup: "Build with AI",
    }),
    page("ai-tools/agent-skills", "ai-tools/02.agent-skills/index.md", {
        title: "Agent Skills",
        sidebarGroup: "Build with AI",
    }),
    page("ai-tools/ai-agents", "ai-tools/03.ai-agents/index.md", {
        title: "AI Agents",
        sidebarGroup: "AI in your flows",
    }),
    page("ai-tools/ungrouped", "ai-tools/04.ungrouped/index.md", { title: "Ungrouped" }),
]

const findAiTools = (tree: NavigationItem[]) =>
    tree
        .find((s) => s.title === "Build with Kestra")!
        .children!.find((c) => c.path === "/docs/ai-tools")!

describe("getNavigationTree sidebarGroup", () => {
    it("inserts a group label before the first page of each group", () => {
        const children = findAiTools(getNavigationTree(docs())).children!
        expect(children.map((c) => (c.isGroup ? `[${c.title}]` : c.title))).toEqual([
            "[Build with AI]",
            "AI Copilot",
            "Agent Skills",
            "[AI in your flows]",
            "AI Agents",
            "Ungrouped",
        ])
    })

    it("leaves sections without sidebarGroup unchanged", () => {
        const ungrouped = docs().map((d) => ({ ...d, data: { title: d.data.title } }))
        const children = findAiTools(getNavigationTree(ungrouped)).children!
        expect(children.some((c) => c.isGroup)).toBe(false)
    })

    it("never uses a group label as a prev/next target", () => {
        const tree = getNavigationTree(docs())
        const navigation = [{ title: "Documentation", children: tree }]
        const { prev, next } = prevNext(navigation, "/docs/ai-tools/agent-skills")
        expect(prev?.path).toBe("/docs/ai-tools/ai-copilot")
        expect(next?.path).toBe("/docs/ai-tools/ai-agents")
    })
})
