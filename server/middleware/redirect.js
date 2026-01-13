export default defineEventHandler((event) => {
    const url = event.node.req.url;
    const host = getRequestHost(event);

    if (url.endsWith(".html")) {
        return sendRedirect(event, url.substring(0, url.length - 5).toLocaleLowerCase(), 301);
    }

    // Check if the request is coming from the kestra-io.pages.dev to redirect to main
    if (host === 'kestra-io.pages.dev') {
        return sendRedirect(event, 'https://kestra.io' + url, 301);
    }
})
