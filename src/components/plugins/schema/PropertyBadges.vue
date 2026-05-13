<template>
    <span class="d-flex flex-grow-1 align-items-center justify-content-between">
        <span class="d-flex gap-2 flex-wrap align-items-center" :class="sectionClass">
            <Tooltip v-if="property && property['$required']" class="d-flex align-items-center" title="Required">
                <span class="text-danger">*</span>
            </Tooltip>
            <Tooltip v-if="showDynamic && property && !isDynamic(property)" class="d-flex" title="Non-dynamic">
                <Snowflake class="text-info" />
            </Tooltip>
            <Tooltip v-if="property && property['$beta']" class="d-flex" title="Beta">
                <AlphaBBox class="text-warning" />
            </Tooltip>
            <Tooltip v-if="property && property['$deprecated']" class="d-flex" title="Deprecated">
                <Alert class="text-warning" />
            </Tooltip>
        </span>
        <span v-if="property" class="d-flex gap-2 flex-wrap align-items-center">
            <span v-for="type in getBaseTypes(property)" :key="type" class="type-box rounded fs-7 px-2 py-1">
                {{ type }}
            </span>
        </span>
    </span>
</template>

<script setup lang="ts">
    import {
        extractTypeInfo,
        type JSONProperty,
        isDynamic
    } from "../../../utils/plugins/schema";
    import Tooltip from "./Tooltip.vue";
    import Alert from "vue-material-design-icons/Alert.vue";
    import Snowflake from "vue-material-design-icons/Snowflake.vue";
    import AlphaBBox from "vue-material-design-icons/AlphaBBox.vue";

    withDefaults(defineProps<{
        property: JSONProperty,
        showDynamic?: boolean,
        sectionClass?: string
    }>(), {
        showDynamic: true,
        sectionClass: ""
    });

    function getBaseTypes(property: JSONProperty): string[] {
        const typeInfo = extractTypeInfo(property);
        return typeInfo.types.filter(type => !type.startsWith("#"));
    }
</script>

<style lang="scss" scoped>
    .type-box {
        font-size: 12px !important;
        line-height: 20px;
        padding: 0 10px !important;
        padding-bottom: 2px;
        border-radius: 40px !important;
        text-transform: capitalize;
        border: 1px solid;
    }
</style>
