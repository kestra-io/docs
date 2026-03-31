<script lang="ts" setup>
    import { ref, computed, onMounted, onUnmounted, useTemplateRef, nextTick } from "vue"

    const props = defineProps<{
        words: string[]
    }>()

    const wordIndex = ref(0)
    const animating = ref(false)
    const noTransition = ref(false)
    let interval: ReturnType<typeof setInterval> | null = null

    const currentWord = computed(() => props.words[wordIndex.value])
    const nextIndex = computed(
        () => (wordIndex.value + 1) % props.words.length,
    )
    const nextWord = computed(() => props.words[nextIndex.value])

    const inner = useTemplateRef<HTMLSpanElement>("inner")

    function onSlideEnd() {
        if (!animating.value) return
        noTransition.value = true
        wordIndex.value = nextIndex.value
        animating.value = false
        nextTick(() => {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            inner.value?.offsetHeight
            noTransition.value = false
        })
    }

    function rotateWord() {
        if (animating.value) return
        animating.value = true
    }

    onMounted(() => {
        interval = setInterval(rotateWord, 3000)
    })

    onUnmounted(() => {
        if (interval) clearInterval(interval)
    })
</script>

<template>
    <span class="animated-word">
        <span
            ref="inner"
            class="word-inner"
            :class="{ animating, 'no-transition': noTransition }"
            @transitionend="onSlideEnd"
        >
            <span class="word">{{ currentWord }}</span>
            <span class="word">{{ nextWord }}</span>
        </span>
    </span>
</template>

<style lang="scss" scoped>
    .animated-word {
        display: inline-block;
        overflow: hidden;
        vertical-align: bottom;
        height: 1.2em;

        .word-inner {
            display: flex;
            flex-direction: column;
            transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);

            &.no-transition {
                transition: none;
            }

            &.animating {
                transform: translateY(-50%);
            }
        }

        .word {
            display: block;
            height: 1.2em;
            line-height: 1.2em;
            white-space: nowrap;
        }
    }
</style>

