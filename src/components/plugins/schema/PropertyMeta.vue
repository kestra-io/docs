<template>
    <div v-if="subtype && !subtype.startsWith('#')">
        <span>SubType</span>
        <span class="type-box rounded fs-7 px-2 py-1">{{ subtype }}</span>
    </div>

    <div v-if="property.default !== undefined">
        <span>Default</span>
        <code class="border rounded px-2 py-1">{{ property.default }}</code>
    </div>

    <div v-if="property.pattern !== undefined">
        <span>Validation RegExp</span>
        <code class="border rounded px-2 py-1">{{ property.pattern }}</code>
    </div>

    <div v-if="property.unit !== undefined && property.unit.trim().length > 0">
        <span>Unit</span>
        <code class="border rounded px-2 py-1">{{ property.unit }}</code>
    </div>

    <div v-if="property.minLength !== undefined">
        <span>Min length</span>
        <code class="border rounded px-2 py-1">{{ property.minLength }}</code>
    </div>

    <div v-if="property.maxLength !== undefined">
        <span>Max length</span>
        <code class="border rounded px-2 py-1">{{ property.maxLength }}</code>
    </div>

    <div v-if="property.minItems !== undefined">
        <span>Min items</span>
        <code class="border rounded px-2 py-1">{{ property.minItems }}</code>
    </div>

    <div v-if="property.maxItems !== undefined">
        <span>Max items</span>
        <code class="border rounded px-2 py-1">{{ property.maxItems }}</code>
    </div>

    <div v-if="property.minimum !== undefined">
        <span>Minimum</span>
        <code class="border rounded px-2 py-1">&gt;= {{ property.minimum }}</code>
    </div>

    <div v-if="property.exclusiveMinimum !== undefined">
        <span>Minimum</span>
        <code class="border rounded px-2 py-1">&gt; {{ property.minimum }}</code>
    </div>

    <div v-if="property.maximum !== undefined">
        <span>Maximum</span>
        <code class="border rounded px-2 py-1">&lt;= {{ property.maximum }}</code>
    </div>

    <div v-if="property.exclusiveMaximum !== undefined">
        <span>Maximum</span>
        <code class="border rounded px-2 py-1">&lt; {{ property.maximum }}</code>
    </div>

    <div v-if="property.format !== undefined">
        <span>Format</span>
        <code class="border rounded px-2 py-1">{{ property.format }}</code>
    </div>

    <div v-if="enumValues !== undefined">
        <span>Possible Values</span>
        <div class="values-wrapper d-flex flex-wrap justify-content-end gap-7 p-0">
            <code v-for="(possibleValue, index) in enumValues" class="border rounded px-2 py-1" :key="index">
                {{ possibleValue }}
            </code>
        </div>
    </div>
</template>

<script setup lang="ts">
    import type {JSONProperty} from "../../../utils/plugins/schema";

    defineProps<{
        property: JSONProperty,
        subtype?: string,
        enumValues?: string[]
    }>();
</script>

<style lang="scss" scoped>
    @use "/src/assets/styles/legacy/_color-palette.scss" as color-palette;

    div {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: var(--spacer);
        padding: 9px 0;
        padding-bottom: 0;

        span {
            line-height: 1.5rem;
            font-size: .875rem !important;
            color: var(--ks-content-secondary) !important;
        }

        code {
            color: var(--ks-content-primary);
            background: var(--ks-background-body);
        }

        .border-red {
            border-color: color-palette.$base-red-400 !important;
        }

        &:first-child {
            border-top: none !important;
        }

        > * {
            width: fit-content;
        }
    }

    .type-box {
        font-size: 12px !important;
        line-height: 20px;
        padding: 0 10px !important;
        padding-bottom: 2px;
        border-radius: 40px !important;
        text-transform: capitalize;
        border: 1px solid;
    }

    .values-wrapper {
        display: flex !important;
        justify-content: flex-end !important;
        border: none !important;
        margin: 0 !important;
        padding: 0 !important;
        align-items: unset !important;
    }
</style>
