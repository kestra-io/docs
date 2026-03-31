<script lang="ts" setup>
    import { ref, onMounted, onUnmounted } from "vue"

    const props = defineProps<{
        words: string[]
    }>()

    const wordIndex = ref(0)
    let interval: ReturnType<typeof setInterval> | null = null

    onMounted(() => {
        interval = setInterval(() => {
            wordIndex.value = (wordIndex.value + 1) % props.words.length
        }, 3000)
    })

    onUnmounted(() => {
        if (interval) clearInterval(interval)
    })
</script>

<template>
    <span class="animated-word">
        <Transition name="slide">
            <span class="word" :key="wordIndex">{{
                props.words[wordIndex]
            }}</span>
        </Transition>
    </span>
</template>

<style lang="scss" scoped>
    .animated-word {
        display: inline-block;
        overflow: hidden;
        vertical-align: bottom;
        height: 1.2em;
        position: relative;
    }

    .word {
        display: block;
        height: 1.2em;
        line-height: 1.2em;
        white-space: nowrap;
    }

    .slide-enter-active,
    .slide-leave-active {
        transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .slide-leave-active {
        position: absolute;
        top: 0;
        left: 0;
    }

    .slide-enter-from {
        transform: translateY(100%);
    }

    .slide-leave-to {
        transform: translateY(-100%);
    }
</style>

