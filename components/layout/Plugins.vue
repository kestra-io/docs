<template>
    <div ref="plugins" class="plugins flex-wrap align-items-center justify-content-center">
        <NuxtImg width="165px" height="46px" loading="lazy" format="webp" data-aos="fade-up" data-aos-delay="100" src="/landing/home/plugins/fivetran.svg" alt="fivetran" />
        <NuxtImg width="199px" height="48px" loading="lazy" format="webp" data-aos="fade-up" data-aos-delay="100" src="/landing/home/plugins/snowflake.svg" alt="snowflake" />
        <NuxtImg width="72px" height="71px" loading="lazy" format="webp" data-aos="fade-up" data-aos-delay="100" src="/landing/home/plugins/aws-white.svg" alt="aws" />
        <NuxtImg width="149px" height="45px" loading="lazy" format="webp" data-aos="fade-up" data-aos-delay="100" src="/landing/home/plugins/databricks.svg" alt="databricks" />
        <NuxtImg width="137px" height="42px" loading="lazy" format="webp" data-aos="fade-up" data-aos-delay="100" src="/landing/home/plugins/azure.svg" alt="azure" />
        <NuxtImg width="126px" height="49px" loading="lazy" format="webp" data-aos="fade-up" data-aos-delay="100" src="/landing/home/plugins/dbt.svg" alt="dbt" />
        <NuxtImg width="190px" height="53px" loading="lazy" format="webp" data-aos="fade-up" data-aos-delay="100" src="/landing/home/plugins/airbyte.svg" alt="airbyte" />
        <NuxtImg width="164px" height="43px" loading="lazy" format="webp" data-aos="fade-up" data-aos-delay="100" src="/landing/home/plugins/docker.svg" alt="docker" />
        <NuxtImg width="155px" height="59px" loading="lazy" format="webp" data-aos="fade-up" data-aos-delay="100" src="/landing/home/plugins/terraform.svg" alt="terraform" />
        <NuxtImg width="264px" height="43px" loading="lazy" format="webp" data-aos="fade-up" data-aos-delay="100" src="/landing/home/plugins/g-cloud.svg" alt="g-cloud" />
        <NuxtImg width="162px" height="41px" loading="lazy" format="webp" data-aos="fade-up" data-aos-delay="100" src="/landing/home/plugins/github.svg" alt="github" />
    </div>
    <div class="d-flex justify-content-center" data-aos="zoom-in">
        <NuxtLink class="btn btn-animated btn-dark-animated" href="/plugins">See all plugins</NuxtLink>
    </div>
</template>

<script>
    import Section from './Section.vue';

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
                    if (window.innerWidth <= 768) {
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

    @keyframes auto-scroll {
        0% {
            -webkit-transform: translateX(0);
            transform: translateX(0);
        }
        50% {
            -webkit-transform: translateX(calc(-250px * 8));
            transform: translateX(calc(-200px * 8));
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

        img {
            min-height: calc($spacer * 2.563);
            height: auto;
        }

        @include media-breakpoint-down(md) {
            margin: calc($spacer * 3.625) 0;
        }

        @include media-breakpoint-down(md) {
            width: fit-content;
            position: relative;
            flex-wrap: nowrap !important;
            overflow-x: auto;
            overflow-y: hidden;
            margin: calc($spacer * 1.625) 0;
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


</style>