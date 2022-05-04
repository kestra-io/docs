<template>
    <rapi-doc
        spec-url = "/kestra-ee.yml"
        theme="light"
        render-style="view"
        show-header="false"
        show-info="false"
        allow-authentication="false"
        allow-server-selection="false"
        allow-try="false"
        regular-font="Ubuntu"
    />
</template>

<script>
export default {

}
</script>

<style lang="scss">

main.docs {
    width: 100%;
}

rapi-doc {
    background: transparent;
    width: 100%;
}
</style>
