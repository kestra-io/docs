import type { R2Bucket, ExecutionContext, ImagesBinding, ImageTransform, ImageOutputOptions } from "@cloudflare/workers-types";

export const prerender = false;

interface RuntimeEnv {
  IMAGE_CACHE?: R2Bucket;
  IMAGES: ImagesBinding;
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

        return new Response(object.body as any, {
            headers,
        });
    } catch (error) {
        console.error('Failed to get image from R2:', error);
        return null;
    }
}

/**
 * Make a unique code to store/retrieve image from R2
 * @param input
 * @returns
 */
async function makeHash(input: string){
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(input)).then(hashBuffer => {
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    });
}

/**
 * Cloudflare Worker handler for image resizing
 * @see https://developers.cloudflare.com/images/transform-images/transform-via-workers/
 */
export async function GET({ request, params, locals }: { request: Request; params: { image: string }; locals: Locals }) {
    const r2 = locals.runtime?.env?.IMAGE_CACHE;

    const imageKey = await makeHash(params.image);
    const r2Response = await getFromR2(r2, imageKey);
    if (r2Response) {
        return r2Response;
    }

    const images = locals.runtime?.env?.IMAGES;

    const [imageOptions, ...imageURLParts] = params.image.split('/') ?? [];

    const originUrl = new URL(request.url);
    originUrl.pathname = '/' + imageURLParts.join('/');
    const originalImageStream = await fetch(originUrl.href);

    if (!originalImageStream.ok || !originalImageStream.body) {
        console.error('Failed to fetch original image:', originalImageStream.status, originalImageStream.statusText);
        console.log('Origin URL:', originUrl.href);
        return new Response('Failed to fetch original image', { status: 502 });
    }

    if(!images || !r2) {
        return originalImageStream
    }

    const rawOptions = (new URL(`http://example.com?${imageOptions}`)).searchParams

    const transformOptions: ImageTransform = { } ;
    const formatOptions: ImageOutputOptions = { format: 'image/webp' };

    // Copy parameters from query string to request options.
    // You can implement various different parameters here.
    if (rawOptions.has("width"))
      transformOptions.width = rawOptions.get("width") as any
    if (rawOptions.has("height"))
      transformOptions.height = rawOptions.get("height") as any
    if (rawOptions.has("quality"))
      formatOptions.quality = rawOptions.get("quality") as any

    if (rawOptions.has("format"))
        formatOptions.format = `image/${rawOptions.get("format")}` as any

    // Your Worker is responsible for automatic format negotiation. Check the Accept header.
    const accept = request.headers.get("Accept") ?? "";
    if (/image\/avif/.test(accept)) {
      formatOptions.format = "image/avif";
    } else if (/image\/webp/.test(accept)) {
      formatOptions.format = "image/webp";
    }


    const imageResponse = (
        await images.input(originalImageStream.body as any)
            .transform(transformOptions)
            .output(formatOptions)
    ).response()

    // deal with caching the files in cloudflare R2
    // Use waitUntil to save to R2 in the background without blocking the response
    if (locals.runtime?.ctx) {
        locals.runtime.ctx.waitUntil(saveToR2(r2, imageKey, imageResponse.clone() as any));
    } else {
        // Fallback for environments without waitUntil
        saveToR2(r2, imageKey, imageResponse.clone() as any);
    }

    return imageResponse;
};