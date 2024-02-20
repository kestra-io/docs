<template>
    <div ref="container" class="container-fluid bg-dark-4">
        <div class="container">
            <div class="mb-5">
                <h2 class="title">Integrate with over 400+ plugins you already <span>know</span> and <span>love</span></h2>
                <div ref="plugins" class="plugins flex-wrap align-items-center justify-content-center">
                    <img data-aos="fade-up" data-aos-delay="100" src="/landing/home/plugins/fivetran.svg" alt="fivetran">
                    <img data-aos="fade-up" data-aos-delay="100" src="/landing/home/plugins/snowflake.svg" alt="snowflake">
                    <img data-aos="fade-up" data-aos-delay="100" src="/landing/home/plugins/aws-white.svg" alt="aws">
                    <img data-aos="fade-up" data-aos-delay="100" src="/landing/home/plugins/databricks.svg" alt="databricks">
                    <img data-aos="fade-up" data-aos-delay="100" src="/landing/home/plugins/azure.svg" alt="azure">
                    <img data-aos="fade-up" data-aos-delay="100" src="/landing/home/plugins/dbt.svg" alt="dbt">
                    <img data-aos="fade-up" data-aos-delay="100" src="/landing/home/plugins/airbyte.svg" alt="airbyte">
                    <img data-aos="fade-up" data-aos-delay="100" src="/landing/home/plugins/docker.svg" alt="docker">
                    <img data-aos="fade-up" data-aos-delay="100" src="/landing/home/plugins/terraform.svg" alt="terraform">
                    <img data-aos="fade-up" data-aos-delay="100" src="/landing/home/plugins/g-cloud.svg" alt="g-cloud">
                    <img data-aos="fade-up" data-aos-delay="100" src="/landing/home/plugins/github.svg" alt="github">
                </div>
                <div class="mt-5 d-flex justify-content-center">
                    <NuxtLink class="btn btn-animated btn-dark-animated" href="/plugins">See all plugins</NuxtLink>
                </div>
            </div>
        </div>
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
        mounted() {
            window.addEventListener("resize", this.autoScrollIfNeeded);
            this.autoScrollIfNeeded();
        },
        unmounted() {
            window.removeEventListener("resize", this.autoScrollIfNeeded)
        },
        methods: {
            autoScrollIfNeeded() {
                if (this.$refs && this.$refs.plugins) {
                    const plugins = this.$refs.plugins;
                    const classes = plugins.classList;
                    console.log(plugins.clientWidth >= this.$refs.container.parentElement.offsetWidth)
                    if (plugins.clientWidth >= this.$refs.container.parentElement.offsetWidth) {
                        classes.add("scrolling");
                    } else {
                        classes.remove("scrolling")
                    }
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .container-fluid {
        background: url("/landing/home/plugins/background.svg") no-repeat center;
        color: var(--bs-white);
        padding: 0;

        .container {
            padding: 4rem 0;
            border-bottom: $block-border;
            border-top: $block-border;
        }

        .title {
            color: var(--bs-white);
            text-align: center;
            font-family: $font-family-sans-serif;
            font-size: calc($font-size-base * 3.125);
            font-style: normal;
            font-weight: 300;
            line-height: 4rem;
            padding: 0 20%;
            @include media-breakpoint-down(sm) {
                font-size: 1.875rem;
                line-height: 2.563rem;
            }

            @include media-breakpoint-down(lg) {
                padding: 0;
            }

            span {
                background: linear-gradient(91deg, #E151F7 43.87%, #5C47F5 55.51%);
                background-clip: text;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
        }

        @keyframes auto-scroll {
            0% {
                -webkit-transform: translateX(0);
                transform: translateX(0);
            }
            50% {
                -webkit-transform: translateX(calc(-250px * 7));
                transform: translateX(calc(-250px * 7));
            }
            100% {
                -webkit-transform: translateX(0);
                transform: translateX(0);
            }
        }

        .plugins {
            gap: calc($spacer * 1.688) 4rem;
            margin: calc($spacer * 5.625) 0;
            display: flex;
            width: 100%;

            @include media-breakpoint-down(md) {
                margin: calc($spacer * 3.625) 0;
            }
            @include media-breakpoint-down(md) {
                width: fit-content;
                position: relative;
                flex-wrap: nowrap !important;
                overflow-x: auto;
                overflow-y: hidden;
                margin: auto;
                margin-bottom: 1.5rem;
                gap: calc($spacer * 1.688) 2rem;
                &.scrolling {
                    animation: auto-scroll 30s infinite linear;
                }

                img {
                    max-height: calc($spacer * 3.125);
                }

            }
        }


        .row {
            div:nth-child(2) {
                @include media-breakpoint-up(lg) {
                    padding: calc($spacer * 4) calc($spacer * 4) 0;
                }

                h2 {
                    margin-bottom: calc($spacer * 2);
                    background: linear-gradient(90.03deg, #E151F7 2.16%, #5C47F5 65.09%);
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    text-fill-color: transparent;
                }

                p {
                    font-size: $font-size-lg;
                }
            }
        }
    }


</style>