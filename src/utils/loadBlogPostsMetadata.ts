import yaml from 'js-yaml';
import type { BlogPost } from '~/components/common/BlogList.vue';
import generateId from '~/utils/generateId';

export default async function loadBlogPostsMetadata() {
  const files: Record<string, string> = import.meta.glob("../../content/blogs/*.md", { eager: true, query: '?raw', });
  // first retrieve all blog posts file paths
  const blogPostsMetadata = await Promise.all(Object.entries(files).map(async ([filePath, content]) => {
    // extract frontmatter metadata from the markdown content
    const match = content.match(/---\n([\s\S]*?)\n---/);
    if (match) {
      const metadataRaw = match[1];
      // finally extract the metadata key-value pairs
      // from the YAML-like frontmatter
      const metadata = yaml.load(metadataRaw) as unknown as Omit<BlogPost, 'date'> & { date: Date };
      return {
        data: metadata,
        id: generateId({entry: filePath}),
      };
    }
    return null;
  }));
  return blogPostsMetadata.filter(post => post !== null);
}