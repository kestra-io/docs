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
    .carousel-container {
        position: relative;
        .navigation {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            color: var(--ks-content-primary);
            border-radius: 50%;
            background-color: var(--ks-background-secondary);
            z-index: 1;
            height: 44px;
            width: 44px;
            border: none;
            font-size: 24px;
            padding: 0;
            border: 1px solid var(--ks-border-primary);
            &-left {
                left: 1rem;
            }
            &-right {
                right: 1rem;
            }
        }
    }

    .carousel-content {
        display: flex;
        flex-wrap: nowrap;
        gap: 20px;
        overflow-x: auto;
        scrollbar-width: none;
    }
</style>