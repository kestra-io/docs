export const prerender = false

import type { APIRoute } from "astro"
import { proxyTracking } from "../../utils/trackingProxy"

// In production the Cloudflare worker (src/middlewares/worker.ts) intercepts
// /t/* before Astro runs, so this route is only exercised by the dev server.
export const ALL: APIRoute = ({ request, clientAddress }) => proxyTracking(request, clientAddress)
