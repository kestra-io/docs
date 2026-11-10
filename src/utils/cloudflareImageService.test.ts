import { describe, expect, it } from "vitest"
import type { ImageMetadata, ImageTransform } from "astro"
import service from "~/utils/cloudflareImageService"

type ImageConfig = Parameters<typeof service.getURL>[1]
type Logger = Parameters<typeof service.getURL>[2]

const imageConfig = { domains: [], remotePatterns: [] } as unknown as ImageConfig
const logger = {} as Logger
const image = (format: ImageMetadata["format"]): ImageMetadata => ({
    src: `/_astro/hero.Bx1.${format}`,
    width: 2400,
    height: 1600,
    format,
})

const url = async (options: ImageTransform) =>
    service.getURL(
        await service.validateOptions!(options, imageConfig, logger),
        imageConfig,
        logger,
    )

describe("cloudflareImageService", () => {
    it("lets Cloudflare negotiate when no format is requested", async () => {
        expect(await url({ src: image("png"), width: 1280 })).toBe(
            "/cdn-cgi/image/onerror=redirect,width=1280,format=auto/_astro/hero.Bx1.png",
        )
    })

    it("keeps an explicitly requested format", async () => {
        expect(await url({ src: image("png"), format: "webp" })).toContain(
            "format=webp",
        )
    })

    it("leaves SVG sources as SVG", async () => {
        expect(await url({ src: image("svg") })).toContain("format=svg")
    })
})
