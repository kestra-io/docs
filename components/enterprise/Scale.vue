<template>
    <div class="container rounded-3">
        <div class="scale-img">
            <img src="/landing/enterprise/ee-logo.svg" alt="" />
        </div>
        <Section
            title="Scale With no Point of Failure"
        >
            <p>
                Ensure scalability and high availability with <b>Kafka</b> and <b>Elasticsearch</b> Features available on the Enterprise Edition to eliminate all points of failure.
            </p>
        </Section>
    </div>
</template>

<script>
    import Section from '../layout/Section.vue';

    export default {
        components: {Section},
        data() {
            return {
                active: 1,
            };
        },
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .container {
        background: $purple-7 url("/landing/dot3.svg") no-repeat bottom right;
        color: var(--bs-white);
        padding: 0;

        .scale-img {
            text-align: center;
            position: relative;
            margin-left: 6rem;
        }

        p {
            padding-left: calc($spacer * 8);
            padding-right: calc($spacer * 8);
            text-align: center;
            font-size: $font-size-xl;
            max-width: 900px;
            margin: 0 auto;
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