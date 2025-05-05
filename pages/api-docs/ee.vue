<template>
    <ApiReference :configuration="configuration" />
</template>

<script setup lang="ts">
    import { ApiReference, type ApiReferenceConfiguration } from '@scalar/api-reference'

    const configuration: ApiReferenceConfiguration = {
        url: "/kestra-ee.yml",
        forceDarkModeState: "dark",
        hideTestRequestButton: true,
        hideDarkModeToggle: true,
        hideClientButton: true,
    }
</script>

<style lang="scss" scoped>
    @use '@scalar/api-reference/style.css' as *;
</style>
