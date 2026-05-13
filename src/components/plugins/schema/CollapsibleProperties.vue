<template>
    <Collapsible class="section-collapsible" :title="sectionName" :href="href" @expand="emit('expand')" :initially-expanded="initiallyExpanded || autoExpanded" :no-url-change="noUrlChange">
        <template v-if="Object.keys(properties ?? {}).length > 0" #content>
            <div class="border overflow-hidden">
                <Collapsible
                    class="property"
                    v-for="(property, propertyKey) in sortedAndAggregated(properties)"
                    :key="propertyKey"
                    :title="propertyKey"
                    :href="href + '_' + propertyKey"
                    @expand="autoExpanded = true"
                    :no-url-change
                    :class="sectionClass"
                >
                    <template #right>
                        <PropertyBadges :property="property" :show-dynamic="showDynamic" />
                    </template>
                    <template #content>
                        <PropertyDetail :property="property" :definitions="definitions" :section="sectionName.toLowerCase()">
                            <template #markdown="{content}">
                                <slot :content="content" name="markdown" />
                            </template>
                        </PropertyDetail>
                    </template>
                </Collapsible>
            </div>
        </template>
    </Collapsible>
</template>

<script setup lang="ts">
    import {
        type JSONProperty,
        type JSONSchema,
        aggregateAllOf
    } from "../../../utils/plugins/schema";
    import Collapsible from "./Collapsible.vue";
    import PropertyDetail from "./PropertyDetail.vue";
    import PropertyBadges from "./PropertyBadges.vue";
    import {ref, watch, computed} from "vue";

    const props = withDefaults(defineProps<{
        href?: string,
        sectionName: string,
        properties?: Record<string, JSONProperty>,
        showDynamic?: boolean,
        initiallyExpanded?: boolean,
        forceInclude?: string[],
        noUrlChange?: boolean,
        definitions?: Record<string, JSONSchema>
    }>(), {
        properties: undefined,
        href: Math.random().toString(36).substring(2, 5),
        showDynamic: true,
        initiallyExpanded: false,
        forceInclude: () => [] as string[],
        noUrlChange: false,
        definitions: undefined
    });

    const emit = defineEmits(["expand"]);

    const sectionClass = computed(() => {
        const name = props.sectionName.toLowerCase();
        if (name === "properties") return "section-properties";
        if (name === "outputs") return "section-outputs";
        if (name === "metrics") return "section-metrics";
        return "";
    });

    const autoExpanded = ref(false);

    watch(
        autoExpanded,
        newInitiallyExpanded => {
            if (newInitiallyExpanded) {
                emit("expand");
            }
        }
    );

    function sortedAndAggregated(schema?: Record<string, JSONProperty>): Record<string, JSONProperty> {
        schema = schema ?? {};
        const requiredKeys: string[] = [];
        const nonRequiredKeys: string[] = [];

        for (const key in schema) {
            if (typeof schema[key] === "object") {
                schema[key] = aggregateAllOf(schema[key]);
                if (schema[key].$required) {
                    requiredKeys.push(key);
                } else {
                    nonRequiredKeys.push(key);
                }
            }
        }

        const sortedKeys = [...requiredKeys.sort(), ...nonRequiredKeys.sort()];

        const sortedSchema = {} as Record<string, JSONProperty>;
        sortedKeys.forEach(key => {
            if (!schema[key].$deprecated || props.forceInclude?.includes(key)) {
                sortedSchema[key] = schema[key];
            }
        });

        return sortedSchema;
    }
</script>

<style lang="scss" scoped>
    @use "@kestra-io/ui-libs/src/scss/_variables.scss" as variables;
    @use "@kestra-io/ui-libs/src/scss/_color-palette.scss" as color-palette;

    .border {
        border-radius: .5rem;
    }

    .property {

        &:deep(> button) {
            font-size: 1rem !important;
            line-height: 1.5rem;
        }

        :deep(> .collapse-button) {
            padding: 9px 16px;
            border: 1px solid variables.$black-6;
            border-radius: 12px;
            background-color: variables.$black-9;
        }

        &[open] {
            :deep(> .collapse-button) {
                border-radius: 12px 12px 0 0;
            }
        }

        &:not([open]) {
            :deep(> .collapse-button) {
                margin-bottom: 1rem;
            }
        }

        :deep(> .collapsible-body:not(.collapsed)) {
            padding-top: .75rem;
            padding-bottom: .75rem;
        }

        :deep(.property-detail) {
            border: 1px solid variables.$black-6;
            margin-bottom: 1rem;
            border-radius: 0 0 12px 12px;

            &:first-child {
                border-top: none;
            }
        }

        :deep(.property-detail > *) {
            padding: 1rem 2rem;
        }
    }

    $section-colors: (
        properties: color-palette.$base-blue-300,
        outputs: color-palette.$base-green-300,
        metrics: color-palette.$base-orange-400
    );

    @each $section, $color in $section-colors {
        .section-#{$section} {
            :deep(.collapse-button span:not(.type-box)) {
                font-size: 1rem;
                font-weight: normal;
                font-family: "source code pro", monospace;
            }
        }
    }
</style>
