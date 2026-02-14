<template>
    <MDCRenderer
        v-if="docAst?.body"
        :body="docAst.body"
        :data="docAst.data"
        :key="content"
        class="mdc-renderer"
    />
    <div v-else class="skeleton"></div>
</template>

<script lang="ts" setup>
    import { getMDCParser, MDCRenderer } from "@kestra-io/ui-libs"
    import { onMounted, ref, watch } from "vue"

    const props = defineProps<{
        content: string
    }>()

    const docAst = ref<any>()

    async function parseContent() {
        const parse = await getMDCParser()
        if (!props.content) {
            throw new Error("No content provided to MDCParserAndRenderer.vue")
        }
        docAst.value = await parse(props.content)
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
    @import "~/assets/styles/variable";

    .mdc-renderer {
        & :deep(pre) {
            padding: 0.5rem 1.25rem 1.25rem;
            border-radius: $border-radius-lg;
            background-color: var(--ks-background-secondary);
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
        :deep(p) {
            margin-bottom: 0;
            line-height: normal;
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