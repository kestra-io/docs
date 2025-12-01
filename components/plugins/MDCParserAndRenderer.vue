<script lang="ts" setup>
import { getMDCParser, MDCRenderer } from '@kestra-io/ui-libs';
import { ref } from 'vue';

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
async function parseContent() {
    const parse = await getMDCParser();
    docAst.value = await parse(props.content);
}
parseContent();
</script>

<template>
   <MDCRenderer v-if="docAst?.body" :body="docAst.body" :data="docAst.data" :key="content" :components="proseComponents" />
   <div v-else-if="docAst">No body...</div>
   <div v-else>Loading...</div>
</template>
