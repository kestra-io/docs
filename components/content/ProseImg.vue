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
        // since all icons will be on dark background if they are previously encoded
        // we need to change the color to #CAC5DA if not they will be black on black
        if (props.src.startsWith('data:image/svg+xml;base64,')){
            const iconB64 = props.src.substring(26)
            const coloredIcon = atob(iconB64).replace(/currentColor/g, '#CAC5DA');
            return `data:image/svg+xml;base64,${btoa(coloredIcon)}`;
        }

        if (props.src?.startsWith('/') && !props.src.startsWith('http')) {
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