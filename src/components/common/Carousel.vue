<template>
    <div class="carousel-container">
        <button class="navigation navigation-left" @click="scrollLeft">
            <ArrowLeftIcon />
        </button>
        <button class="navigation navigation-right" @click="scrollRight">
            <ArrowRightIcon />
        </button>
        <div class="carousel-content" ref="wrapper">
            <slot />
        </div>
    </div>
</template>

<script setup lang="ts">
    import { useTemplateRef } from "vue"
    import ArrowLeftIcon from "vue-material-design-icons/ArrowLeft.vue"
    import ArrowRightIcon from "vue-material-design-icons/ArrowRight.vue"

    const wrapper = useTemplateRef("wrapper")

    const ONE_BLUEPRINT_WIDTH_WITH_MARGIN = 370

    const scrollLeft = () => {
        if (wrapper.value) {
            wrapper.value.scrollTo({
                left: wrapper.value.scrollLeft - ONE_BLUEPRINT_WIDTH_WITH_MARGIN,
                behavior: "smooth",
            })
        }
    }

    const scrollRight = () => {
        if (wrapper.value) {
            wrapper.value.scrollTo({
                left: wrapper.value.scrollLeft + ONE_BLUEPRINT_WIDTH_WITH_MARGIN,
                behavior: "smooth",
            })
        }
    }
</script>

<style lang="scss" scoped>
    .carousel-container {
        position: relative;
        margin: -1rem 0;
        --carrousel-padding-inline: 1rem;
        @include media-breakpoint-up(md) {
            --carrousel-padding-inline: 2rem;
        }

        .navigation {
            position: absolute;
            top: 104%;
            transform: translateY(-50%);
            color: var(--ks-content-primary);
            border-radius: 4px;
            background-color: var(--ks-background-secondary);
            z-index: 10;
            width: 44px;
            border: none;
            font-size: 16px;
            padding: 0;
            border: 1px solid var(--ks-border-primary);
            &-left {
                left: var(--carrousel-padding-inline);
            }
            &-right {
                right: var(--carrousel-padding-inline);
            }
        }
    }

    .carousel-content {
        display: flex;
        flex-wrap: nowrap;
        gap: 20px;
        overflow-x: auto;
        padding: 1rem var(--carrousel-padding-inline);
        scrollbar-width: none;
        --carrousel-gradient-width: calc(6 * var(--carrousel-padding-inline));
        --carrousel-gradient-width-inverse: calc(100% - var(--carrousel-gradient-width));
        -webkit-mask-image: linear-gradient(to right, transparent, #000 var(--carrousel-gradient-width), #000 var(--carrousel-gradient-width-inverse), transparent);
        mask-image: linear-gradient(to right, transparent, #000 var(--carrousel-gradient-width), #000 var(--carrousel-gradient-width-inverse), transparent);
    }
</style>