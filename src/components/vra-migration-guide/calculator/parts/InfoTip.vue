<template>
    <Tooltip
        class="info-tip"
        trigger="click"
        placement="bottom-start"
        content-class="info-panel"
    >
        <template #default="{ visible, panelId }">
            <button
                type="button"
                class="info-button"
                :aria-expanded="visible"
                :aria-controls="panelId"
                :aria-label="`More about ${label}`"
            >
                <InformationOutline :size="16" />
            </button>
        </template>
        <template #content>
            <slot />
        </template>
    </Tooltip>
</template>

<script setup lang="ts">
    import InformationOutline from "vue-material-design-icons/InformationOutline.vue"
    import Tooltip from "~/components/common/Tooltip.vue"

    defineProps<{ label: string }>()
</script>

<style scoped lang="scss">
    @use "/src/components/vra-migration-guide/shared" as *;
    .info-tip {
        display: inline-flex;
        vertical-align: middle;
    }

    .info-button {
        display: inline-flex;
        padding: 0;
        border: 0;
        background: none;
        color: var(--ks-content-tertiary);
        line-height: 1;
        @include guide-focus-ring;

        &:hover,
        &[aria-expanded="true"] {
            color: var(--ks-content-link);
        }
    }
</style>

<style lang="scss">
    @use "/src/components/vra-migration-guide/shared" as *;
    // The panel is rendered by Tooltip, outside this component's scope.
    .ks-tooltip.info-panel {
        max-width: min(18rem, calc(100vw - 2rem));
        padding: 0.6rem 0.75rem;
        border-color: var(--ks-border-primary);
        border-radius: $border-radius;
        box-shadow: $calc-shadow-elevated;
        @include calc-hint;
        font-weight: 400;
        line-height: 1.45;

        a {
            color: var(--ks-content-link);
        }
    }
</style>
