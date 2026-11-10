import cloudflareService from "@astrojs/cloudflare/image-service"
import type { ExternalImageService } from "astro"

const service: ExternalImageService = {
    ...cloudflareService,
    validateOptions: async (options, imageConfig, logger) => {
        const requested = options.format
        const validated = await cloudflareService.validateOptions!(options, imageConfig, logger)
        // Astro fills an unset format with WebP; ask Cloudflare for `format=auto`. Explicit
        // formats win, as does `inferSize`, which pre-fills the format before this hook.
        return requested || validated.format === "svg"
            ? validated
            : { ...validated, format: "auto" }
    },
}

export default service
