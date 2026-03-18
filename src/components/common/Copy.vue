<template>
    <div class="copy">
        <button
            class="btn"
            :class="{ 'copied': isCopied }"
            @click="handleCopy"
            :title="isCopied ? 'Copied!' : 'Copy to clipboard'"
        >
            <component :is="isCopied ? Check : ContentCopy" class="icon" />
        </button>
    </div>
</template>

<script setup lang="ts">
    import { ref } from "vue"
    import ContentCopy from "vue-material-design-icons/ContentCopy.vue"
    import Check from "vue-material-design-icons/Check.vue"

    const props = defineProps<{
        code: string
    }>()

    const isCopied = ref(false)

    const handleCopy = async () => {
        if (!navigator?.clipboard || !props.code) return

        try {
            await navigator.clipboard.writeText(props.code)
            isCopied.value = true
            setTimeout(() => (isCopied.value = false), 2000)
        } catch (err) {
            console.error("Failed to copy text: ", err)
        }
    }
</script>

<style lang="scss" scoped>


    .copy {
        display: inline-flex;

        .btn {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0.4rem;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.2s ease;
            border: $block-border;
            color: var(--ks-content-tertiary);

            &:hover {
                color: var(--ks-content-primary);
                border-color: var(--ks-border-active);
            }

            &.copied {
                color: var(--ks-content-link);
                border-color: var(--ks-content-link);
            }

            .icon {
                display: flex;

                :deep(svg) {
                    width: 18px;
                    height: 18px;
                }
            }
        }
    }
</style>