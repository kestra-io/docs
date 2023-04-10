<template>
    <section>
        <div class="subtitle" v-if="subtitle">
            <h4>{{ subtitle }}</h4>
        </div>
        <h3>{{ title }}</h3>
        <p v-if="baseline" class="baseline">
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

        div.subtitle {
            text-align: center;
            margin: 0 auto calc($spacer / 2);

            h4 {
                font-size: $font-size-sm;
                color: var(--bs-pink);
                font-weight: 800;
                text-transform: uppercase;
                border-bottom: 2px solid var(--bs-pink);
                font-family: var(--bs-font-monospace);
                display: inline;
            }
        }

        h3 {
            font-size: $h1-font-size;
            text-align: center;
            font-weight: 800;
            margin-bottom: 0;
        }

        div.main {
            padding-top: calc($spacer * 3);
        }

        p.baseline {
            text-align: center;
            color: var(--bs-gray-600);
            max-width: 730px;
            margin: 0 auto;
        }

        :deep(h5) {
            font-size: $h3-font-size;
            font-weight: 800;
        }

        :deep(h6) {
            font-size: $font-size-sm;
            text-transform: uppercase;
            color: var(--bs-primary);
            font-family: var(--bs-font-monospace);
            font-weight: 800;

            &:after {
                content: '';
                position: absolute;
                margin-top: calc($font-size-sm / 2);
                margin-left: $spacer;
                display: inline-block;
                height: 1px;
                width: 51px;
                background: var(--bs-pink);
            }
        }
    }
</style>