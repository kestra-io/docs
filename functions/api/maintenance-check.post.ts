interface Env {
  CLOUDFLARE_KVSTORAGE: KVNamespace;
}

export const onRequest: PagesFunction<Env> = async (context) => {

    const {searchParams} = new URL(context.request.url)
    const currentSHA = searchParams.get('sha')

    try {
        // Get KV storage from the event context (Cloudflare binding)
        const kvStorage = context.env.CLOUDFLARE_KVSTORAGE

        if(!event.context.cloudflare)
            console.warn('no cloudflare context found, this might not be running on Cloudflare')

        console.log('Checking maintenance mode with currentSHA:', currentSHA)

        if (!kvStorage) {
            console.warn('KV storage not available, assuming no maintenance mode')
            // If KV storage is not available, assume no maintenance mode
            return new Response(JSON.stringify({
                maintenanceMode: false,
                message: 'KV storage not available'
            }))
        }

        // Get the stored SHA from KV storage
        const storedSHA = await kvStorage.get('currentSHA')

        console.log('Stored SHA from KV:', storedSHA)

        // Check if maintenance mode should be enabled (start in maintenance mode)
        const maintenanceMode = !storedSHA || storedSHA !== currentSHA

        return new Response(JSON.stringify({
            maintenanceMode,
            storedSHA,
            currentSHA,
            message: maintenanceMode
                ? `Maintenance mode: KV SHA (${storedSHA}) !== Runtime SHA (${currentSHA})`
                : 'No maintenance mode'
        }))
    } catch (error) {
        console.error('Error in maintenance check API:', error)

        // Return maintenance mode false on error to avoid blocking the site
        return new Response(JSON.stringify({
            maintenanceMode: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }))
    }
}
