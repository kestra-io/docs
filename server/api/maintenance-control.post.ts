export default defineEventHandler(async (event) => {
    if (event.node.req.method !== 'POST') {
        throw createError({
            statusCode: 405,
            statusMessage: 'Method Not Allowed'
        })
    }

    try {
        const body = await readBody(event)
        const { sha, action } = body

        if (!action || !['set', 'clear', 'get'].includes(action)) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Invalid action. Must be "set", "clear", or "get"'
            })
        }

        // Get KV storage from the event context (Cloudflare binding)
        const kvStorage = event.context.cloudflare?.env?.CLOUDFLARE_KVSTORAGE

        if (!kvStorage) {
            throw createError({
                statusCode: 503,
                statusMessage: 'KV storage not available'
            })
        }

        let result: any = {}

        switch (action) {
            case 'set':
                if (!sha) {
                    throw createError({
                        statusCode: 400,
                        statusMessage: 'SHA is required for set action'
                    })
                }
                await kvStorage.put('currentSHA', sha)
                result = { message: `SHA set to: ${sha}`, sha }
                break

            case 'clear':
                await kvStorage.delete('currentSHA')
                result = { message: 'SHA cleared from KV storage' }
                break

            case 'get':
                const storedSHA = await kvStorage.get('currentSHA')
                const config = useRuntimeConfig()
                const runtimeSHA = config.public.currentSHA
                result = {
                    storedSHA,
                    runtimeSHA,
                    maintenanceMode: storedSHA && storedSHA !== runtimeSHA
                }
                break
        }

        return result
    } catch (error) {
        console.error('Error in maintenance control API:', error)
        throw error
    }
})
