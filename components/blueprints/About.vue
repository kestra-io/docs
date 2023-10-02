<template>
<div class="mt-5">
    <h3>About this blueprint</h3>
    <div class="title">
        <p>{{ page.title }}</p>
    </div>

    <ContentRendererMarkdown
        class="bd-markdown"
        :value="description"
    />
</div>
</template>

<script>
export default {
    props: {
        page: {
            type: Object,
            required: true
        },
        description: {
            type: Object,
            required: true
        }
    }
}
</script>

<style scoped lang="scss">
@import "../../assets/styles/variable";
div.title {
    margin: 0 auto calc($spacer / 2);

    p {
        font-size: $font-size-xl;
        color: var(--bs-pink);
        font-weight: 700;
        text-transform: uppercase;
        font-family: var(--bs-font-monospace);
        display: inline;
    }
}
</style>