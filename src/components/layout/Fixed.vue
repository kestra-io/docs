<template>
    <div id="fixed-container">
        <div class="text-end">
            <Transition>
                <button
                    type="button"
                    class="btn btn-sm btn-primary mb-2"
                    @click="backToTop"
                    v-if="yScroll > 200"
                    aria-label="Scroll to top"
                >
                    <ChevronUp />
                </button>
            </Transition>
            <div class="widget-chat">
                <button
                    class="btn"
                    title="Ask Kestra AI"
                    data-bs-toggle="modal"
                    data-bs-target="#search-ai-modal"
                >
                    <img :src="AIGenImg.src" alt="Kestra AI" width="25" height="25" />
                    <span class="title d-none d-md-inline">Ask Kestra AI</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, onMounted, onUnmounted } from "vue"
    import { useThrottleFn } from "@vueuse/core"
    import ChevronUp from "vue-material-design-icons/ChevronUp.vue"
    import AIGenImg from "../docs/assets/ai-generate-lined.svg"


    const yScroll = ref(0)

    const handleScroll = useThrottleFn(() => {
        yScroll.value = window.scrollY
    }, 100)

    const backToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        })
    }

    onMounted(() => {
        if (typeof window !== "undefined") {
            window.addEventListener("scroll", handleScroll, { passive: true })
            handleScroll()
        }
    })

    onUnmounted(() => {
        if (typeof window !== "undefined") {
            window.removeEventListener("scroll", handleScroll)
        }
    })

    
</script>

<style lang="scss" scoped>
    #fixed-container {
        position: fixed;
        z-index: 9999;
        bottom: 10px;
        right: 10px;
        transform: translateX(0);
        transition: all ease 0.2s;
        .text-end {
            a {
                background-color: var(--ks-background-button-primary-hover);
                border-color: var(--ks-border-active);
            }
        }
        .widget-chat {
            a {
                background-color: var(--ks-background-button-primary-hover);
                border-color: var(--ks-border-active);
            }
            button {
                display: inline-flex;
                align-items: center;
                width: 137px;
                height: 36px;
                padding: 8px 16px;
                border-radius: 44px;
                background: $white;
                border: 1px solid var(--ks-border-active);
                box-shadow: 2px 3px 16px 0px var(--ks-shadows-light);
                font-size: $font-size-xs;
                font-weight: 600;
                color: $black;
            }
            img {
                border-radius: 6px;
            }
        }
        span.online {
            font-weight: normal;
            font-size: $font-size-xs;
        }
        @include media-breakpoint-down("md") {
            display: none;
        }
        .v-enter-active,
        .v-leave-active {
            transition: opacity 0.8s ease;
        }
        .v-enter-from,
        .v-leave-to {
            opacity: 0;
        }
    }
</style>