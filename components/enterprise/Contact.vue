<template>
    <div class="container rounded-3">
        <Section
            title="Getting Started"
        >
            <div class="text-center cta">
                <a href="https://kestra.io/demo" target="_blank" class="btn btn-dark bg-dark-4 me-3" data-aos="zoom-in">
                    Contact Us
                </a>
                <a href="https://kestra.io/demo" target="_blank" class="btn btn-animated btn-purple-animated" data-aos="zoom-in">
                    Talk to Sales
                </a>
            </div>
        </Section>
    </div>
</template>

<script>
    import Section from '../layout/Section.vue';

    export default {
        components: {Section}
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .container {
        color: $white;
        padding-left: calc($spacer * 4);
        padding-right: calc($spacer * 4);
        margin-bottom: calc($spacer * 2);

        :deep(p.baseline) {
            color: $white;
        }

        :deep(section) {
            background-color: $black-2;
            border-radius: 8px;
            border: $block-border;
            padding: 2rem 0;

            .main {
                padding-top: 1rem;
            }
        }

        .btn-dark {
            border: 1px solid rgba(255, 255, 255, 0.12);
        }
    }
</style>