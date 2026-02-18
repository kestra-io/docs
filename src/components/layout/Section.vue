<template>
    <section>
        <div class="subtitle" :data-usal="animationType('fade-r')" v-if="subtitle">
            <p>
                <span v-if="subtitleBefore" class="highlight">{{ subtitleBefore }}</span>
                {{ subtitle }}
                <span v-if="subtitleAfter" class="highlight">{{ subtitleAfter }}</span>
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
        background: var(--ks-background-body);
        width: 100%;
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
                color: var(--ks-content-primary);
                text-align: center;
                font-size: $h2-font-size;
                font-weight: 600;
                line-height: calc($spacer * 2);
                @include media-breakpoint-down(sm) {
                    font-size: $font-size-2xl;
                }
            }
        }
        &.dark {
            div.subtitle {
                p {
                    color: var(--ks-content-primary);
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
            color: var(--ks-content-primary);
            text-align: center;
            font-size: 1.15rem;
            max-width: $baseline-max-width;
            margin: $spacer auto 0;
            @include media-breakpoint-down(sm) {
                font-size: $font-size-md;
            }
        }
        :deep(p.overline) {
            font-size: $font-size-sm;
            text-transform: uppercase;
            color: var(--ks-content-primary);
            font-family: var(--bs-font-monospace);
            font-weight: 700;
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