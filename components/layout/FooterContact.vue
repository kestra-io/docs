<template>
    <div class="container rounded-3">
        <Section :animation="animation">
            <div class="text-center cta px-5">
                <p class="title" v-if="title" :data-aos="animationType('fade-left')">
                    {{title}}
                </p>
                <p class="subtitle" v-if="subtitle" :data-aos="animationType('fade-left')">
                    {{subtitle}}
                </p>
                <NuxtLink
                    v-if="darkButtonText"
                    :href="darkButtonHref"
                    class="btn btn-animated btn-dark-animated mt-2 me-sm-3 me-1"
                    :data-aos="animationType('zoom-in')"
                >
                    {{darkButtonText}}
                </NuxtLink>
                <NuxtLink v-if="darkButtonHref" :href="purpleButtonHref"  class="btn btn-animated btn-purple-animated mt-2" :data-aos="animationType('zoom-in')">
                    {{purpleButtonText}}
                </NuxtLink>
            </div>
        </Section>
    </div>
</template>

<script>
    import Section from '../layout/Section.vue';

    export default {
        components: {Section},
        props: {
            title: {
                type: String,
                required: false,
                default: () => "Getting Started"
            },
            subtitle: {
                type: String,
                required: false
            },
            darkButtonText: {
                type: String,
                required: false,
            },
            darkButtonHref: {
                type: String,
                required: false,
                default: () => "/docs/terraform"
            },
            purpleButtonText: {
                type: String,
                required: false,
            },
            purpleButtonHref: {
                type: String,
                required: false,
                default: () => "https://github.com/kestra-io/kestra"
            },
            animation: {
                type: Boolean,
                default: true
            }
        },
        methods: {
            animationType(type) {
                return this.animation ? type : ""
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .container {
        padding-left: calc($spacer * 1);
        padding-right: calc($spacer * 1);
        margin-top: calc($spacer * 5.625);
        border-radius: calc($spacer * 0.5);
        border: $block-border;
        background: $black-2 url("/landing/community/bg.svg") no-repeat right;
        background-size: 20% 100%;
        color: $white;
        @include media-breakpoint-down(lg) {
            padding-left: calc($spacer * 0.3);
            padding-right: calc($spacer * 0.3);
        }
        :deep(section) {
            padding: 2rem 0;

            .main {
                padding-top: 0;
            }

            .title, .subtitle {
                font-family: $font-family-sans-serif;
            }

            .title {
                font-size: $h3-font-size;
                line-height: calc($spacer * 2.5);
                font-weight: 100;
                margin: 0 auto calc($spacer * 0.5);
                max-width: 37rem;
            }

            .subtitle {
                margin: calc($spacer * 0.5) auto;
                font-size: $h6-font-size;
                line-height: calc($spacer * 1.625);
                font-weight: 100;
                max-width: 40rem;
            }
        }

        .btn-dark {
            border: $btn-dark-border;
        }

        a {
            color: $white !important;
        }
    }
</style>