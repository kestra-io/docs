<template>
    <div class="accordion-item custom-details">
        <h2 class="accordion-header">
            <button
                class="accordion-button"
                :class="{ 'collapsed': !isOpen }"
                type="button"
                data-bs-toggle="collapse"
                :data-bs-target="`#collapse-${uniqueId}`"
                :aria-expanded="isOpen.toString()"
                :aria-controls="`collapse-${uniqueId}`"
            >
                {{ title }}
            </button>
        </h2>
        <div
            :id="`collapse-${uniqueId}`"
            class="accordion-collapse collapse"
            :class="{ 'show': isOpen }"
        >
            <div class="accordion-body">
                <slot />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, computed, onMounted } from 'vue'

    const props = defineProps({
        title: {
            type: String,
            required: true,
        },
        defaultOpen: {
            type: Boolean,
            default: false,
        }
    })

    const isOpen = ref(props.defaultOpen)
    const uniqueId = computed(() => Math.random().toString(36).substr(2, 9))

    onMounted(() => {
        if (typeof window !== 'undefined' && window.bootstrap) {
            const collapseElement = document.getElementById(`collapse-${uniqueId.value}`)
            if (collapseElement) {
                const bsCollapse = new window.bootstrap.Collapse(collapseElement, {
                    toggle: false
                })
                if (isOpen.value) {
                    bsCollapse.show()
                }
            }
        }
    })
</script>

<style scoped lang="scss">
    @use "@kestra-io/ui-libs/src/scss/_color-palette.scss" as color-palette;
    @import "../../assets/styles/variable";

    .custom-details {
        background: $black-4 !important;
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
        color: var(--bs-black)
    }

</style>