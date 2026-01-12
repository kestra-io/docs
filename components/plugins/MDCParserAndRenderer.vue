<template>
    <MDCRenderer v-if="docAst?.body" :body="docAst.body" :data="docAst.data" :key="content" />
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

