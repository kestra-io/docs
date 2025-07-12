const KEY_CURRENT_SHA = 'currentSha'

export default defineNuxtRouteMiddleware(async (to) => {
    // Skip middleware on server during build/generation
    if (process.prerender) {
        return
    }

    // Don't apply middleware to the maintenance page itself
    // TODO: skip all pages that don't need content
    if (to.path === '/maintenance') {
        return
    }

    // Skip API routes and assets
    if (to.path.startsWith('/api/') ||
        to.path.startsWith('/_nuxt/') ||
        to.path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|webp|avif|xml|riv)$/)) {
        return
    }

    try {
        const config = useRuntimeConfig()
        const currentSHA = config.public.currentSHA

        // Use the API endpoint to set the SHA
        const storedSha = await useStorage().getItem(KEY_CURRENT_SHA)

        if(!storedSha || storedSha === currentSHA) {
            console.log('SHA matches, skipping maintenance check')

            return
        }

        // Check for sha query parameter
        const shaParam = to.query.sha as string
        if(shaParam && shaParam !== currentSHA) {
            console.log('SHA parameter does not match, setting it in storage')

            await useStorage().setItem(KEY_CURRENT_SHA, shaParam)

            // Redirect to the same URL without the sha parameter
            const newQuery = { ...to.query }
            delete newQuery.sha
            return navigateTo({
                path: to.path,
                query: newQuery
            }, { redirectCode: 302 })
        }


        return navigateTo('/maintenance', {
            redirectCode: 503
        })
    } catch (error) {
        // Log error but don't block the request if check fails
        console.error('Error checking maintenance mode:', error)
    }
})
