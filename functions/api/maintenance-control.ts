interface Env {
    CLOUDFLARE_KVSTORAGE: KVNamespace;
    NUXT_PUBLIC_CURRENT_SHA?: string;
    CF_PAGES_COMMIT_SHA?: string;
}

export const onRequest: PagesFunction<Env> = async (context) => {
    const { searchParams } = new URL(context.request.url)
    const sha = searchParams.get('sha')
    const action = searchParams.get('action') || 'get'

    try {
        // Get KV storage from the event context (Cloudflare binding)
        const kvStorage = context.env?.CLOUDFLARE_KVSTORAGE

        if (!kvStorage) {
            return new Response(
                JSON.stringify({
                    error: 'KV storage not available'
                }),
                {
                    status: 503,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )
        }

        let result: any = {}

        switch (action) {
            case 'set':
                if (!sha) {
                    return new Response(
                        JSON.stringify({
                            error: 'SHA is required for set action'
                        }),
                        {
                            status: 400,
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }
                    )
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
                // Note: We can't access runtime config in Cloudflare Pages Functions
                // The runtime SHA should be passed as a parameter or environment variable
                result = {
                    storedSHA,
                }
                break

            default:
                return new Response(
                    JSON.stringify({
                        error: 'Invalid action. Must be "set", "clear", or "get"'
                    }),
                    {
                        status: 400,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                )
        }

        return new Response(
            JSON.stringify(result),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
    } catch (error) {
        console.error('Error in maintenance control API:', error)

        return new Response(
            JSON.stringify({
                error: error instanceof Error ? error.message : 'Unknown error',
                details: 'Internal server error'
            }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
    }
}
