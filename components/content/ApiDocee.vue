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
        regular-font="Public Sans"
        mono-font="Source Code Pro"
    />
</template>

<script setup lang="ts">
    useHead({
        script: [
            {
                src: 'https://unpkg.com/rapidoc/dist/rapidoc-min.js',
                type: 'module',
                tagPosition: 'head'
            }
        ]
    })
</script>

<style lang="scss" scoped>
    rapi-doc {
        background: transparent;
        width: 100%;
    }

</style>
