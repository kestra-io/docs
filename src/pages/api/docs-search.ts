import type { APIRoute } from "astro"
import { getCollection } from "astro:content"
import { getNavigationTree } from "~/utils/getNavigationTree"
import type { DocsIndex, DocsSection } from "~/utils/search/docs"
import { markdownHeadings } from "~/utils/search/markdownHeadings"

export const prerender = true

const REFERENCE_SECTIONS = new Set([
    "terraform",
    "migration-guide",
    "api-reference",
    "contribute-to-kestra",
    "releases",
    "brand-assets",
    "docs-style-guide",
])

const icons = import.meta.glob<{ default: ImageMetadata }>(
    "/src/contents/docs/icons/*.svg",
)

const iconSrc = async (icon?: string) =>
    icon && icons[icon] ? (await icons[icon]()).default.src : undefined

export const GET: APIRoute = async () => {
    const docs = (await getCollection("docs")).filter(
        (doc) => doc.id !== "<index>",
    )
    const roots = new Map(
        docs.filter((doc) => !doc.id.includes("/")).map((doc) => [doc.id, doc]),
    )
    const sidebar = getNavigationTree([...docs])
        .flatMap((group) => group.children ?? [])
        .map((item) => item.path.replace(/^\/docs\//, ""))

    const sections: Record<string, DocsSection> = {}
    for (const doc of docs) {
        const section = doc.id.split("/")[0]
        if (sections[section]) continue
        const root = roots.get(section)
        const position = sidebar.indexOf(section)
        const firstIcon = docs.find(
            (d) => d.id.startsWith(`${section}/`) && d.data.icon,
        )?.data.icon
        sections[section] = {
            title: root?.data.sidebarTitle ?? root?.data.title ?? section,
            icon: await iconSrc(root?.data.icon ?? firstIcon),
            order: position === -1 ? sidebar.length : position,
            sidebar: position !== -1,
            reference: REFERENCE_SECTIONS.has(section),
        }
    }

    const pages = docs
        .sort((a, b) => (a.filePath ?? a.id).localeCompare(b.filePath ?? b.id))
        .map((doc) => ({
            id: doc.id,
            title: doc.data.title,
            short: doc.data.sidebarTitle ?? doc.data.h1 ?? doc.data.title,
            description: doc.data.description ?? "",
            headings: markdownHeadings(doc.body),
        }))

    const index: DocsIndex = { sections, pages }
    return new Response(JSON.stringify(index), {
        headers: { "Content-Type": "application/json" },
    })
}
