<template>
    <div
        v-if="htmlContent"
        :key="content"
        class="mdc-renderer"
        v-html="htmlContent"
        @click="handleCopyClick"
    />
    <div v-else-if="parseError" class="parse-error">
        <strong>MDC parse error:</strong> {{ parseError }}
    </div>
    <div v-else class="skeleton"></div>
</template>

<script lang="ts" setup>
    import { onMounted, ref, watch } from "vue"
    import { getMarked } from "~/markdown/marked-shiki"
    import { handleCopyClick, injectCopyButtons } from "~/utils/code-copy"

    const props = defineProps<{
        content: string
        copyable?: boolean
    }>()

    const htmlContent = ref<string>("")

    async function parseContent() {
        if (!props.content) {
            throw new Error("No content provided to MDCParserAndRenderer.vue")
        }
        const html = await getMarked().parse(props.content)
        htmlContent.value = props.copyable ? injectCopyButtons(html) : html
    }

    onMounted(async () => {
        await parseContent()
    })

    watch(
        () => props.content,
        async () => {
            await parseContent()
        },
    )
</script>

<style scoped lang="scss">
    @keyframes skeleton-loading {
        to {
            background-position: left;
        }
    }
</style>

<style scoped lang="scss">
    @use "/src/assets/styles/mdc-renderer" as mdc;

    .mdc-renderer {
        @include mdc.mdc-renderer;
    }

    @keyframes pulse {
        0% {
            background-position: 0 0;
        }
        100% {
            background-position: 40px 40px;
        }
    }

    .parse-error {
        background: #fee;
        border: 1px solid #f88;
        border-radius: 0.5rem;
        padding: 1rem;
        color: #c00;
        font-size: 0.875rem;
    }

    .skeleton {
        display: inline-block;
        position: relative;
        overflow: hidden;
        background-color: var(--ks-background-secondary);
        height: calc($line-height-base * 1rem);
        border-radius: $border-radius-lg;
        &::after {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            transform: translateX(-100%);
            background-image: linear-gradient(
                90deg,
                rgba(var(--ks-background-secondary), 0) 0,
                rgba(var(--ks-background-secondary), 0.2) 20%,
                rgba(var(--ks-background-secondary), 0.5) 60%,
                rgba(var(--ks-background-secondary), 0)
            );
            animation: shimmer 1.5s infinite;
            content: "";
        }
        @keyframes shimmer {
            100% {
                transform: translateX(100%);
            }
        }
    }
</style>

<!-- Shiki dual-theme: token colors apply inline (light); switch to the dark
     theme via the per-token `--shiki-dark` CSS variable when `.dark` is set on
     <html>. Not scoped so it reaches the v-html output; namespaced under
     .mdc-renderer to avoid leaks. -->
<style lang="scss">
    html.dark .mdc-renderer pre code span {
        color: var(--shiki-dark) !important;
    }
</style>

