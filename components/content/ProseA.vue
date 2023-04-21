<template>
    <NuxtLink :href="link" :target="target">
        <slot />
    </NuxtLink>
</template>

<script setup>
    const route = useRoute()
    const config = useRuntimeConfig()
    const props = defineProps({
        href: {
            type: String,
            default: ''
        }
    })
    let link = props.href
    // if path is relative
    if (link.match(/(\.+\/)+/)) {
        const page = await queryContent(route.path).findOne()
        const routePath = route.path.replace(/\/$/, '')
        const absolutePath = config.public.siteUrl + routePath;
        if (link.match(/(\.\.\/){2,}/) && page._file.includes('index.md')) {
            link = link.replace('../', '')
        }
        if (link.match(/(\.\.\/){1}/) && page._file.includes('index.md')) {
            link = link.replace('../', './')
        }
        if (link.startsWith('./')) {
            link = absolutePath + link.replace('./', '/')
        } else {
            link = (new URL(link, absolutePath).toString()).replace(config.public.siteUrl,"");
        }
        if (link.endsWith('/')) {
            link = link.replace(/\/$/, '')
        }
    }

</script>
<script>
    export default {
        props: {
            href: {
                type: String,
                default: ''
            },
            target: {
                type: String,
                default: undefined,
                required: false
            }
        },
        computed: {
            hrefGenerated() {
                return this.href;
            },
        },
    }
</script>
