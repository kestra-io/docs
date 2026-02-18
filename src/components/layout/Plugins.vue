<template>
    <div ref="plugins" class="plugins">
        <img
            loading="lazy"
            data-usal="fade-u delay-100"
            src="/icons/io.kestra.plugin.fivetran-white.svg"
            alt="Fivetran"
        />
        <img
            loading="lazy"
            data-usal="fade-u delay-100"
            src="/icons/io.kestra.plugin.jdbc.snowflake-white.svg"
            alt="Snowflake"
        />
        <img
            loading="lazy"
            data-usal="fade-u delay-100"
            src="/icons/io.kestra.plugin.aws-white.svg"
            alt="AWS"
        />
        <img
            loading="lazy"
            data-usal="fade-u delay-100"
            src="/icons/io.kestra.plugin.databricks-white.svg"
            alt="Databricks"
        />
        <img
            loading="lazy"
            data-usal="fade-u delay-100"
            src="/icons/io.kestra.plugin.azure-white.svg"
            alt="Azure"
        />
        <img
            loading="lazy"
            data-usal="fade-u delay-100"
            src="/icons/io.kestra.plugin.dbt-white.svg"
            alt="DBT"
        />
        <img
            loading="lazy"
            data-usal="fade-u delay-100"
            src="/icons/io.kestra.plugin.airbyte-white.svg"
            alt="Airbyte"
        />
        <img
            loading="lazy"
            data-usal="fade-u delay-100"
            src="/icons/io.kestra.plugin.docker-white.svg"
            alt="Docker"
        />
        <img
            loading="lazy"
            data-usal="fade-u delay-100"
            src="/icons/io.kestra.plugin.terraform-white.svg"
            alt="Terraform"
        />
        <img
            loading="lazy"
            data-usal="fade-u delay-100"
            src="/icons/io.kestra.plugin.gcp-white.svg"
            alt="Google Cloud"
        />
        <img
            loading="lazy"
            data-usal="fade-u delay-100"
            src="/icons/io.kestra.plugin.github-white.svg"
            alt="GitHub"
        />
    </div>
    <div class="d-flex justify-content-center" data-usal="zoomin">
        <a class="btn btn-animated btn-dark-animated" href="/plugins">See all plugins</a>
    </div>
</template>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    .plugins {
        display: flex;
        flex-wrap: wrap;
        gap: calc($spacer * 1.688) 4rem;
        margin: calc($spacer * 5.625) auto;
        width: 100%;
        align-items: center;
        justify-content: center;
        max-width: 650px;

        img {
            width: 40px;
            height: 40px;
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