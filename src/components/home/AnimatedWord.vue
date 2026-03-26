<script lang="ts" setup>
    import { watch, ref, useTemplateRef, nextTick, computed } from "vue"

    const props = defineProps<{
        words: string[]
    }>()
    const wordIndex = ref(0)

    setInterval(() => {
        wordIndex.value = (wordIndex.value + 1) % props.words.length
    }, 3000)

    const word = useTemplateRef<HTMLSpanElement | null>("word")

    watch(wordIndex, async () => {
        if (word.value) {
            // fade out the current word
            word.value.style.opacity = "0"
            // then create a span for each letter of the next word
            // and add it to the DOM before the word.value
            const nextWord = props.words[wordIndex.value]
            const letters = nextWord.split("").map((letter) => {
                const span = document.createElement("span")
                span.textContent = letter
                span.style.opacity = "0"
                span.style.transform = "translateY(-60px)"
                span.style.transition =
                    "opacity 0.1s ease-in-out, transform 0.3s ease-out"
                return span
            })

            // add the letters to an absolute positioned span
            const spanWrapper = document.createElement("span")
            spanWrapper.style.position = "absolute"
            letters.forEach((span) => {
                spanWrapper.appendChild(span)
            })

            word.value?.parentNode?.insertBefore(spanWrapper, word.value)

            // slide down each letter one by one with a delay of 50ms
            letters.forEach((span, index) => {
                setTimeout(
                    () => {
                        span.style.transform = "translateY(0)"
                        span.style.opacity = "1"
                    },
                    (index + 1) * 70,
                )
            })
            // once all letters are visible, remove the old word and set the new word
            setTimeout(
                () => {
                    if (word.value) {
                        word.value.style.transition = "none"
                        word.value.style.removeProperty("opacity")
                        word.value.innerHTML = letters
                            .map((span) => span.outerHTML)
                            .join("")
                        letters.forEach((span) => {
                            span.remove()
                        })
                        word.value.style.position = ""
                        setTimeout(() => {
                            word.value?.style.removeProperty("transition")
                        }, 50)
                    }
                },
                50 * (nextWord.length + 1) + 300,
            )
        }
    })
    const letters = computed(() => props.words[0].split(""))
</script>

<template>
    <span ref="word">
        <span v-for="(letter, index) in letters" :key="letter + index">{{
            letter
        }}</span>
    </span>
</template>

<style lang="scss">
    span {
        display: inline-block;
        transition: opacity 0.5s ease-in-out;
    }
</style>
