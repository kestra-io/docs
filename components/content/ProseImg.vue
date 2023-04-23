<template>
    <img :src="refinedSrc" :alt="alt" :width="width" :height="height" :class="classWithZoom">
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
const classWithZoom = computed(() => {
    console.log("CURRENT CLASSES : "+props.class);
    return "zoom " + props.class
})
</script>