<template>
    <ClientOnly>
        <rapi-doc
            spec-url="/kestra.yml"
            theme="dark"
            render-style="view"
            show-header="false"
            show-info="false"
            allow-authentication="false"
            allow-server-selection="false"
            allow-try="false"
            regular-font="Public Sans"
            mono-font="Source Code Pro"
        />
    </ClientOnly>
</template>

<script setup>
    if (import.meta.client) {
        import("rapidoc");
    }
</script>

<style lang="scss" scoped>
    rapi-doc {
        background: transparent;
        width: 100%;
    }
</style>
