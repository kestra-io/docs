<template>
    <div class="property-detail">
        <PropertyMeta :property="property" :subtype="subtype" :enum-values="enumValues" />

        <div v-if="property.title !== undefined || property.description !== undefined || (depth < maxDepth && referencedDefinitions.length > 0)">
            <div class="property-description markdown">
                <slot v-if="property.title !== undefined" :content="codeSanitizer(property.title)" name="markdown" />
                <slot v-if="property.description !== undefined" :content="codeSanitizer(property.description)" name="markdown" />
                <div v-if="property['$internalStorageURI']">
                    <Alert type="info">
                        <slot content="Pebble expression referencing an Internal Storage URI e.g. `{{ outputs.mytask.uri }}`." name="markdown" />
                    </Alert>
                </div>

                <div v-if="depth < maxDepth && referencedDefinitions.length > 0" class="mt-3">
                    <div class="definitions-header">
                        Definitions
                    </div>
                    <DefinitionCollapsible
                        v-for="def in referencedDefinitions"
                        :key="`${def.key}-${depth}`"
                        :definition="def"
                        :definitions="definitions"
                        :visited-keys="visitedKeysWithCurrent"
                        :depth="depth + 1"
                        :max-depth="maxDepth"
                        :section="section"
                    >
                        <template #markdown="{content}">
                            <slot :content="content" name="markdown" />
                        </template>
                    </DefinitionCollapsible>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import {extractEnumValues, extractTypeInfo, extractReferencedDefinitions, type JSONProperty, type JSONSchema} from "../../../utils/plugins/schema";
    import {sanitizeForMarkdown} from "../../../utils/markdown";
    import {computed} from "vue";
    import Alert from "./Alert.vue";
    import PropertyMeta from "./PropertyMeta.vue";
    import DefinitionCollapsible from "./DefinitionCollapsible.vue";

    const props = withDefaults(defineProps<{
        property: JSONProperty,
        definitions?: Record<string, JSONSchema>,
        visitedKeys?: Set<string>,
        depth?: number,
        maxDepth?: number,
        section?: string
    }>(), {
        definitions: undefined,
        visitedKeys: () => new Set<string>(),
        depth: 0,
        maxDepth: 3,
        section: "properties"
    });

    const subtype = computed(() => extractTypeInfo(props.property).subType);
    const enumValues = computed(() => extractEnumValues(props.property));

    const referencedDefinitions = computed(() => {
        const defs = props.definitions;
        const d = props.depth;
        const max = props.maxDepth;
        const prop = props.property;
        const visited = props.visitedKeys;

        if (!defs || d >= max) return [];
        return extractReferencedDefinitions(prop, defs, visited);
    });

    const visitedKeysWithCurrent = computed(() => {
        const newSet = new Set(props.visitedKeys);
        referencedDefinitions.value.forEach(def => newSet.add(def.key));
        return newSet;
    });

    const codeSanitizer = sanitizeForMarkdown;
</script>

<style lang="scss" scoped>
    .property-detail > * {
        display: flex;
        justify-content: space-between;
        border-top: 1px solid var(--ks-border-primary);
        align-items: center;
        padding: 1rem 0;
        margin: 0;
        gap: var(--spacer);

        span, .property-description:deep(p) {
            line-height: 1.5rem;
            font-size: .875rem !important;
        }

        code {
            color: var(--ks-content-primary);
            background: var(--ks-background-body);
        }

        .border-red {
            border-color: var(--ks-border-alert-danger) !important;
        }

        &:first-child {
            border-top: none !important;
        }

        > * {
            width: fit-content;
        }
    }

    .definitions-header {
        font-weight: 600;
        font-size: 0.875rem;
        margin-bottom: 0.75rem;
        color: var(--ks-content-primary);
    }
</style>
