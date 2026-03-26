<script lang="ts" setup>
    import { transition } from "@vueuse/core"
    import { ref } from "vue"

    const props = defineProps<{
        words: string[]
    }>()
    const wordIndex = ref(0)

    setInterval(() => {
        wordIndex.value = (wordIndex.value + 1) % props.words.length
    }, 3000)
</script>

<template>
    <transition name="slide-down" mode="out-in">
        <span :key="wordIndex">
            {{ words[wordIndex] }}
        </span>
    </transition>
</template>

<style scoped>
    span {
        display: inline-block;
    }
    .slide-down-enter-active,
    .slide-down-leave-active {
        transition: all 0.5s ease;
    }

    .slide-down-enter-from,
    .slide-down-leave-to {
        opacity: 0;
    }

    .slide-down-enter-from {
        transform: translateY(-100%);
    }
</style>
