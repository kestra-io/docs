

export default defineNuxtRouteMiddleware(async (to) => {
    // Skip middleware on server during build/generation
    if (process.prerender) {
        return
    }

    // Don't apply middleware to the maintenance page itself
    if (!to.path.startsWith('/docs') && !to.path.startsWith('/blog')) {
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

        if(currentSHA === 'dev')
            return

        // Use the API endpoint to set the SHA
        const {sha:storedSha} = await $fetch<{sha:string}>('/api/current-sha', {
            method: 'GET'
        })

        if(storedSha && storedSha === currentSHA)
            return


        // Check for sha query parameter
        const shaParam = to.query.sha as string
        if(!shaParam){
            // go directly to maintenance mode
        } else if (shaParam !== currentSHA) {
            console.warn(`SHA parameter ${shaParam} does not match current SHA ${currentSHA}; this can happen when call is run before world deploy`)
        } else if (shaParam !== storedSha) {
            console.log('SHA parameter does not match, setting it in storage')

            await $fetch('/api/current-sha', {
                method: 'PUT',
                body: { sha: currentSHA }
            })

            // Redirect to the same URL without the sha parameter
            const newQuery = { ...to.query }
            delete newQuery.sha
            console.log(`Redirecting to ${to.path} without sha parameter`, newQuery)
            return navigateTo({
                path: to.path,
                query: newQuery
            }, { redirectCode: 302 })
        }

        console.log(`Maintenance detected on SHA ${currentSHA}, redirecting`)
        return navigateTo('/maintenance', {
            redirectCode: 503
        })
    } catch (error) {
        // Log error but don't block the request if check fails
        console.error('Error checking maintenance mode:', error)
    }
})
