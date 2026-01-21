<template>
    <Alert :type="type">
        <slot />
    </Alert>
</template>

<script lang="ts" setup>
    import Alert from "@kestra-io/ui-libs/src/components/content/Alert.vue";
    
    defineProps<{
        type: InstanceType<typeof Alert>["$props"]["type"];
    }>();
</script>

<style lang="scss" scoped>
.doc-alert {
    padding-bottom: 2px !important;

    :deep(p) {
        font-size: 1rem;
        color: inherit;
    }
}
</style>