export default defineEventHandler((event) => {
    const url = event.node.req.url;
    if (url.endsWith(".html")) {
        return sendRedirect(event, url.substring(0, url.length - 5).toLocaleLowerCase(), 301);
    }

})
