import type { R2Bucket, RequestInitCfPropertiesImage, ExecutionContext } from "@cloudflare/workers-types";

interface ImageResizeOptions {
  cf: {
    image: RequestInitCfPropertiesImage;
  };
}

interface RuntimeEnv {
  IMAGE_CACHE?: R2Bucket;
}

interface Locals {
  runtime?: {
    env: RuntimeEnv;
    ctx: ExecutionContext;
  };
}

/**
 * Save generated image file to R2 for caching by key
 * @param r2 - R2 bucket instance
 * @param key - Cache key for the image
 * @param response - Response object containing the image data
 */
async function saveToR2(r2: R2Bucket | undefined, key: string, response: Response): Promise<void> {
    if (!r2) {
        console.warn('R2 bucket not configured, skipping cache save');
        return;
    }

    try {
        const contentType = response.headers.get('content-type') || 'image/webp';
        const body = await response.arrayBuffer();

        await r2.put(key, body, {
            httpMetadata: {
                contentType,
                cacheControl: 'public, max-age=31536000, immutable',
            },
        });
    } catch (error) {
        console.error('Failed to save image to R2:', error);
    }
}

/**
 * Get cached image from R2 by key
 * @param r2 - R2 bucket instance
 * @param key - Cache key for the image
 * @returns Response with cached image or null if not found
 */
async function getFromR2(r2: R2Bucket | undefined, key: string): Promise<Response | null> {
    if (!r2) {
        return null;
    }

    try {
        const object = await r2.get(key);

        if (!object) {
            return null;
        }

        const headers = new Headers();
        headers.set('content-type', object.httpMetadata?.contentType || 'image/webp');
        headers.set('cache-control', object.httpMetadata?.cacheControl || 'public, max-age=31536000, immutable');
        headers.set('etag', object.httpEtag);

        return new Response(object.body as unknown as BodyInit, {
            headers,
        });
    } catch (error) {
        console.error('Failed to get image from R2:', error);
        return null;
    }
}

/**
 * Cloudflare Worker handler for image resizing
 * @see https://developers.cloudflare.com/images/transform-images/transform-via-workers/
 */
export async function GET({ request, params, locals }: { request: Request; params: { image: string }; locals: Locals }) {
    const r2 = locals.runtime?.env?.IMAGE_CACHE;

    const r2Response = await getFromR2(r2, params.image);
    if (r2Response) {
        return r2Response;
    }

    const [imageOptions, imageURL] = params.image.split('/') ?? [];

    const rawOptions = (new URL(`http://example.com?${imageOptions}`)).searchParams

    const imageRequest = new Request(imageURL, {
      headers: request.headers,
    });

    const options: ImageResizeOptions = { cf: { image: {} } } ;

    // Copy parameters from query string to request options.
    // You can implement various different parameters here.
    if (rawOptions.has("fit"))
      options.cf.image.fit = rawOptions.get("fit") as any
    if (rawOptions.has("width"))
      options.cf.image.width = rawOptions.get("width") as any
    if (rawOptions.has("height"))
      options.cf.image.height = rawOptions.get("height") as any
    if (rawOptions.has("quality"))
      options.cf.image.quality = rawOptions.get("quality") as any

    if (rawOptions.has("format"))
        options.cf.image.format = rawOptions.get("format") as any

    // Your Worker is responsible for automatic format negotiation. Check the Accept header.
    const accept = request.headers.get("Accept") ?? "";
    if (/image\/avif/.test(accept)) {
      options.cf.image.format = "avif";
    } else if (/image\/webp/.test(accept)) {
      options.cf.image.format = "webp";
    }

    const imageResponse = await fetch(imageRequest, options as RequestInit);

    // deal with caching the files in cloudflare R2
    // Use waitUntil to save to R2 in the background without blocking the response
    if (locals.runtime?.ctx) {
        locals.runtime.ctx.waitUntil(saveToR2(r2, params.image, imageResponse.clone()));
    } else {
        // Fallback for environments without waitUntil
        saveToR2(r2, params.image, imageResponse.clone());
    }

    return imageResponse;
};