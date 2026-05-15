<template>
    <div class="d-flex flex-column gap-6">
        <div class="d-flex flex-column">
            <div class="alert alert-info mb-2" role="alert" v-if="schema.properties?.$beta">
                <p>
                    This plugin is currently in beta. While it is considered safe for use, please be aware that its API
                    could change in ways that are not compatible with earlier versions in future releases, or it might
                    become unsupported.
                </p>
            </div>

            <div v-if="schema.properties?.description" class="markdown">
                <slot name="markdown" :content="schema.properties.description.replace(/ *:(?![ /])/g, ': ')" />
            </div>

            <SchemaToCode :highlighter="highlighter" language="yaml" :theme="codeTheme" :code="`type: ${pluginType}`" :key="pluginType" />
        </div>

        <div class="d-flex flex-column" :key="pluginType">
            <Collapsible class="plugin-section" v-if="examples" title="Examples" href="examples" :no-url-change>
                <template #content>
                    <div class="d-flex flex-column gap-4">
                        <template v-for="(example, index) in examples" :key="pluginType + '-' + index">
                            <div class="d-flex flex-column">
                                <div class="markdown">
                                    <slot v-if="example.title" :content="example.title.replace(/ *:(?![ /])/g, ': ')" name="markdown" />
                                </div>
                                <SchemaToCode
                                    v-if="example.code"
                                    :highlighter="highlighter"
                                    :language="example.lang ?? 'yaml'"
                                    :theme="codeTheme"
                                    :code="generateExampleCode(example)"
                                />
                            </div>
                            <hr class="w-100 align-self-center" v-if="index < examples.length - 1">
                        </template>
                    </div>
                </template>
            </Collapsible>

            <CollapsibleProperties
                v-if="schema.properties?.properties"
                class="plugin-section"
                :properties="schema.properties.properties"
                section-name="Properties"
                href="properties"
                :initially-expanded="propsInitiallyExpanded"
                :force-include="forceIncludeProperties"
                :definitions="schema.definitions"
                :no-url-change
            >
                <template #markdown="{content}">
                    <div class="markdown">
                        <slot name="markdown" :content="content" />
                    </div>
                </template>
            </CollapsibleProperties>

            <CollapsibleProperties
                v-if="hasOutputs"
                class="plugin-section"
                :properties="schema.outputs!.properties"
                section-name="Outputs"
                href="outputs"
                :show-dynamic="false"
                :definitions="schema.definitions"
                :no-url-change
            >
                <template #markdown="{content}">
                    <div class="markdown">
                        <slot name="markdown" :content="content" />
                    </div>
                </template>
            </CollapsibleProperties>

            <CollapsibleProperties
                v-if="schema.properties?.$metrics"
                class="plugin-section"
                :properties="metrics"
                section-name="Metrics"
                href="metrics"
                :show-dynamic="false"
                :definitions="schema.definitions"
                :no-url-change
            >
                <template #markdown="{content}">
                    <div class="markdown">
                        <slot name="markdown" :content="content" />
                    </div>
                </template>
            </CollapsibleProperties>
        </div>
    </div>
</template>

<script setup lang="ts">
    import {computed, onMounted, onUnmounted, provide, ref} from "vue";
    import type {HighlighterCore} from "shiki/core";
    import SchemaToCode from "./SchemaToCode.vue";
    import type {JSONProperty, JSONSchema} from "../../../utils/plugins/schema";
    import Collapsible from "./Collapsible.vue";
    import CollapsibleProperties from "./CollapsibleProperties.vue";

    const props = withDefaults(defineProps<{
        schema: JSONSchema,
        pluginType: string,
        darkMode?: boolean,
        propsInitiallyExpanded?: boolean,
        forceIncludeProperties?: string[],
        noUrlChange?: boolean
    }>(), {
        darkMode: true,
        propsInitiallyExpanded: false,
        forceIncludeProperties: () => [],
        noUrlChange: false
    });

    const generateExampleCode = (example: NonNullable<NonNullable<JSONSchema["properties"]>["$examples"]>[number]) => {
        if (example?.full) return example.code;
        const pluginId = props.pluginType.split(".").reverse()[0]?.toLowerCase();
        return `id: ${pluginId}\ntype: ${props.pluginType}\n${example.code}`;
    };

    const highlighter = ref<HighlighterCore | undefined>();

    const isDark = ref(props.darkMode);
    let observer: MutationObserver | undefined;

    onMounted(() => {
        isDark.value = document.documentElement.classList.contains("dark");
        observer = new MutationObserver(() => {
            isDark.value = document.documentElement.classList.contains("dark");
        });
        observer.observe(document.documentElement, {attributes: true, attributeFilter: ["class"]});
    });

    onUnmounted(() => {
        observer?.disconnect();
    });

    const codeTheme = computed(() => isDark.value ? "github-dark-default" : "github-light-default");

    provide("highlighter", highlighter);
    provide("codeTheme", codeTheme);

    const examples = computed(() => props.schema.properties?.$examples);
    const hasOutputs = computed(() => !!props.schema.outputs?.properties && Object.keys(props.schema.outputs.properties).length > 0);

    const metrics = computed((): Record<string, JSONProperty> =>
        Object.fromEntries(
            (props.schema.properties?.$metrics ?? []).map(
                metric => [metric.name, {...metric, name: undefined}] as [string, JSONProperty]
            )
        )
    );

    const {getHighlighterCore} = await import("./shikiToolset");

    highlighter.value = await getHighlighterCore();
</script>

<style scoped lang="scss">
    .plugin-title :deep(p) {
        font-size: 1rem;
        margin: 1rem 0;
    }

    :deep(.markdown) {

        pre,
        .code-block {
            margin: 0;
        }

        >ol,
        >ul,
        >dl {
            margin-top: 0;
            margin-bottom: 0;
        }
    }

    :deep(.plugin-section) {
        border-bottom: 1px solid var(--ks-border-primary);
        padding: 2rem 0;

        &:first-child {
            border-top: 1px solid var(--ks-border-primary);
        }

        &:last-child {
            border-bottom: none;
            padding-bottom: 0;
        }

        .material-design-icon > .material-design-icon__svg {
            height: 1.35rem;
            width: 1.35rem;
        }

        .material-design-icon:not(.text-danger):not(.text-info):not(.text-warning):not(.text-success):not(.text-primary):not(.text-secondary) {
            &,
            & * {
                height: 1.5rem;
                width: 1.5rem;
                bottom: 0;
                color: var(--ks-content-secondary) !important;
            }
        }

        .material-design-icon:not(.property .material-design-icon):not(.text-danger):not(.text-info):not(.text-warning):not(.text-success):not(.text-primary):not(.text-secondary) {
            &,
            & * {
                height: 1.5rem;
                width: 1.5rem;
                color: var(--ks-content-tertiary) !important;
            }
        }
    }
</style>
