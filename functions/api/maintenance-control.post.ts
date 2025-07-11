interface Env {
  CLOUDFLARE_KVSTORAGE: KVNamespace;
}

export const onRequest: PagesFunction<Env> = async (context) => {

    const {searchParams} = new URL(context.request.url)
    const sha = searchParams.get('sha')
    const action = searchParams.get('action') || 'get'

    try {

        // Get KV storage from the event context (Cloudflare binding)
        const kvStorage = context.env?.CLOUDFLARE_KVSTORAGE

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
}
