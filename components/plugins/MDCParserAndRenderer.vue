<script lang="ts" setup>
import { getMDCParser, MDCRenderer } from '@kestra-io/ui-libs';
import { onMounted, ref } from 'vue';

const props = defineProps<{
    content: string,
}>()

const proseComponents = {}

// const proseComponents = Object.fromEntries([
//         ...Object.keys(getCurrentInstance()?.appContext.components ?? {})
//             .filter(name => name.startsWith("Prose"))
//             .map(name => name.substring(5).replaceAll(/(.)([A-Z])/g, "$1-$2").toLowerCase())
//             .map(name => [name, "prose-" + name]),
//         ["ChildCard", ContextChildCard],
//         ["ChildTableOfContents", ContextChildTableOfContents]
//     ]);

const docAst = ref<any>();
onMounted(async () => {
        const parse = await getMDCParser();
        docAst.value = await parse(props.content);
});
</script>

<template>
 <MDCRenderer v-if="docAst?.body" :body="docAst.body" :data="docAst.data" :key="content" :components="proseComponents" />
</template>
