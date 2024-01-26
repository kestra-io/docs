<template>
    <div class="container bg-dark-2">
        <Section
            title="Ready to take your data department to the next level ?"
        >
        <div class="text-center cta d-flex align-items-center justify-content-center flex-wrap gap-3">
            <NuxtLink href="/contact-us" target="_blank" class="btn btn-dark" data-aos="zoom-in">
                Contact us
            </NuxtLink>
            <NuxtLink href="https://demo.kestra.io/ui/login?auto" target="_blank" class="btn btn-animated btn-purple-animated" data-aos="zoom-in">
                Live demo
            </NuxtLink>
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
        border-radius: 8px;
        border: $block-border;

        :deep(section) {
            padding-left: calc($rem-9 * 2);
            padding-right: calc($rem-9 * 2);

            @include media-breakpoint-down(xxl) {
                padding-left: 0;
                padding-right: 0;
            }

            h2 {
                font-size: $h3-font-size;
                font-weight: 100;
            }
        }

        .btn-dark {
            border: 1px solid rgba(255, 255, 255, 0.12);
            background: $black-4;
        }
    }
</style>