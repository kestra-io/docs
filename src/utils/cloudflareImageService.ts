import cloudflareService from "@astrojs/cloudflare/image-service"
import type { ExternalImageService } from "astro"

const service: ExternalImageService = {
    ...cloudflareService,
    validateOptions: async (options, imageConfig, logger) => {
        const requested = options.format
        const validated = await cloudflareService.validateOptions!(options, imageConfig, logger)
        // Astro fills an unset format with WebP; let Cloudflare's `format=auto`
        // pick AVIF or WebP per request instead. Explicit formats are kept.
        return requested || validated.format === "svg"
            ? validated
            : { ...validated, format: "auto" }
    },
}

export default service
