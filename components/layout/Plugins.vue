<template>
    <div ref="plugins" class="plugins">
        <NuxtImg loading="lazy" format="webp" data-aos="fade-up" data-aos-delay="100" src="/landing/home/plugins/fivetran.svg" alt="Fivetran" />
        <NuxtImg loading="lazy" format="webp" data-aos="fade-up" data-aos-delay="100" src="/landing/home/plugins/snowflake.svg" alt="Snowflake" />
        <NuxtImg loading="lazy" format="webp" data-aos="fade-up" data-aos-delay="100" src="/landing/home/plugins/aws-white.svg" alt="AWS" />
        <NuxtImg loading="lazy" format="webp" data-aos="fade-up" data-aos-delay="100" src="/landing/home/plugins/databricks.svg" alt="Databricks" />
        <NuxtImg loading="lazy" format="webp" data-aos="fade-up" data-aos-delay="100" src="/landing/home/plugins/azure.svg" alt="Azure" />
        <NuxtImg loading="lazy" format="webp" data-aos="fade-up" data-aos-delay="100" src="/landing/home/plugins/dbt.svg" alt="DBT" />
        <NuxtImg loading="lazy" format="webp" data-aos="fade-up" data-aos-delay="100" src="/landing/home/plugins/airbyte.svg" alt="Airbyte" />
        <NuxtImg loading="lazy" format="webp" data-aos="fade-up" data-aos-delay="100" src="/landing/home/plugins/docker.svg" alt="Docker" />
        <NuxtImg loading="lazy" format="webp" data-aos="fade-up" data-aos-delay="100" src="/landing/home/plugins/terraform.svg" alt="Terraform" />
        <NuxtImg loading="lazy" format="webp" data-aos="fade-up" data-aos-delay="100" src="/landing/home/plugins/gcp.svg" alt="Google Cloud" />
        <NuxtImg loading="lazy" format="webp" data-aos="fade-up" data-aos-delay="100" src="/landing/home/plugins/github.svg" alt="GitHub" />
    </div>
    <div class="d-flex justify-content-center" data-aos="zoom-in">
        <NuxtLink class="btn btn-animated btn-dark-animated" href="/plugins">See all plugins</NuxtLink>
    </div>
</template>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .plugins {
        display: flex;
        flex-wrap: wrap;
        gap: calc($spacer * 1.688) 4rem;
        margin: calc($spacer * 5.625) auto;
        width: 100%;
        align-items:center;
        justify-content: center;
        max-width: 650px;

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
            margin: calc($spacer * 1.625) 0 1.5rem;
            gap: calc($spacer * 1.688) 2rem;

            img {
                max-height: calc($spacer * 3.125);
            }

        }

    }


</style>