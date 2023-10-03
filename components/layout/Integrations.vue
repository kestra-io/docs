<template>
    <div class="container-fluid bg-body-tertiary">
        <div class="container">
            <div class="row">
                <div class="col-lg-6" data-aos="zoom-in">
                    <img class="img-fluid mt-5 mt-kg-0" src="/landing/features/integration.svg" alt="Logos of tools that integrate with Kestra such as Snowflake, Airbyte, DBT or Fivetran and Kestra at the center of It"/>
                </div>
                <div class="col-lg-6 mb-5">
                    <h2 data-aos="fade-left">Simple Integration</h2>
                    <p class="mb-5" data-aos="fade-right">
                        <b>Customize and extend</b> Kestra's integrations with custom plugins, tailored to your specifics needs. Integrate internal systems, third-party APIs, cloud services or databases using simple and scalable integrations.
                    </p>

                    <NuxtLink href="/plugins" class="btn btn-dark me-2 mb-2" data-aos="zoom-in">See open-source plugins</NuxtLink>
                    <NuxtLink href="/docs/plugin-developer-guide" class="btn btn-primary mb-2" data-aos="zoom-in">Create a custom plugin</NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Section from '~/components/layout/Section.vue';

    export default {
        components: {Section}
    }
</script>


<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .container-fluid {
        background: $purple-7;
        color: var(--bs-white);

        .row {
            div:nth-child(1) {
                justify-content: center;
                display: flex;
            }

            div:nth-child(2) {
                @include media-breakpoint-up(lg) {
                    padding: calc($spacer * 4) calc($spacer * 4) 0;
                }

                h2 {
                    margin-bottom: calc($spacer * 2);
                }

                p {
                    font-size: $font-size-lg;
                }
            }
        }
    }
</style>