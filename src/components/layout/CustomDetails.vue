<template>
    <div class="accordion-item custom-details">
        <h2 class="accordion-header" :class="{ 'no-border': isOpen }">
            <button
                class="accordion-button"
                :class="{ collapsed: !isOpen }"
                type="button"
                :aria-expanded="isOpen"
                @click="isOpen = !isOpen"
            >
                <span>{{ title }}</span>
                <ChevronDown class="icon" />
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
    import ChevronDown from "vue-material-design-icons/ChevronDown.vue";

    const props = defineProps<{
        title: string
        defaultOpen?: boolean
    }>()

    const isOpen = ref(props.defaultOpen)

    const enter = (el: any) => {
        el.style.height = "0";
        void el.offsetHeight;
        el.style.height = `${el.scrollHeight}px`;
    };

    const afterEnter = (el: any) => {
        el.style.height = "auto";
    };

    const leave = (el: any) => {
        el.style.height = `${el.scrollHeight}px`;
        void el.offsetHeight;
        el.style.height = "0";
    };
</script>

<style scoped lang="scss">
    @import "~/assets/styles/variable";

    .custom-details {
        background: var(--ks-background-body);
        border: none;
        h2 {
            border-bottom: $block-border;
            &.no-border {
                border-bottom: none;
            }
        }
        .accordion-button {
            color: var(--ks-content-primary);
            border: none;
            padding: $rem-1;
            font-weight: 600;
            box-shadow: none;
            font-size: 1.15rem;
            width: 100%;
            text-align: left;
            background: transparent;
            display: flex;
            justify-content: space-between;
            align-items: center;
            &::after {
                display: none;
            }
            &:hover {
                opacity: 0.8;
            }
            :deep(.icon) {
                transition: transform 0.2s ease-in-out;
                transform: rotate(360deg);
                font-size: 1.75rem;
                line-height: 1.5rem;
                flex-shrink: 0;
            }
            &.collapsed :deep(.icon) {
                transform: rotate(270deg);
            }
        }
        .accordion-body {
            color: var(--ks-content-primary);
            padding: 1rem;
            border-left: 1px solid var(--ks-content-color-highlight);
            margin-left: 1rem;
            margin-bottom: 1rem;
            :deep(a) {
                color: var(--ks-content-link);
            }
        }
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