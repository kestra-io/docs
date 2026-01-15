import yaml from 'js-yaml';
import { type CollectionEntry } from 'astro:content';
import generateId from '~/utils/generateId';
import {generate} from "~/utils/ogImage.ts";
const files: Record<string, string> = import.meta.glob("../../../../content/docs/**/*.md", { eager: true, query: '?raw', import: 'default' });

async function loadDocsMetadata() {
  // first retrieve all blog posts file paths
  const docsMetadata = await Promise.all(Object.entries(files).map(async ([filePath, content]) => {
    const match = content.match(/---\n([\s\S]*?)\n---/);
    if (match) {
      const metadataRaw = match[1];
      // finally extract the metadata key-value pairs
      // from the YAML-like frontmatter
      const metadata = yaml.load(metadataRaw) as unknown as CollectionEntry<"docs">["data"];
      return {
        data: metadata,
        id: generateId({entry: filePath.slice(24)}),
      };
    }
    return null;
  }));
  return docsMetadata.filter(page => page !== null);
}

const docsMetadata = await loadDocsMetadata();

export const prerender = false

export async function GET({ request, params }: { request: any, params: { path: string } }) {
    const path = params.path;
    const entry = docsMetadata.find(doc => doc.id === `/${path}`);

    if (entry === undefined) {
        return new Response("", {
            status: 301,
            headers: {
                Location: "/og-image.png"
            }
        });
    }

    const svgString = generate(
        request,
        "Documentation",
        entry.data.title,
        entry.data.icon
    );

    return new Response(svgString, {
        headers: {
            'Content-Type': 'image/svg+xml',
            'Cache-Control': 'max-age=86400',
        },
    });
}
