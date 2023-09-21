<template>
<div class="mt-5">
    <h3>About this blueprint</h3>
    <div class="title">
        <p>{{ page.title }}</p>
    </div>

    <div class="markdown" v-html="description"></div>
</div>
</template>

<script>
import markdownIt from 'markdown-it'
export default {
    props: {
        page: {
            type: Object,
            required: true
        },
    },
    computed: {
        description() {
            return markdownIt().render(this.page.description)
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

:deep(pre) {
    background: #24292e;
    color: #e1e4e8;
    padding: 1.25rem 1.5rem;
    border-radius: 0.5rem;
}
</style>