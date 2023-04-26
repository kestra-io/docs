import { useCDNHeaders } from '#nuxt-multi-cache/composables'

export default defineEventHandler((event) => {
    const url = event.node.req.url;

    if (url.startsWith("/api/_content/")) {
        event.node.res.setHeader("Cache-Control", "public, max-age=604800, immutable");
    }
})
