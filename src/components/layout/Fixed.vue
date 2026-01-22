<template>
    <div id="fixed-container">
        <div class="text-end">
            <Transition>
                <a
                    href="#"
                    class="btn btn-sm btn-primary mb-2"
                    @click="backToTop"
                    v-if="yScroll > 200"
                >
                    <ChevronUp />
                </a>
            </Transition>
            <Slack v-if="displaySlack" widget :online="online" />
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, onMounted, onUnmounted } from "vue"
    import ChevronUp from "vue-material-design-icons/ChevronUp.vue"
    import Slack from "~/components/community/Slack.vue"

    const props = withDefaults(
        defineProps<{
            displaySlack?: boolean
            online?: number
        }>(),
        {
            displaySlack: true,
            online: 0,
        },
    )

    const yScroll = ref(0)

    const handleScroll = () => {
        yScroll.value = window.scrollY
    }

    const backToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        })
    }

    onMounted(() => {
        if (typeof window !== "undefined") {
            window.addEventListener("scroll", handleScroll)
        }
    })

    onUnmounted(() => {
        if (typeof window !== "undefined") {
            window.removeEventListener("scroll", handleScroll)
        }
    })
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    #fixed-container {
        position: fixed;
        z-index: 9999;
        bottom: 10px;
        right: 10px;
        transform: translateX(0);
        transition: all ease 0.2s;

        .text-end {
            a {
                background-color: $primary-1;
                border-color: $primary-1;
            }
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