import { visit } from "unist-util-visit"

/**
 * `![alt](./diagram.png#light)` / `![alt](./diagram.png#dark)` renders the
 * image only in that theme (same convention as VitePress and GitHub).
 * This must run at the remark stage, before Astro collects image paths,
 * so the fragment-less URL is what astro:assets resolves and optimizes.
 */
const THEME_FRAGMENT = /#(light|dark)$/

export default function remarkThemeImage() {
    return (tree: any) => {
        visit(tree, "image", (node: any) => {
            const theme = String(node.url ?? "").match(THEME_FRAGMENT)
            if (!theme) return

            node.url = node.url.slice(0, -theme[0].length)

            const data = node.data ?? (node.data = {})
            const props = data.hProperties ?? (data.hProperties = {})
            props.className = [`only-${theme[1]}`]
        })
    }
}
