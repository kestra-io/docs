import type { CollectionEntry } from "astro:content"
import yaml from "js-yaml"
import generateId from "~/utils/generateId"
const files = import.meta.glob("../../content/blogs/*.md", {
	query: "?raw",
	import: "default",
})

export default async function loadBlogPostsMetadata() {
	// first retrieve all blog posts file paths
	const blogPostsMetadata = await Promise.all(
		Object.entries(files).map(async ([filePath, content]) => {
			const fileContent = (await content()) as string
			const match = fileContent.match(/---\n([\s\S]*?)\n---/)
			if (match) {
				const metadataRaw = match[1]
				// finally extract the metadata key-value pairs
				// from the YAML-like frontmatter
				const metadata = yaml.load(
					metadataRaw,
				) as unknown as unknown as CollectionEntry<"blogs">["data"]
				return {
					data: metadata,
					id: generateId({ entry: filePath.slice(25) }),
				}
			}
			return null
		}),
	)
	return blogPostsMetadata.filter((post) => post !== null)
}