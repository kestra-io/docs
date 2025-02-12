<template>
    <NuxtLink :href="link" :target="target">
        <slot />
    </NuxtLink>
</template>

<script setup>
    import {useAsyncData} from "#imports";
    import {hash} from "ohash";

    const route = useRoute()
    const config = useRuntimeConfig()
    const props = defineProps({
        href: {
            type: String,
            default: ''
        },
        target: {
            type: String,
            default: undefined
        }
    })
    let link = props.href
    let target = props.target || (link.startsWith("http") ? "_blank" : undefined);


    // if path is relative
    if (link.match(/^\.+\//)) {
        const NON_NUXT_CONTENT_RESOLVED_PATHS = ["/plugins/"];
        const routePath = route.path.replace(/\/$/, '')
        let absolutePath = config.public.siteUrl + routePath;
        let page;
        // We only fetch the page if it's resolved through Nuxt Content
        if (!NON_NUXT_CONTENT_RESOLVED_PATHS.some(p => route.path.includes(p))) {
            page = (await useAsyncData(
                `ProseA-${hash(route.path)}`,
                () => queryCollection('docs').path(routePath).select('id').first(),
                {
                    dedupe: "defer"
                }
            )).data;
        }

        // If we are on an index page, we want to resolve relative paths starting from our current route
        if (page?.value?.id?.endsWith('index.md') || !page) {
            absolutePath = absolutePath + "/";
        }

        // If absolute path has a trailing slash, it will resolve link relatively to current route (in a folder-like manner), else it will resolve starting from parent route
        link = new URL(link, absolutePath).toString();

        if (link.endsWith('/')) {
            link = link.replace(/\/$/, '')
        }

        // Allow numeration in markdown files while getting rid of it in the resolved path
        link = link.replace(/(\/|^)\d+?\.(?!\d)/g, '$1.')
        // Md extension should not be present in URL, Nuxt will automatically resolve the file based on the route
        link = link.replace(/\.md(#|$)/g, '$1')

        // Will end up with absolute paths without host URLs
        link = link.replace(config.public.siteUrl, '')
    }
</script>
