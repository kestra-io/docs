<template>
    <template v-if="htmlContent">
        <div
            ref="containerRef"
            :key="content"
            class="mdc-renderer"
            v-html="htmlContent"
        />
        <template v-for="(code, index) in codeBlocks" :key="index">
            <Teleport v-if="copySlots[index]" :to="copySlots[index]">
                <Copy :code="code" />
            </Teleport>
        </template>
    </template>
    <div v-else-if="parseError" class="parse-error">
        <strong>MDC parse error:</strong> {{ parseError }}
    </div>
    <div v-else class="skeleton"></div>
</template>

<script lang="ts" setup>
    import { nextTick, onMounted, ref, watch } from "vue"
    import { getMarked } from "~/markdown/marked-shiki"
    import Copy from "~/components/common/Copy.vue"

    const props = defineProps<{
        content: string
    }>()

    const htmlContent = ref<string>("")
    const containerRef = ref<HTMLElement | null>(null)
    const codeBlocks = ref<string[]>([])
    const copySlots = ref<HTMLElement[]>([])

    /** Wraps each fenced code block with a `.code-block` shell holding a language label and a copy-slot to teleport a `Copy` component into. */
    function wrapCodeBlocks(html: string): string {
        const container = document.createElement("div")
        container.innerHTML = html

        const blocks: string[] = []

        container.querySelectorAll("pre").forEach((pre) => {
            const code = pre.querySelector("code")
            const lang = code?.className.match(/language-(\S+)/)?.[1]
            const index = blocks.length
            blocks.push(code?.textContent ?? "")

            const wrapper = document.createElement("div")
            wrapper.className = "code-block"

            if (lang && lang !== "text") {
                const label = document.createElement("div")
                label.className = "language"
                label.textContent = lang
                wrapper.appendChild(label)
            }

            const slot = document.createElement("div")
            slot.className = "copy-slot"
            slot.setAttribute("data-copy-slot", String(index))
            wrapper.appendChild(slot)

            pre.replaceWith(wrapper)
            wrapper.appendChild(pre)
        })

        codeBlocks.value = blocks
        return container.innerHTML
    }

    async function parseContent() {
        if (!props.content) {
            throw new Error("No content provided to MDCParserAndRenderer.vue")
        }
        htmlContent.value = wrapCodeBlocks(await getMarked().parse(props.content))
        await nextTick()
        copySlots.value = containerRef.value
            ? Array.from(
                  containerRef.value.querySelectorAll<HTMLElement>(
                      "[data-copy-slot]",
                  ),
              )
            : []
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
        & :deep(.copy-slot) {
            position: absolute;
            top: 1rem;
            right: 1rem;
        }
        & :deep(.copy .btn) {
            border: none;
            background: none;
            color: var(--ks-content-tertiary);
            &:hover {
                color: var(--ks-content-primary);
                border-color: transparent;
            }
            &.copied {
                color: var(--ks-content-link);
                border-color: transparent;
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

