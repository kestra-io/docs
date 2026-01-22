<template>
    <div class="container plugin py-5">
        <div class="row">
            <div class="col-lg-6" data-usal="zoomin">
                <NuxtImg
                    loading="lazy"
                    format="webp"
                    width="694px"
                    height="517px"
                    class="img-fluid"
                    src="/landing/features/scheduling/workflow/workflow_4.svg"
                    alt="Logos of tools that integrate with Kestra such as Snowflake, Airbyte, DBT or Fivetran and Kestra at the center of It"
                />
            </div>
            <div class="col-lg-6 mt-5">
                <div data-usal="fade-l" class="heading">
                    <h3 class="title heading">
                        Connect Your
                        <span class="title-animated"> Entire Tech Stack</span>
                        with Dedicated Plugins
                    </h3>
                    <p class="para mt-3" data-usal="fade-right ">
                        Integrate with your existing technology landscape using Kestra's robust
                        plugin architecture. From databases and cloud services to custom
                        applications, plugins enable you to connect, schedule, and automate your
                        entire tech stack.
                    </p>
                    <a href="/plugins" class="btn btn-dark mt-2" data-usal="zoomin">
                        See all Plugins
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
    @import "~/assets/styles/variable";

    .plugin {
        border-top: $block-border;
        border-bottom: $block-border;
        color: $white;
    }

    .heading {
        max-width: 400px;
    }

    .title {
        font-size: $font-size-3xl !important;
        font-weight: 300;
        margin-bottom: 0;
        @include media-breakpoint-down(sm) {
            font-size: calc($font-size-base * 1.625) !important;
            line-height: calc($spacer * 2);
        }

        &-animated {
            background: var(--Text_gradient, linear-gradient(90deg, #e151f7 2.16%, #5c47f5 65.09%));
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
    }

    .para {
        font-weight: 400;
        font-size: $font-size-base;
    }

    .btn-dark {
        --bs-btn-bg: $black-4;
        --bs-btn-hover-bg: $black-4;
        border: 1px solid $black-6;
    }

    .line {
        height: 1px;
        background: $black-6;
    }
</style>