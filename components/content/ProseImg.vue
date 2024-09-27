<template>
    <span class="text-center d-block img-block">
        <NuxtImg
            v-if="isNuxtImage"
            :src="refinedSrc"
            :alt="alt"
            :width="width"
            :height="height"
            :class="classWithZoom"
            loading="lazy"
            format="webp"
            quality="80"
            densities="x1 x2"
        />

        <img
            v-else
            :src="refinedSrc"
            :alt="alt"
            :width="width"
            :height="height"
            :class="classWithZoom"
            loading="lazy"
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

    const isNuxtImage = computed(() => {
        // gif with cloudflare didn't works
        return !props.src.endsWith(".gif");
    })

    const classWithZoom = computed(() => {
        return "zoom " + props.class
    })
</script>