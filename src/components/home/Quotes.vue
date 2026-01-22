<template>
    <div class="quotes-container">
        <button class="navigation navigation-left" @click="scrollLeft">
            <ArrowLeftIcon />
        </button>
        <button class="navigation navigation-right" @click="scrollRight">
            <ArrowRightIcon />
        </button>
        <div class="quotes" ref="wrapper">
            <template v-for="(quote, index) in quotes" :key="quote.text">
                <div class="quote-separator" v-if="index > 0" />
                <slot :quote="quote" />
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref } from "vue"
    import ArrowLeftIcon from "vue-material-design-icons/ArrowLeft.vue"
    import ArrowRightIcon from "vue-material-design-icons/ArrowRight.vue"

    const wrapper = ref<HTMLElement | null>(null)

    defineProps<{
        quotes: {
            text: string
            author: {
                name: string
                title: string
            }
            logo?: string
        }[]
    }>()

    const scrollLeft = () => {
        if (wrapper.value) {
            wrapper.value.scrollTo({
                left: wrapper.value.scrollLeft - 400,
                behavior: "smooth",
            })
        }
    }

    const scrollRight = () => {
        if (wrapper.value) {
            wrapper.value.scrollTo({
                left: wrapper.value.scrollLeft + 400,
                behavior: "smooth",
            })
        }
    }
</script>

<style lang="scss" scoped>
    .quotes {
        display: flex;
        flex-wrap: nowrap;
        padding: 2rem 4rem;
        background-color: #f7f7f8;
        gap: 2rem;
        overflow: auto;
        scrollbar-width: none;

        .quote-separator {
            min-width: 1px;
            background-color: #e1e1e1;
        }
    }

    .quotes-container {
        position: relative;
        .navigation {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background-color: black;
            color: white;
            border-radius: 50%;
            height: 44px;
            width: 44px;
            font-size: 24px;
            border-style: none;
            padding: 0;
            &-left {
                left: 1rem;
            }
            &-right {
                right: 1rem;
            }
        }
    }
</style>