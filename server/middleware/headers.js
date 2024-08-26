export default defineEventHandler((event) => {
    const url = event.node.req.url;

    event.node.res.setHeader("X-Frame-Options", "DENY");
    event.node.res.setHeader("X-Content-Type-Options", "nosniff");

    if (url.startsWith("/api/_content/")) {
        event.node.res.setHeader("Cache-Control", "public, max-age=604800, immutable");
    }
})
