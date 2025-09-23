<template>
    <div class="bd-content" v-if="page">
        <FeatureScopeMarker v-if="page.editions || page.version || page.deprecated || page.release"
                                :page="page"/>
        <PluginIndex v-if="pluginType === undefined"
                    class="plugin-index"
                    :icons="icons"
                    :plugins="pluginsWithoutDeprecated"
                    :plugin-name="pluginName"
                    :sub-group="subGroup"
                    :routePath="`/plugins/${pluginType ?? ''}`"
        >
            <template v-slot:markdown="{ content }">
                <h1 class="mb-4">INDEX</h1>
                <pre>{{ page?.body }}</pre>
                <MDCRenderer v-if="docAst?.body" :body="content" :data="docAst.data" :key="docAst" :components="proseComponents" />
            </template>
        </PluginIndex>
        <Suspense v-else>
            <SchemaToHtml v-if="page.body.jsonSchema" class="plugin-schema" :schema="page.body.jsonSchema" :plugin-type="pluginType ?? ''"
                    :props-initially-expanded="true">
                <template #markdown="{ content }">
                    <MDCRenderer v-if="docAst?.body" :body="content" :data="docAst.data" :key="docAst" :components="proseComponents" />
                </template>
            </SchemaToHtml>
        </Suspense>
    </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { getMDCParser, MDCRenderer, PluginIndex, SchemaToHtml } from '@kestra-io/ui-libs';
import { getPluginsWithoutDeprecated } from '../../src/utils/plugins/getListOfPlugins';
import FeatureScopeMarker from '../docs/FeatureScopeMarker.vue';

const props = withDefaults(defineProps<{
    page: any,
    pluginType?: string,
    icons?: Record<string, string>,
    plugins?: any[],
    pluginName?: string,
    subGroup?: string
}>(), {
    icons: () => ({}),
    plugins: () => [],
    pluginName: undefined,
    subGroup: undefined
});

const docAst = ref<any>();
onMounted(async () => {
    if (props.page?.body?.mdc) {
        const parse = await getMDCParser();
        docAst.value = await parse(props.page.body.mdc);
    }
});

const pluginsWithoutDeprecated = computed(() => getPluginsWithoutDeprecated(props.plugins || []) as any[]);

const proseComponents = {}

// const proseComponents = Object.fromEntries([
//         ...Object.keys(getCurrentInstance()?.appContext.components ?? {})
//             .filter(name => name.startsWith("Prose"))
//             .map(name => name.substring(5).replaceAll(/(.)([A-Z])/g, "$1-$2").toLowerCase())
//             .map(name => [name, "prose-" + name]),
//         ["a", ContextDocsLink],
//         ["ChildCard", ContextChildCard],
//         ["ChildTableOfContents", ContextChildTableOfContents]
//     ]);
</script>