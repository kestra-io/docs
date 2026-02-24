<template>
    <details data-usal="zoomin">
        <summary>
            <h3>{{ title }}</h3>
            <span class="icon">
                <ChevronDown />
                <ChevronUp />
            </span>
        </summary>
        <div>
            <slot />
        </div>
    </details>
</template>

<script setup>
    import ChevronDown from "vue-material-design-icons/ChevronDown.vue"
    import ChevronUp from "vue-material-design-icons/ChevronUp.vue"

    defineProps({
        title: { type: String, required: true }
    })
</script>

<style scoped lang="scss">
    @import "~/assets/styles/variable";

    :deep(svg) {
        color: var(--ks-content-primary);
        font-size: 24px;
    }

    details {
        border-radius: 4px;
        border: $block-border;
        background: var(--ks-background-secondary);
        margin-bottom: 1rem;
        summary {
            padding: 1rem;
            font-weight: bold;
            display: flex;
            align-items: center;
            border-bottom: $block-border;
            > span:first-child {
                color: var(--ks-content-link);
                font-size: $h3-font-size;
                margin-right: 1rem;
            }
            h3 {
                margin-bottom: 0;
                flex-grow: 1;
                color: var(--ks-content-primary);
                font-size: $rem-1 !important;
                font-weight: 700;
                line-height: 24px;
                text-align: left;
            }
            .chevron-up-icon {
                display: none;
            }
        }
        &[open] summary {
            border-bottom: 0;
        }
        &[open] summary .icon {
            .chevron-down-icon {
                display: none;
            }
            .chevron-up-icon {
                display: block;
            }
        }
    }

    h6 {
        font-weight: 700;
        color: var(--bs-black);
    }
</style>