<template>
    <div class="main-box">
        <div class="container">
            <Testimonials :testimonialData />
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref } from "vue"
    import Testimonials from "~/components/common/Testimonials.vue"

    const testimonialData = ref([
        {
            message:
                "Kestra enables the entire team, even non-technical members, to understand the benefits and contribute. I’ve onboarded people, created blueprints, and set them up to build their own workflows.",
            name: "John Kim",
            designation: "Manager Corporate Strategy",
            alt: "Manager Corporate Strategy",
            logo: { src: "/landing/pricing/fila.svg" },
        },
    ])
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    .main-box {
        background-color: #121217;

        .container {
            max-width: 1120px;
            width: 100%;

            @media only screen and (max-width: 1200px) {
                padding-left: $rem-2;
                padding-right: $rem-2;
            }

            @media only screen and (max-width: 760px) {
                margin: 0;
                padding: 0;
            }

            .demo-btn {
                &:after {
                    background-color: #6862f5 !important;
                }

                cursor: pointer;
                padding: 10px 16px;
                border-radius: 4px;
                max-width: 135px;

                span {
                    color: $white;
                    font-family: $font-family-sans-serif;
                    font-size: $rem-1;
                    font-weight: 700;
                    line-height: 24px;
                    text-align: center;
                    white-space: nowrap;
                }
            }
        }
    }
</style>