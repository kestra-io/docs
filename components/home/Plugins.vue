<template>
    <div class="container-fluid">
        <div class="container">
            <div class="row">
                <div class="col-lg-7" data-aos="zoom-in">
                    <img class="img-fluid mt-2 mb-4 mt-kg-0" src="/landing/home/plugins/artwork.svg" alt="Logos of tools that integrate with Kestra such as Snowflake, Airbyte, DBT or Fivetran and Kestra at the center of It"/>
                </div>
                <div class="col-lg-5 mb-5 align-items-center d-flex">
                    <div>
                        <h2 data-aos="fade-left">Over 300 plugins</h2>
                        <p data-aos="fade-right">
                            Plugins are at the core of Kestra's extensibility. Many plugins are available from the Kestra core team, and creating your own is easy. With plugins, you can add new functionality to Kestra.
                        </p>

                        <div class="mt-5">
                            <!-- data-aos="zoom-in" -->
                            <NuxtLink class="btn btn-animated btn-dark-animated" href="/plugins">See all plugins</NuxtLink>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Section from '~/components/layout/Section.vue';

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

    .container-fluid {
        background: #10051F url("/landing/home/plugins/background.svg") no-repeat bottom right;
        color: var(--bs-white);
        padding: 0;


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