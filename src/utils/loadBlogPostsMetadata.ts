import type { BlogPost } from '~/components/common/BlogList.vue';
import generateId from '~/utils/generateId';

export default async function loadBlogPostsMetadata() {
  const files = import.meta.glob('../../content/blogs/*.md', {eager: true});
  // first retrieve all blog posts file paths
  const blogPostsMetadata = await Promise.all(Object.entries(files).map(async ([filePath, file]: [string, any]) => {
    return {
        id: generateId({entry: filePath.replace('../../content/blogs/', '')}),
        data: file.frontmatter as BlogPost
    }
  }));
  return blogPostsMetadata.filter(post => post !== null);
}