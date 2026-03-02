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

<script setup>
    import "rapidoc"
</script>

<style lang="scss" scoped>
    rapi-doc {
        background: transparent;
        width: 100%;
        --textarea-height: auto;
        --textarea-min-height: 100px;
        --code-block-max-height: 600px;
        --font-mono: var(--font-family-jetbrains-mono);
        --font-regular: var(--font-family-mono-sans);
        --light-border-color: var(--ks-border-primary);
        --light-green: var(--ks-background-secondary);
        --light-blue: var(--ks-background-secondary);
        --light-orange: var(--ks-background-secondary);
        --light-red: var(--ks-background-secondary);
        --input-bg: var(--ks-background-input);
        --border-color: var(--ks-border-primary);
        --fg: var(--ks-content-primary);
        &::part(section-endpoint) {
            white-space: nowrap;
        }
    }
</style>
