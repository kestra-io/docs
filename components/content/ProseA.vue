<template>
    <NuxtLink :href="link" :target="target">
        <slot/>
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
    if (link.match(/(\.+\/)+/)) {
        const {data: page} = await useAsyncData(
            `ProseA-${hash(route.path)}`,
            () => queryContent(route.path).only("_file").findOne()
        );

        const routePath = route.path.replace(/\/$/, '')
        const absolutePath = config.public.siteUrl + routePath;
        if (link.match(/(\.\.\/){2,}/) && page.value._file.includes('index.md')) {
            link = link.replace('../', '')
        } else if (link.match(/(\.\.\/){1}/) && page.value._file.includes('index.md')) {
            link = link.replace('../', '')
        }

        if (link.startsWith('./') && !page.value._file.includes('index.md')) {
            link = (new URL(link, absolutePath).toString());
        } else if (link.startsWith('./')) {
            link = absolutePath + link.replace('./', '/')
        } else {
            link = (new URL(link, absolutePath).toString())
        }

        if (link.endsWith('/')) {
            link = link.replace(/\/$/, '')
        }

        link = link.replace(/\d+\./g,'')
        link = link.replace(/\.md/g,'')

        link = link.replace(config.public.siteUrl, '')
    }

</script>
