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
                <MDCRenderer :value="content">
                    <template #default="mdcProps">
                        <pre v-if="mdcProps.error" style="color: white;">{{ mdcProps.error }}</pre>
                        <ContentRenderer v-else class="markdown" :value="mdcProps?.body"/>
                    </template>
                </MDCRenderer>
            </template>
        </PluginIndex>
        <Suspense v-else>
            <SchemaToHtml v-if="page.body.jsonSchema" class="plugin-schema" :schema="page.body.jsonSchema" :plugin-type="pluginType ?? ''"
                    :props-initially-expanded="true">
                <template #markdown="{ content }">
                    <MDCRenderer :value="content">
                        <template #default="mdcProps">
                            <pre v-if="mdcProps.error" style="color: white;">{{ mdcProps.error }}</pre>
                            <ContentRenderer v-else class="markdown" :value="mdcProps?.body"/>
                        </template>
                    </MDCRenderer>
                </template>
            </SchemaToHtml>
        </Suspense>
    </div>
</template>

<script lang="ts" setup>
import { MDCRenderer, PluginIndex, SchemaToHtml } from '@kestra-io/ui-libs';
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

const pluginsWithoutDeprecated = getPluginsWithoutDeprecated(props.plugins || []);
</script>