import {defineMultiCacheOptions} from 'nuxt-multi-cache/server-options'
import lruCacheDriver from "unstorage/drivers/lru-cache";
import cloudflareKVBindingDriver from "unstorage/drivers/cloudflare-kv-binding";

export default defineMultiCacheOptions(() => {
    return {
        data: {
            storage: {
                driver: import.meta.dev ?
                    lruCacheDriver({}) :
                    cloudflareKVBindingDriver({binding: "CLOUDFLARE_KVSTORAGE"})
            },
        },
    }
})