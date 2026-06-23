<template>
    <MDCRenderer
        v-if="docAst?.body"
        :body="docAst.body"
        :data="docAst.data"
        :key="content"
        class="mdc-renderer"
    />
    <div v-else-if="parseError" class="parse-error">
        <strong>MDC parse error:</strong> {{ parseError }}
    </div>
    <div v-else class="skeleton"></div>
</template>

<script lang="ts" setup>
    import { getMDCParser, MDCRenderer } from "@kestra-io/ui-libs"
    import { onMounted, ref, watch } from "vue"

    const props = defineProps<{
        content: string
    }>()

    const docAst = ref<any>()
    const parseError = ref<string>()

    async function parseContent() {
        try {
            const parse = await getMDCParser()
            if (!props.content) {
                throw new Error("No content provided to MDCParserAndRenderer.vue")
            }
            const result = await parse(props.content)
            if (!result?.body) {
                parseError.value = `Parser returned empty body. AST keys: ${Object.keys(result ?? {}).join(", ")}`
                console.error("[MDCParserAndRenderer] empty body:", result)
            } else {
                docAst.value = result
            }
        } catch (e: any) {
            parseError.value = e?.message ?? String(e)
            console.error("[MDCParserAndRenderer] parse failed:", e)
        }
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

