import {getEntry} from "astro:content";
import {generate} from "~/composables/useOgImage.ts";

export const prerender = false

export async function GET({ request, params }: { request: any, params: { path: string } }) {
    const path = params.path;

    const entry = await getEntry('docs', path);

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
        "DOCS",
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
