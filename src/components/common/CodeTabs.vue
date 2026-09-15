<template>
    <div class="code-tabs">
        <div class="tab-bar">
            <button
                v-for="tab in tabs"
                :key="tab.label"
                class="tab-btn"
                :class="{ active: active === tab.label }"
                @click="select(tab.label)"
            >
                {{ tab.label }}
            </button>
            <button class="copy-btn" :class="{ copied }" @click="copy(currentCode)" aria-label="Copy code">
                <Check v-if="copied" />
                <ContentCopy v-else />
            </button>
        </div>
        <div
            v-for="tab in tabs"
            :key="tab.label"
            v-show="active === tab.label"
            class="tab-code"
        >
            <div class="tab-pre" v-html="highlightedMap[tab.label] ?? fallback(tab.code)"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, computed, onMounted } from "vue"
    import ContentCopy from "vue-material-design-icons/ContentCopy.vue"
    import Check from "vue-material-design-icons/Check.vue"

    const props = withDefaults(
        defineProps<{
            tabs: { label: string; code: string }[]
            storageKey?: string
            lang?: string
        }>(),
        { storageKey: "code-tab-preference", lang: "bash" },
    )

    const active = ref(props.tabs[0]?.label ?? "")
    const copied = ref(false)
    const highlightedMap = ref<Record<string, string>>({})

    const currentCode = computed(() => props.tabs.find((t) => t.label === active.value)?.code ?? "")

    onMounted(async () => {
        try {
            const saved = localStorage.getItem(props.storageKey)
            if (saved && props.tabs.some((t) => t.label === saved)) {
                active.value = saved
            }
        } catch {}

        try {
            const { codeToHtml } = await import("shiki")
            const map: Record<string, string> = {}
            for (const tab of props.tabs) {
                map[tab.label] = await codeToHtml(tab.code, {
                    lang: props.lang,
                    themes: {
                        light: "github-light-default",
                        dark: "github-dark-default",
                    },
                    defaultColor: false,
                })
            }
            highlightedMap.value = map
        } catch {}
    })

    const select = (label: string) => {
        active.value = label
        try {
            localStorage.setItem(props.storageKey, label)
        } catch {}
    }

    const copy = async (code: string) => {
        await navigator.clipboard.writeText(code)
        copied.value = true
        setTimeout(() => {
            copied.value = false
        }, 2000)
    }

    function fallback(code: string): string {
        return `<pre class="shiki-fallback"><code>${code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>`
    }
</script>

<style lang="scss" scoped>
    .code-tabs {
        margin-bottom: 1em;
    }

    .tab-bar {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 0.75rem 0;
        background-color: var(--ks-background-secondary);
        border: $block-border;
        border-bottom: none;
        border-radius: $border-radius-lg $border-radius-lg 0 0;
    }

    .tab-btn {
        background: var(--ks-background-primary);
        border: $block-border;
        border-bottom: none;
        border-radius: $border-radius $border-radius 0 0;
        padding: 0.375rem 1rem;
        font-size: $font-size-sm;
        font-family: $font-family-sans-serif;
        color: var(--ks-content-secondary);
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
            color: var(--ks-content-primary);
        }

        &.active {
            background: var(--ks-background-button-primary);
            color: #fff;
            border-color: var(--ks-background-button-primary);
            border-bottom-color: var(--ks-background-secondary);
            box-shadow: 0 4px 10px rgba(99, 27, 255, 0.25);
            font-weight: 600;
        }
    }

    .tab-code {
        position: relative;
    }

    .tab-pre {
        border: $block-border;
        border-top: none;
        border-radius: 0 0 $border-radius-lg $border-radius-lg;
        overflow-x: auto;

        :deep(.shiki),
        :deep(.shiki-fallback) {
            background-color: var(--ks-background-secondary) !important;
            padding: 1.25rem 1.5rem;
            margin: 0;
            border-radius: 0 0 $border-radius-lg $border-radius-lg;

            code {
                border: none;
                background: transparent;
                white-space: pre-wrap;
                font-family: $font-family-monospace;
                font-size: $font-size-sm;
                color: var(--ks-content-primary);
            }
        }
    }

    .copy-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: auto;
        flex-shrink: 0;
        width: 2rem;
        height: 2rem;
        padding: 0;
        border: 1px solid var(--ks-border-secondary);
        border-radius: 0.2rem;
        background: var(--ks-background-primary);
        color: var(--ks-content-tertiary);
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
            color: var(--ks-content-primary);
        }

        &.copied {
            color: var(--ks-content-primary);
        }

        :deep(.material-design-icon),
        :deep(.material-design-icon *) {
            height: 1.125rem;
            width: 1.125rem;
        }
    }
</style>

<style>
    html.dark .code-tabs .shiki span { color: var(--shiki-dark) !important; }
</style>
