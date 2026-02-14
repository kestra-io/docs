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
            <div v-if="displaySlack && mounted" class="widget-chat">
                <a
                    href="https://kestra.io/slack"
                    target="_blank"
                    class="btn btn-sm btn-primary rounded"
                >
                    <Slack title="" />
                    Slack
                    <span v-if="online" class="online">{{ onlineText }} members</span>
                </a>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, computed, onMounted, onUnmounted } from "vue"
    import ChevronUp from "vue-material-design-icons/ChevronUp.vue"
    import Slack from "vue-material-design-icons/Slack.vue"

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
    const mounted = ref(false)

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
        mounted.value = true
        if (typeof window !== "undefined") {
            window.addEventListener("scroll", handleScroll)
        }
    })

    onUnmounted(() => {
        if (typeof window !== "undefined") {
            window.removeEventListener("scroll", handleScroll)
        }
    })

    const onlineText = computed(() => {
        return props.online === undefined ? "" : Intl.NumberFormat("en-US").format(props.online)
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
                background-color: var(--ks-background-button-primary-hover);
                border-color: var(--ks-background-button-primary-hover);
            }
        }
        .widget-chat {
            a {
                background-color: var(--ks-background-button-primary-hover);
                border-color: var(--ks-background-button-primary-hover);
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