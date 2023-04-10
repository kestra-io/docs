<template>
    <div class="container">
        <div class="scale-img">
            <img src="/landing/enterprise/Frame_465.png" /><img src="/landing/enterprise/Line_43.png" /><img src="/landing/enterprise/Frame_466.png" /><img src="/landing/enterprise/Line_44.png" /><img src="/landing/enterprise/Frame_467.png" />
        </div>
        <Section
            title="Scale With no Point of Failure"
        >
            <div class="container center">
                <p>
                    Ensure scalability and high availability with <b>Kafka</b> and <b>Elasticsearch</b> Features available on the Enterprise Edition to eliminate all points of failure.
                </p>
            </div>
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
        background: $purple-4 url("/landing/enterprise/Group_2.png") no-repeat bottom right;
        color: var(--bs-white);
        padding: 0;

        .scale-img {
            text-align: center;
            padding-top: calc($spacer * 2);
        }

        p {
            padding-left: calc($spacer * 8);
            padding-right: calc($spacer * 8);
            text-align: center;
        }

        :deep(p.baseline) {
            color: var(--bs-white);
        }
    }
</style>