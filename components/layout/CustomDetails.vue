<template>
    <div class="custom-details" :class="{ 'is-open': isOpen }">
        <div class="summary" @click="toggleDetails" role="button" tabindex="0" @keydown.enter="toggleDetails" @keydown.space="toggleDetails">
            <h3>{{ title }}</h3>
            <span class="icon">
                <ChevronDown />
                <ChevronUp />
            </span>
        </div>
        <Transition name="details-content" @enter="onEnter" @leave="onLeave">
            <div v-show="isOpen" class="content">
                <div class="content-inner">
                    <slot />
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue'
    import ChevronDown from "vue-material-design-icons/ChevronDown.vue";
    import ChevronUp from "vue-material-design-icons/ChevronUp.vue";

    const props = defineProps<{
        title: string,
        defaultOpen?: boolean
    }>()

    const isOpen = ref(props.defaultOpen)

    function toggleDetails() {
        isOpen.value = !isOpen.value
    }

    function onEnter(el: Element) {
        const element = el as HTMLElement
        element.style.height = '0'
        element.offsetHeight
        element.style.height = element.scrollHeight + 'px'
    }

    function onLeave(el: Element) {
        const element = el as HTMLElement
        element.style.height = element.scrollHeight + 'px'
        element.offsetHeight
        element.style.height = '0'
    }
</script>

<style scoped lang="scss">

    @import "../../assets/styles/variable";

    .custom-details {
        background: #121217 !important;
        padding: 1rem;
        border: none !important;
        border-bottom: 1px solid #252526 !important;
        margin-bottom: 1rem;

        .summary {
            font-weight: bold;
            display: flex;
            align-items: center;
            cursor: pointer;
            user-select: none;
            transition: all 0.2s ease;

            &:hover {
                opacity: 0.8;
            }

            > span:first-child {
                color: var(--bs-purple);
                font-size: $h3-font-size;
                margin-right: 1rem;
            }

            :deep(.material-design-icon > .material-design-icon__svg) {
                bottom: 0;
                transition: transform 0.3s ease;
            }

            h3 {
                font-size: 18.4px;
                margin-bottom: 0;
                flex-grow: 1;
                font-weight: 400;

                @include media-breakpoint-down(lg) {
                    font-size: 18px !important;
                    font-weight: 400;
                }
            }

            .icon {
                transition: transform 0.3s ease;

                .chevron-up-icon, .chevron-down-icon {
                    font-size: 24px;
                }

                .chevron-up-icon {
                    display: none;
                }
            }
        }

        .content {
            transition: height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            .content-inner {
                margin-top: 1rem;
                padding-left: 1rem;
                border-left: 1px solid #9470ff;
            }
        }

        &.is-open {
            .summary .icon {
                .chevron-down-icon {
                    display: none;
                }

                .chevron-up-icon {
                    display: block;
                }
            }
        }
    }

    .details-content-enter-active,
    .details-content-leave-active {
        transition: height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        overflow: hidden;
    }

    .details-content-enter-from,
    .details-content-leave-to {
        height: 0 !important;
    }

    h6 {
        font-weight: 700;
        color: var(--bs-black)
    }


</style>