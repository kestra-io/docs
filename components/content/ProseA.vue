<template>
    <NuxtLink :href="link" :target="target">
        <slot/>
    </NuxtLink>
</template>

<script setup>
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
        const page = await queryContent(route.path).findOne()
        const routePath = route.path.replace(/\/$/, '')
        const absolutePath = config.public.siteUrl + routePath;

        if (link.match(/(\.\.\/){2,}/) && page._file.includes('index.md')) {
            link = link.replace('../', '')
        } else if (link.match(/(\.\.\/){1}/) && page._file.includes('index.md')) {
            link = link.replace('../', '')
        }

        if (link.startsWith('./') && !page._file.includes('index.md')) {
            link = (new URL(link, absolutePath).toString());
        } else if (link.startsWith('./')) {
            link = absolutePath + link.replace('./', '/')
        } else {
            link = (new URL(link, absolutePath).toString())
        }

        if (link.endsWith('/')) {
            link = link.replace(/\/$/, '')
        }

        link = link.replace(config.public.siteUrl, '')
    }

</script>
