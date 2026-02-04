<template>
    <div class="accordion-item custom-details">
        <h2 class="accordion-header">
            <button
                class="accordion-button"
                :class="{ collapsed: !isOpen }"
                type="button"
                :aria-expanded="isOpen"
                @click="isOpen = !isOpen"
            >
                {{ title }}
            </button>
        </h2>
        <Transition
            name="expand"
            @enter="enter"
            @after-enter="afterEnter"
            @leave="leave"
        >
            <div v-show="isOpen" class="accordion-collapse">
                <div class="accordion-body">
                    <slot />
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
    import { ref } from "vue"

    const props = defineProps<{
        title: string
        defaultOpen?: boolean
    }>()

    const isOpen = ref(props.defaultOpen)

    const enter = (el: any) => {
        el.style.height = "0";
        // oxlint-disable-next-line no-unused-expressions this is to trigger a reflow calculation
        el.offsetHeight;
        el.style.height = `${el.scrollHeight}px`;
    };

    const afterEnter = (el: any) => {
        el.style.height = "auto";
    };

    const leave = (el: any) => {
        el.style.height = `${el.scrollHeight}px`;
        // oxlint-disable-next-line no-unused-expressions this is to trigger a reflow calculation
        el.offsetHeight;
        el.style.height = "0";
    };
</script>

<style scoped lang="scss">
    @use "@kestra-io/ui-libs/src/scss/_color-palette.scss" as color-palette;
    @import "~/assets/styles/variable";

    .custom-details {
        background: $black-4;
        border: none !important;
        border-bottom: 1px solid $black-3 !important;

        .accordion-button {
            color: var(--ks-content-primary) !important;
            border: none !important;
            padding: 1.5rem 1rem;
            font-weight: 400;
            box-shadow: none !important;
            font-size: 18.4px;

            &:hover {
                opacity: 0.8;
            }

            &:focus {
                box-shadow: none !important;
                border: none !important;
            }

            &:not(.collapsed) {
                color: var(--ks-content-primary) !important;
            }

            &::after {
                background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23ffffff'%3e%3cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3e%3c/svg%3e");
                transform: rotate(-180deg);
                width: 1.25rem;
                height: 1.25rem;
                background-size: 1.25rem;
            }

            &.collapsed::after {
                transform: rotate(0deg);
            }

            @include media-breakpoint-down(lg) {
                font-size: 18px !important;
                font-weight: 400;
            }

            .icon {
                transition: transform 0.3s ease;

                .chevron-up-icon,
                .chevron-down-icon {
                    font-size: 24px;
                }

                .chevron-up-icon {
                    display: none;
                }
            }
        }

        .accordion-body {
            color: var(--ks-content-primary) !important;
            padding: 1rem;
            border-left: 1px solid color-palette.$base-purple-300;
            margin-left: 1rem;
            margin-bottom: 1rem;
        }
    }

    h6 {
        font-weight: 700;
        color: var(--bs-black);
    }

    .expand-enter-active,
    .expand-leave-active {
        transition: height 0.3s ease-in-out;
        overflow: hidden;
    }

    .expand-enter-from,
    .expand-leave-to {
        height: 0;
    }
</style>