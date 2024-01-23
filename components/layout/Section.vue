<template>
    <section>
        <div class="subtitle" :data-aos="animationType('fade-right')" v-if="subtitle">
            <p>
                <span v-if="subtitleBefore">{{subtitleBefore}}</span>
                {{ subtitle }}
                <span v-if="subtitleAfter">{{subtitleAfter}}</span>
            </p>
        </div>
        <h2 :data-aos="animationType('fade-left')">{{ title }}</h2>
        <p v-if="baseline" class="baseline" :data-aos="animationType('fade-right')">
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
            max-width: 576px;
            text-align: center;
            margin: 0 auto calc($spacer / 2);

            p {
                color: var(--Kestra-io-Token-color-white, #FFF);
                text-align: center;
                font-family: $font-family-sans-serif;
                font-size: 50px;
                font-style: normal;
                font-weight: 300;
                line-height: 50px;

                span {
                    background: linear-gradient(90deg, #E151F7 65.38%, #5C47F5 82.43%);
                    background-clip: text;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
            }
        }


        &.dark {
            div.subtitle {
                p {
                    color: var(--bs-white);
                }
            }
        }

        h2 {
            text-align: center;
            font-weight: 800;
            margin-bottom: 0;
        }

        div.main {
            padding-top: calc($spacer * 3);
        }

        p.baseline {
            text-align: center;
            font-size: $font-size-xl;
            max-width: $baseline-max-width;
            margin: $spacer auto 0;
        }

        :deep(p.overline) {
            font-size: $font-size-sm;
            text-transform: uppercase;
            color: var(--bs-primary);
            font-family: var(--bs-font-monospace);
            font-weight: 800;

            &:after {
                content: '';
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