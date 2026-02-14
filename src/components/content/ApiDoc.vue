<template>
    <rapi-doc
        spec-url="/kestra.yml"
        theme="dark"
        render-style="view"
        show-header="false"
        show-info="false"
        allow-authentication="false"
        allow-server-selection="false"
        allow-try="false"
    />
</template>

<script setup>
    import "rapidoc"
</script>

<style lang="scss" scoped>
    rapi-doc {
        background: transparent;
        width: 100%;
        --font-mono: var(--font-family-jetbrains-mono);
        --font-regular: var(--font-family-public-sans);
        &::part(section-endpoint) {
            white-space: normal;
        }
    }
</style>