<template>
    <ClientOnly>
        <rapi-doc
            spec-url="/kestra-ee.yml"
            theme="dark"
            render-style="view"
            show-header="false"
            show-info="false"
            allow-authentication="false"
            allow-server-selection="false"
            allow-try="false"
            regular-font="Mona Sans"
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
        --textarea-height: auto;
        --textarea-min-height: 100px;
        --code-block-max-height: 600px;

        &::part(section-endpoint) {
            white-space: nowrap;
        }
    }
</style>
