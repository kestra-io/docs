<template>
    <section>
        <div class="subtitle" data-aos="fade-right" v-if="subtitle">
            <p>{{ subtitle }}</p>
        </div>
        <h2 data-aos="fade-left">{{ title }}</h2>
        <p v-if="baseline" class="baseline" data-aos="fade-right">
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
            baseline: {
                type: String,
                required: false,
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
        }

        div.subtitle {
            text-align: center;
            margin: 0 auto calc($spacer / 2);

            p {
                font-size: $font-size-sm;
                color: var(--bs-pink);
                font-weight: 800;
                text-transform: uppercase;
                border-bottom: 2px solid var(--bs-pink);
                font-family: var(--bs-font-monospace);
                display: inline;
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