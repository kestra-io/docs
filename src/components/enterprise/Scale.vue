<template>
    <div class="container">
        <div class="rounded-3">
            <div class="scale-img" data-usal="zoomin">
                <img class="img-fluid" v-bind="eeLogo" alt="EE logo" />
            </div>
            <Section title="Scale with High Availability and Fault Tolerance">
                <p data-usal="fade-r">
                    Ensure scalability and high availability with managed
                    <b>Kafka</b> and <b>Elasticsearch</b> integrated into the Enterprise Edition to
                    eliminate single point of failure.
                </p>
            </Section>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import Section from "~/components/layout/Section.vue"
    import eeLogo from "./assets/ee-logo.svg"
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    .container {
        > div {
            background: $purple-7 url("/landing/dot3.svg") no-repeat bottom right;
            color: var(--bs-white);
        }

        .scale-img {
            text-align: center;
            position: relative;
            margin-left: 6rem;
        }

        p {
            padding-left: calc($spacer * 2);
            padding-right: calc($spacer * 2);
            text-align: center;
            font-size: $font-size-xl;
            margin: 0 auto;

            @include media-breakpoint-up(md) {
                padding-left: calc($spacer * 8);
                padding-right: calc($spacer * 8);
            }
        }

        :deep(h2) {
            position: relative;
            margin-top: -7rem;
        }

        :deep(p.baseline) {
            color: var(--bs-white);
        }
    }
</style>