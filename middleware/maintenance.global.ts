export default defineNuxtRouteMiddleware(async (to) => {
    // Skip middleware on server during build/generation
    if (process.prerender) {
        return
    }

    const scope = to.path.startsWith('/docs') ? 'docs' : to.path.startsWith('/blog') ? 'blogs' : null

    // Don't apply middleware on anything that does not need content
    if (!scope) {
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

        // Check for sha query parameter
        const shaSkipParam = to.query.shaSkip as string

        if(shaSkipParam === currentSHA)
            return

        // no need for maintenance in dev
        if(currentSHA === 'dev')
            return

        // Use the API endpoint to set the SHA
        const {sha:storedSha} = await $fetch<{sha:string}>(`/api/current-sha`, {
            method: 'POST',
            body: {scope}
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

            // make sure the initialization finishes properly before we free up maintenance mode
            await $fetch(to.path, {
                    method: 'GET',
                    query: { shaSkip: currentSHA }
                })

            await $fetch('/api/current-sha', {
                method: 'PUT',
                body: {
                    sha: currentSHA,
                    scope
                }
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
