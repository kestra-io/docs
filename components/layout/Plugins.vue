<template>
    <div ref="plugins" class="plugins">
        <NuxtImg loading="lazy" format="webp" data-aos="fade-up" data-aos-delay="100" src="/landing/home/plugins/fivetran.svg" alt="fivetran" />
        <NuxtImg loading="lazy" format="webp" data-aos="fade-up" data-aos-delay="100" src="/landing/home/plugins/snowflake.svg" alt="snowflake" />
        <NuxtImg loading="lazy" format="webp" data-aos="fade-up" data-aos-delay="100" src="/landing/home/plugins/aws-white.svg" alt="aws" />
        <NuxtImg loading="lazy" format="webp" data-aos="fade-up" data-aos-delay="100" src="/landing/home/plugins/databricks.svg" alt="databricks" />
        <NuxtImg loading="lazy" format="webp" data-aos="fade-up" data-aos-delay="100" src="/landing/home/plugins/azure.svg" alt="azure" />
        <NuxtImg loading="lazy" format="webp" data-aos="fade-up" data-aos-delay="100" src="/landing/home/plugins/dbt.svg" alt="dbt" />
        <NuxtImg loading="lazy" format="webp" data-aos="fade-up" data-aos-delay="100" src="/landing/home/plugins/airbyte.svg" alt="airbyte" />
        <NuxtImg loading="lazy" format="webp" data-aos="fade-up" data-aos-delay="100" src="/landing/home/plugins/docker.svg" alt="docker" />
        <NuxtImg loading="lazy" format="webp" data-aos="fade-up" data-aos-delay="100" src="/landing/home/plugins/terraform.svg" alt="terraform" />
        <NuxtImg loading="lazy" format="webp" data-aos="fade-up" data-aos-delay="100" src="/landing/home/plugins/g-cloud.svg" alt="g-cloud" />
        <NuxtImg loading="lazy" format="webp" data-aos="fade-up" data-aos-delay="100" src="/landing/home/plugins/github.svg" alt="github" />
    </div>
    <div class="d-flex justify-content-center" data-aos="zoom-in">
        <NuxtLink class="btn btn-animated btn-dark-animated" href="/plugins">See all plugins</NuxtLink>
    </div>
</template>

<script setup lang="ts">
        const pluginsRef = ref<HTMLDivElement | null>(null);

        const active = ref(1);

        onMounted(() => {
            window.addEventListener("resize", autoScrollIfNeeded);
            autoScrollIfNeeded();
        })

        onBeforeUnmount(() => {
            window.removeEventListener("resize", autoScrollIfNeeded)
        })

        function autoScrollIfNeeded() {
            if (pluginsRef.value) {
                const plugins = pluginsRef.value;
                const classes = plugins.classList;
                if (window.innerWidth <= 768) {
                    classes.add("scrolling");
                } else {
                    classes.remove("scrolling")
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
        display: flex;
        flex-wrap: wrap;
        gap: calc($spacer * 1.688) 4rem;
        margin: calc($spacer * 5.625) 0;
        display: flex;
        width: 100%;
        align-items:center;
        justify-content: center;

        img {
            min-height: 2.4rem;
            height: auto;
        }

        @include media-breakpoint-down(md) {
            margin: calc($spacer * 3.625) 0;
        }

        @include media-breakpoint-down(md) {
            width: fit-content;
            position: relative;
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