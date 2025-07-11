export default defineEventHandler(async (event) => {
    if (event.node.req.method !== 'POST') {
        throw createError({
            statusCode: 405,
            statusMessage: 'Method Not Allowed'
        })
    }

    try {
        const body = await readBody(event)
        const { currentSHA } = body

        if (!currentSHA) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Missing currentSHA parameter'
            })
        }

        // Get KV storage from the event context (Cloudflare binding)
        const kvStorage = event.context.cloudflare?.env?.CLOUDFLARE_KVSTORAGE

        if (!kvStorage) {
            // If KV storage is not available, assume no maintenance mode
            return {
                maintenanceMode: false,
                message: 'KV storage not available'
            }
        }

        // Get the stored SHA from KV storage
        const storedSHA = await kvStorage.get('currentSHA')

        // Check if maintenance mode should be enabled
        const maintenanceMode = storedSHA && storedSHA !== currentSHA

        return {
            maintenanceMode,
            storedSHA,
            currentSHA,
            message: maintenanceMode
                ? `Maintenance mode: KV SHA (${storedSHA}) !== Runtime SHA (${currentSHA})`
                : 'No maintenance mode'
        }
    } catch (error) {
        console.error('Error in maintenance check API:', error)

        // Return maintenance mode false on error to avoid blocking the site
        return {
            maintenanceMode: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }
    }
})
