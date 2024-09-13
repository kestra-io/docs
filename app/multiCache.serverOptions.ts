import {defineMultiCacheOptions} from 'nuxt-multi-cache/dist/runtime/serverOptions'
import lruCacheDriver from "unstorage/drivers/lru-cache";
import cloudflareKVBindingDriver from "unstorage/drivers/cloudflare-kv-binding";

export default defineMultiCacheOptions({
    data: {
        storage: {
            driver: import.meta.dev ?
                lruCacheDriver({}) :
                cloudflareKVBindingDriver({binding: "CLOUDFLARE_KVSTORAGE"})
        },
    },
})