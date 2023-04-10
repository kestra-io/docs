<template>
    <NuxtLink :href="hrefGenerated" :target="target">
        <slot />
    </NuxtLink>
</template>

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
