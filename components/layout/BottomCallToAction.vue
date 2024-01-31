<template>
    <div class="container bg-dark-3">
        <Section
            subtitle="Getting Started"
            baseline="Start building with Kestra — Automate Everything Everywhere All at Once."
        >
            <div class="d-flex gap-2 flex-wrap justify-content-center align-items-center">
                <NuxtLink class="btn btn-dark me-2" target="_blank" href="/docs">
                    Read the docs
                </NuxtLink>
                <NuxtLink class="btn btn-animated btn-purple-animated" href="/docs/getting-started">
                    Get started
                </NuxtLink>
            </div>
        </Section>
    </div>
</template>

<script>
    import Section from './Section.vue';

    export default {
        components: {Section}
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .container {
        padding-left: calc($spacer * 1);
        padding-right: calc($spacer * 1);
        margin-top: calc($spacer * 5.625);
        border-radius: 8px;
        border: $block-border;
        background: $black-2 url("/landing/plugins/footer-bg.svg") no-repeat right;
        background-size: 20% 100%;

        :deep(section) {
            padding: 2rem 0;
            .subtitle p {
                color: $white;
                font-size: $h3-font-size;
                font-weight: 100;
                margin-bottom: 0;
            }

            .baseline {
                color: $white;
                font-size: $h6-font-size;
                font-weight: 300;
            }

            .main {
                padding-top: calc($spacer * 1) !important;
            }
        }
    }
</style>