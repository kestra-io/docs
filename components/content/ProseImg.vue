<template>
    <span class="image-margin" :class="defaultClasses">
        <NuxtImg
            :src="refinedSrc"
            :alt="alt"
            :width="`${width}px`"
            :height="`${height}px`"
            :class="classWithZoom"
            loading="lazy"
            format="webp"
            quality="80"
            densities="x1 x2"
        />
    </span>
</template>

<script setup lang="ts">
    import { withBase } from 'ufo'
    import { useRuntimeConfig, computed } from '#imports'

    const props = defineProps({
        src: {
            type: String,
            default: ''
        },
        alt: {
            type: String,
            default: ''
        },
        width: {
            type: [String, Number],
            default: undefined
        },
        height: {
            type: [String, Number],
            default: undefined
        },
        defaultClasses: {
            type: String,
            default: 'text-center d-block'
        },
        class: {
            type: String,
            default: ''
        }
    })

    const refinedSrc = computed(() => {
        if (props.src?.startsWith('/') && !props.src.startsWith('//')) {
            return withBase(props.src, useRuntimeConfig().app.baseURL)
        }
        return props.src
    })

    const classWithZoom = computed(() => {
        return "zoom " + props.class
    })
</script>

<style lang="scss">
.image-margin {
    margin-right: 10px;
}
</style>