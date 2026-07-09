// URL of the generated placeholder cover for a blog post without a
// frontmatter `image`. Kept free of Node-only imports so pages rendering on
// the Cloudflare Worker can use it; the generator itself lives in
// blogPlaceholderImage.ts and only runs during prerendering.
export function blogPlaceholderUrl(postId: string): string {
    return `/blogs/thumbnail/${postId.toLowerCase()}.png`
}
