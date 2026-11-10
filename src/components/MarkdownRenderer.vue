<template>
    <div
        v-if="htmlContent"
        :key="content"
        class="markdown-renderer"
        v-html="htmlContent"
        @click="handleCopyClick"
    />
    <div v-else-if="parseError" class="parse-error">
        <strong>Markdown parse error:</strong> {{ parseError }}
    </div>
    <div v-else class="skeleton"></div>
</template>

<script lang="ts" setup>
    import { onMounted, ref, watch } from "vue"
    import { getMarked, getPlainMarked } from "~/markdown/marked-shiki"
    import { handleCopyClick, injectCopyButtons } from "~/utils/code-copy"

    const props = defineProps<{
        content: string
        copyable?: boolean
    }>()

    const htmlContent = ref<string>("")
    const parseError = ref<string>("")
    let parseToken = 0

    const decorate = (html: string) =>
        props.copyable ? injectCopyButtons(html) : html

    async function parseContent() {
        const token = ++parseToken
        parseError.value = ""

        if (!props.content) {
            htmlContent.value = ""
            return
        }

        // Plain fences first, so the text is readable without waiting on the
        // highlighter chunk; Shiki then upgrades the same markup in place.
        try {
            htmlContent.value = decorate(
                getPlainMarked().parse(props.content, { async: false }),
            )
        } catch (error) {
            parseError.value = String(error)
            return
        }

        try {
            const html = await getMarked().parse(props.content)
            if (token === parseToken) {
                htmlContent.value = decorate(html)
            }
        } catch {
            // Highlighting is an upgrade, not a precondition: keep the fences.
        }
    }

    onMounted(parseContent)

    watch(() => props.content, parseContent)
</script>

<style scoped lang="scss">
    @keyframes skeleton-loading {
        to {
            background-position: left;
        }
    }
</style>

<style scoped lang="scss">
    @use "/src/assets/styles/markdown-renderer" as markdown;

    .markdown-renderer {
        @include markdown.markdown-renderer;
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

