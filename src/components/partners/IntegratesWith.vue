<template>
    <div class="container-fluid">
        <div class="row px-3 px-md-0">
            <div class="col-12 text-center pt-5 bg-dark-2" data-usal="zoomin">
                <div>
                    <img
                        src="/partners/integrate-with-logos/background.svg"
                        alt="Kestra's Integration"
                    />
                </div>
                <div class="my-3">
                    <h2>Kestra Integrates with:</h2>
                </div>
                <div>
                    <NuxtImg
                        height="147px"
                        width="147px"
                        loading="lazy"
                        format="webp"
                        src="/partners/integrate-with-logos/aws.svg"
                        alt="AWS logo"
                    />
                    <NuxtImg
                        height="147px"
                        width="147px"
                        loading="lazy"
                        format="webp"
                        src="/partners/integrate-with-logos/gcp.svg"
                        alt="GCP logo"
                    />
                    <NuxtImg
                        height="147px"
                        width="147px"
                        loading="lazy"
                        format="webp"
                        src="/partners/integrate-with-logos/azure.svg"
                        alt="Microsoft Azure logo"
                    />
                    <NuxtImg
                        height="147px"
                        width="147px"
                        loading="lazy"
                        format="webp"
                        src="/partners/integrate-with-logos/airbyte.svg"
                        alt="Airbyte logo"
                    />
                    <NuxtImg
                        height="147px"
                        width="147px"
                        loading="lazy"
                        format="webp"
                        src="/partners/integrate-with-logos/snowflake.svg"
                        alt="snowflake logo"
                    />
                    <NuxtImg
                        height="147px"
                        width="147px"
                        loading="lazy"
                        format="webp"
                        src="/partners/integrate-with-logos/fivetran.svg"
                        alt="fivetran logo"
                    />
                    <div class="py-3"><p class="and-more">And more...</p></div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    .row .col-12 {
        @include media-breakpoint-down(md) {
            border-radius: 0.5rem;
            border: 1px solid #252526;
        }
    }

    h2 {
        color: $white;
        font-size: $h2-font-size;
        font-weight: 300;
    }

    .and-more {
        color: $white-1;
        font-size: 1.75rem;
        font-weight: 100;
    }
</style>