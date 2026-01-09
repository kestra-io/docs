import {promises as fs} from 'fs';
import yaml from 'js-yaml';
import type { BlogPost } from '~/components/common/BlogList.vue';
import generateId from '~/utils/generateId';

const __dirname = new URL('.', import.meta.url).pathname;
export default async function loadBlogPostsMetadata() {
    const blogsDir = `${__dirname}/../../content/blogs`
  // first retrieve all blog posts file paths
  const files = await fs.readdir(blogsDir)
  const blogPostsMetadata = await Promise.all(files.map(async (file) => {
    // for each file, read its content
    const content = await fs.readFile(`${__dirname}/../../content/blogs/${file}`, 'utf-8');
    // extract frontmatter metadata from the markdown content
    const match = content.match(/---\n([\s\S]*?)\n---/);
    if (match) {
      const metadataRaw = match[1];
      // finally extract the metadata key-value pairs
      // from the YAML-like frontmatter
      const metadata = yaml.load(metadataRaw) as unknown as Omit<BlogPost, 'date'> & { date: Date };
      return {
        data: metadata,
        id: generateId({entry: file}),
      };
    }
    return null;
  }));
  return blogPostsMetadata.filter(post => post !== null);
}