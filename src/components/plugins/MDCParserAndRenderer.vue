<template>
    <MDCRenderer v-if="docAst?.body" :body="docAst.body" :data="docAst.data" :key="content" class="mdc-renderer" />
    <div v-else-if="docAst">No body...</div>
    <div v-else>Loading...</div>
</template>

<script lang="ts" setup>
    import { getMDCParser, MDCRenderer } from "@kestra-io/ui-libs";
    import { onMounted, ref, watch } from "vue";

    const props = defineProps<{
        content: string,
    }>();

    const docAst = ref<any>();

    async function parseContent() {
        const parse = await getMDCParser();
        if (!props.content) {
            throw new Error("No content provided to MDCParserAndRenderer.vue");
        }
        docAst.value = await parse(props.content);
    }

    onMounted(async () => {
        await parseContent();
    })

    watch(() => props.content, async () => {
        await parseContent();
    })

</script>

<style scoped lang="scss">
    .mdc-renderer {
        & :deep(pre) {
            border: 1px solid #252526;
            padding: 1.25rem 1.5rem;
            padding-top: 0;
            border-radius: var(--bs-border-radius-lg);
            background-color: #161617;

            & code .line {
                display: block;
                min-height: 1rem;
                white-space: pre-wrap;
            }
        }
    }
</style>

