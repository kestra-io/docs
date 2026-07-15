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

    const props = defineProps<{
        content: string
    }>()

    const htmlContent = ref<string>("")

    const COPY_ICON =
        "<svg viewBox=\"0 0 24 24\" class=\"icon-copy\"><path fill=\"currentColor\" d=\"M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z\" /></svg>"
    const CHECK_ICON =
        "<svg viewBox=\"0 0 24 24\" class=\"icon-check\"><path fill=\"currentColor\" d=\"M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z\" /></svg>"

    /** Wraps each fenced code block with a `.code-block` shell holding a language label and copy button. */
    function wrapCodeBlocks(html: string): string {
        const container = document.createElement("div")
        container.innerHTML = html

        container.querySelectorAll("pre").forEach((pre) => {
            const code = pre.querySelector("code")
            const lang = code?.className.match(/language-(\S+)/)?.[1]

            const wrapper = document.createElement("div")
            wrapper.className = "code-block"

            if (lang && lang !== "text") {
                const label = document.createElement("div")
                label.className = "language"
                label.textContent = lang
                wrapper.appendChild(label)
            }

            const button = document.createElement("button")
            button.type = "button"
            button.className = "copy"
            button.title = "Copy to clipboard"
            button.innerHTML = COPY_ICON + CHECK_ICON
            wrapper.appendChild(button)

            pre.replaceWith(wrapper)
            wrapper.appendChild(pre)
        })

        return container.innerHTML
    }

    async function handleCopyClick(event: MouseEvent) {
        const button = (event.target as HTMLElement).closest(
            "button.copy",
        ) as HTMLButtonElement | null
        if (!button) return

        const code = button.parentElement?.querySelector("pre code")
        if (!code?.textContent) return

        await navigator.clipboard.writeText(code.textContent)
        button.classList.add("copied")
        setTimeout(() => button.classList.remove("copied"), 2000)
    }

    async function parseContent() {
        if (!props.content) {
            throw new Error("No content provided to MDCParserAndRenderer.vue")
        }
        htmlContent.value = wrapCodeBlocks(await getMarked().parse(props.content))
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


    .mdc-renderer {
        & :deep(.code-block) {
            position: relative;
            padding: 1.25rem;
            border-radius: var(--bs-border-radius-lg);
        }
        & :deep(.language) {
            position: absolute;
            top: 1.25rem;
            right: 1.25rem;
            font-size: 0.75rem;
            color: var(--ks-content-tertiary);
        }
        & :deep(button.copy) {
            position: absolute;
            top: 1rem;
            right: 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0.4rem;
            border: none;
            background: none;
            border-radius: 4px;
            cursor: pointer;
            color: var(--ks-content-tertiary);
            &:hover {
                color: var(--ks-content-primary);
            }
            svg {
                width: 1.125rem;
                height: 1.125rem;
            }
            .icon-check {
                display: none;
            }
            &.copied {
                color: var(--ks-content-link);
                .icon-copy {
                    display: none;
                }
                .icon-check {
                    display: block;
                }
            }
        }
        & :deep(pre) {
            padding: 1rem;
            padding-bottom: 0;
            margin-bottom: 0;
            & code{
                border: none;
                background: transparent;
                padding: 0;
                .line {
                    min-height: 1rem;
                    white-space: pre-wrap;
                }
            }
        }
        :deep(h3) {
            padding: 0;
        }
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

