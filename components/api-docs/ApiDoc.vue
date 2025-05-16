<template>
    <ApiReference :configuration="configuration" />
</template>

<script setup lang="ts">
    import { ApiReference } from '@scalar/api-reference'
    import type {AnyApiReferenceConfiguration} from "@scalar/types";

    const props = defineProps<{
        openApiUrl: string;
    }>();

    const configuration: AnyApiReferenceConfiguration = {
        url: props.openApiUrl.startsWith("/") ? props.openApiUrl : `/${props.openApiUrl}`,
        forceDarkModeState: "dark",
        hideTestRequestButton: true,
        hideDarkModeToggle: true,
        hideClientButton: true,
        showSidebar: true,
    }
</script>

<style lang="scss" scoped>
    @use '@scalar/api-reference/style.css' as *;

    :deep(.references-navigation) {
        width: var(--refs-sidebar-width);
        position: fixed;
    }
</style>