export default defineEventHandler((event) => {
    const url = event.node.req.url;
    if (url.endsWith(".html")) {
        return sendRedirect(event, url.substring(0, url.length - 5).toLocaleLowerCase(), 301);
    } else if (url.endsWith("/") && process.env.NODE_ENV !== "development") {
        return sendRedirect(event, url.substring(0, url.length - 1).toLocaleLowerCase(), 301);
    }

})
