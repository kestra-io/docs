<template>
    <rapi-doc
        spec-url="/kestra-ee.yml"
        theme="dark"
        render-style="view"
        show-header="false"
        show-info="false"
        allow-authentication="false"
        allow-server-selection="false"
        allow-try="false"
    />
</template>

<script lang="ts" setup>
    import "rapidoc"
</script>

<style lang="scss" scoped>
    rapi-doc {
        background: transparent;
        width: 100%;
        --textarea-height: auto;
        --textarea-min-height: 100px;
        --code-block-max-height: 600px;
        --font-mono: var(--font-family-source-code-pro);
        --font-regular: var(--font-family-public-sans);

        &::part(section-endpoint) {
            white-space: nowrap;
        }
    }
</style>