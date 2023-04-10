<template>
    <div class="container-fluid bg-body-tertiary">
        <div class="container">
            <div class="row">
                <div class="col-md-6">
                    <h3>Limitless Integration</h3>
                    <p>
                        Customize and extend the capabilities and functionalities of Kestra with the plugins feature. integrate and connect all kind of data sources, cloud services, databases, transformation, quality, notification tools and even more! It is also possible to create Custom Plugins that add specific custom features to meet your specifics needs.
                    </p>

                    <a href="#TODO" class="btn btn-lg btn-dark me-2">See all plugins</a>
                    <a href="#TODO" class="btn btn-lg btn-primary">Create your plugin</a>
                </div>
                <div class="col-md-6">
                    <img src="/landing/features/integration.svg" alt="" />
                </div>
            </div>

        </div>
    </div>
</template>

<script>
    import Section from '../layout/Section.vue';

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
            div:first-child {
                padding: calc($spacer * 7);

                h3 {
                    font-size: $h1-font-size;
                    margin-bottom: calc($spacer * 2);
                    font-weight: 800;
                }
            }
        }
    }
</style>