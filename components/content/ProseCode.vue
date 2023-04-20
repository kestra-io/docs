<script>
    import {defineComponent} from "#imports";

    export default defineComponent({
        props: {
            code: {
                type: String,
                default: ""
            },
            language: {
                type: String,
                default: null
            },
            filename: {
                type: String,
                default: null
            },
            highlights: {
                type: Array,
                default: () => []
            },
            meta: {
                type: String,
                default: null
            }
        }
    });
</script>

<template>
    <div class="code-block mb-3">
        <div class="language" v-if="language">{{ language }}</div>
        <slot />
    </div>
</template>

<style lang="scss" scoped>
    @import "../../assets/styles/_variable.scss";

    .code-block {
        background-color: $purple-20;
        padding: 1.25rem 1.5rem;
        border-radius: var(--bs-border-radius-lg);
        color: var(--bs-white);
        position: relative;

        .language {
            position: absolute;
            right: 0.75rem;
            top: 0.25rem;
            color: var(--bs-gray-600);
            font-size: calc($font-size-base * .75);
        }

        :deep(pre) {
            margin-bottom: 0;
        }
    }

    :deep(pre code .line) {
        display: block;
        min-height: 1rem;
    }
</style>
