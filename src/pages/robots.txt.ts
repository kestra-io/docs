import type { APIRoute } from "astro";

export const GET: APIRoute = async (context) => {
    const disabled = import.meta.env.DEV || context.url.hostname.indexOf("kestra.io") !== -1;

    const result = `# indexing ${disabled ? 'disabled' : 'enabled'}

User-agent: *
Disallow: ${disabled ? '*' : '/slack'}
${disabled ? '' : 'Sitemap: https://kestra.io/sitemap/index.xml'}
`
    return new Response(result, {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
        }
    });
};



