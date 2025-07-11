export default defineNuxtRouteMiddleware(async (to) => {
    // Skip middleware on server during build/generation
    if (process.prerender) {
        return
    }

    // Don't apply middleware to the maintenance page itself
    if (to.path === '/maintenance') {
        return
    }

    // Skip API routes and assets
    if (to.path.startsWith('/api/') ||
        to.path.startsWith('/_nuxt/') ||
        to.path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
        return
    }

    // Only run on server side to avoid hydration issues
    if (process.client) {
        return
    }

    try {
        const config = useRuntimeConfig()
        const currentSHA = config.public.currentSHA

        // Check for sha query parameter
        const shaParam = to.query.sha as string
        if (shaParam) {
            // Use the API endpoint to set the SHA
            await $fetch('/api/maintenance-control', {
                method: 'POST',
                body: { 
                    action: 'set', 
                    sha: shaParam 
                }
            }).catch((error) => {
                console.error('Failed to set SHA via query parameter:', error)
            })

            // Redirect to the same URL without the sha parameter
            const newQuery = { ...to.query }
            delete newQuery.sha
            return navigateTo({
                path: to.path,
                query: newQuery
            }, { redirectCode: 302 })
        }

        // For Cloudflare Pages, check if KV storage is available
        if (process.env.NITRO_PRESET === 'cloudflare-pages') {
            // The server middleware should handle this, but this is a fallback
            // We'll use a simple fetch to our own API endpoint
            const response = await $fetch<{maintenanceMode: boolean}>('/api/maintenance-check', {
                method: 'POST',
                body: { currentSHA }
            }).catch(() => null)

            if (response?.maintenanceMode) {
                console.log('Maintenance mode detected via API check')
                return navigateTo('/maintenance', {
                    redirectCode: 503
                })
            }
        }
    } catch (error) {
        // Log error but don't block the request if check fails
        console.error('Error checking maintenance mode:', error)
    }
})
