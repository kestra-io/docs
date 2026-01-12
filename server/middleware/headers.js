export default defineEventHandler((event) => {
    const url = event.node.req.url;
    const host = getRequestHost(event);

    event.node.res.setHeader("X-Frame-Options", "DENY");
    event.node.res.setHeader("X-Content-Type-Options", "nosniff");

    if (url.startsWith("/api/_content/")) {
        event.node.res.setHeader("Cache-Control", "public, max-age=604800, immutable");
    }

    // Check if the request is coming from the .pages.dev domain or others
    if (host !== 'kestra.io') {
        setResponseHeader(event, 'X-Robots-Tag', 'noindex, nofollow');
    }
})
