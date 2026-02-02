<template>
    <section>
        <div class="subtitle" :data-usal="animationType('fade-r')" v-if="subtitle">
            <p>
                <span v-if="subtitleBefore">{{ subtitleBefore }}</span>
                {{ subtitle }}
                <span v-if="subtitleAfter">{{ subtitleAfter }}</span>
            </p>
        </div>
        <h2 :data-usal="animationType('fade-l')">{{ title }}</h2>
        <p v-if="baseline" class="baseline" :data-usal="animationType('fade-r')">
            {{ baseline }}
        </p>
        <div class="main">
            <slot name="default"></slot>
        </div>
    </section>
</template>

<script>
    export default {
        props: {
            title: {
                type: String,
                required: false,
            },
            subtitle: {
                type: String,
                required: false,
            },
            subtitleBefore: {
                type: String,
                required: false,
            },
            subtitleAfter: {
                type: String,
                required: false,
            },
            baseline: {
                type: String,
                required: false,
            },
            animation: {
                type: Boolean,
                default: true,
            },
        },
        methods: {
            animationType(type) {
                return this.animation ? type : ""
            },
        },
    }
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    section {
        padding: calc($spacer * 4) 0;

        &.with-shadow {
            text-align: center;
            background: url("/landing/shadow2.svg") no-repeat bottom center;
            @include media-breakpoint-down(lg) {
                background-size: contain;
                background-position: center center;
            }

            @include media-breakpoint-down(md) {
                background: none;
            }
        }

        div.subtitle {
            text-align: center;
            margin: 0 auto calc($spacer / 2);

            p {
                color: var(--Kestra-io-Token-color-white, #fff);
                text-align: center;
                font-family: $font-family-sans-serif;
                font-size: calc($font-size-base * 3.125);
                font-style: normal;
                font-weight: 400;
                line-height: calc($spacer * 3.125);

                @include media-breakpoint-down(sm) {
                    font-size: 1.875rem !important;
                    line-height: calc($spacer * 1.875);
                }

                span {
                    background: linear-gradient(90deg, #e151f7 65.38%, #5c47f5 82.43%);
                    background-clip: text;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
            }
        }

        &.dark {
            div.subtitle {
                p {
                    color: $white;
                }
            }
        }

        h2 {
            text-align: center;
            font-weight: 400;
            margin-bottom: 0;
        }

        div.main {
            padding-top: calc($spacer * 3);
            @include media-breakpoint-down(sm) {
                padding-top: calc($spacer * 1);
            }
        }

        p.baseline {
            color: $white;
            text-align: center;
            font-size: $font-size-xl;
            max-width: $baseline-max-width;
            margin: $spacer auto 0;
            font-weight: 400;

            @include media-breakpoint-down(sm) {
                font-size: $h6-font-size !important;
            }
        }

        :deep(p.overline) {
            font-size: $font-size-sm;
            text-transform: uppercase;
            color: var(--bs-primary);
            font-family: var(--bs-font-monospace);
            font-weight: 800;

            &:after {
                content: "";
                position: absolute;
                margin-top: calc($font-size-sm / 1.5);
                margin-left: $spacer;
                display: inline-block;
                height: 2px;
                width: 51px;
                background: var(--bs-pink);
            }
        }
    }
</style>