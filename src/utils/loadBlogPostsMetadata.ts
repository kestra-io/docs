import {promises as fs} from 'fs';
import type { BlogPost } from '~/components/common/BlogList.vue';

const __dirname = new URL('.', import.meta.url).pathname;
export default async function loadBlogPostsMetadata() {
  // first retrieve all blog posts file paths
  const files = await fs.readdir(`${__dirname}/../../content/blogs`)
  const blogPostsMetadata = await Promise.all(files.map(async (file) => {
    // for each file, read its content
    const content = await fs.readFile(`${__dirname}/../../content/blogs/${file}`, 'utf-8');
    // extract frontmatter metadata from the markdown content
    const match = content.match(/---\n([\s\S]*?)\n---/);
    if (match) {
      const metadataRaw = match[1];
      const metadataLines = metadataRaw.split('\n');
      // finally extract the metadata key-value pairs
      // from the TomL-like frontmatter
      const metadata = metadataLines.reduce<Omit<BlogPost, "date"> & {date: Date}>((acc: any, line) => {
        const [key, ...rest] = line.split(':');
        if(key.trim() === "date") {
          acc["date"] = new Date(rest.join(':').trim());
          return acc;
        }
        acc[key.trim()] = rest.join(':').trim();
        return acc;
      }, {} as Omit<BlogPost, "date"> & {date: Date}
    )
      return {
        data: metadata,
        id: file.replace('.md', ''),
      };
    }
    return null;
  }));
  return blogPostsMetadata.filter(post => post !== null);
}