import type { CollectionEntry } from "astro:content"
import yaml from "js-yaml"
import generateId from "~/utils/generateId"

const files = import.meta.glob("../contents/blogs/**/index.md", {
    query: "?raw",
    import: "default",
})

const images = import.meta.glob<{ default: ImageMetadata }>(
    "../contents/blogs/**/*.{jpg,jpeg,png,webp}",
)

export default async function loadBlogPostsMetadata() {
    // first retrieve all blog posts file paths
    const blogPostsMetadata = await Promise.all(
        Object.entries(files).map(async ([path, load]) => {
            const fileContent = (await load()) as string
            const match = fileContent.match(/^---\n([\s\S]*?)\n---/m)?.[1]
            if (!match) {
                return null
            }

            // extract the metadata key-value pairs
            // from the YAML-like frontmatter
            const data = yaml.load(match) as CollectionEntry<"blogs">["data"]
            const dir = path.replace(/\/index\.md$/, "")

            // resolve the image from the frontmatter relative path
            let image: { src: string } | undefined
            const rawImage = data.image as unknown as string | undefined
            if (rawImage) {
                const mod = await images[
                    `${dir}/${rawImage.replace(/^\.\//, "")}`
                ]?.()
                if (mod) {
                    image = { src: mod.default.src }
                }
            }

            return {
                data: { ...data, image },
                id: generateId({ entry: path.slice(18) }),
            }
        }),
    )
    return blogPostsMetadata.filter((post) => post !== null)
}

