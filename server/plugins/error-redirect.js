export default defineNitroPlugin((nitroApp) => {
    nitroApp.hooks.hook("beforeResponse", async (event, { body }) => {
        const requestUrl = getRequestURL(event)
        const config = useRuntimeConfig();

        if (
            requestUrl.pathname === "/__nuxt_error" &&
            requestUrl.searchParams.has("url") &&
            requestUrl.searchParams.get('statusCode') === "404"
        ) {
            const originalUrl = requestUrl.searchParams.get("url");
            let redirectUrl = undefined;

            if (originalUrl.endsWith("/")) {
                redirectUrl = originalUrl.substring(0, originalUrl.length - 1);
            }

            try {
                const result = await $fetch(`${config.public.apiUrl}/redirects?${new URLSearchParams({from: originalUrl}).toString()}`);

                if (result && result.to && result.to !== originalUrl) {
                    redirectUrl = result.to;
                }
            } catch (e) {
                console.error(e);
            }

            if (redirectUrl) {
                sendRedirect(event, redirectUrl, 301)
                body = ""
            }
        }

    });
})