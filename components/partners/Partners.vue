<template>
    <div class="container">
        <Section title="Technology Partners">
            <div class="row card-group mb-2">
                <div class="col-12 col-md-4 col-lg-4 mb-4">
                    <div class="card" data-aos="zoom-in">
                        <img src="/partners/partners-logos/airbyte.svg" class="card-img-top" alt="Airbyte's Logo">
                        <div class="card-body">
                            <p class="card-text">Technology Partner</p>
                            <h5 class="card-title">Airbyte</h5>
                            <a href="https://airbyte.com/" target="_blank">Visit Airbyte website <OpenInNew /></a>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-md-4 col-lg-4 mb-4">
                    <div class="card" data-aos="zoom-in">
                        <img src="/partners/partners-logos/dlthub.svg" class="card-img-top" alt="dlthub's Logo">
                        <div class="card-body">
                            <p class="card-text">Technology Partner</p>
                            <h5 class="card-title">dlthub</h5>
                            <a href="https://dlthub.com/" target="_blank">Visit dlthub website <OpenInNew /></a>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-md-4 col-lg-4 mb-4">
                    <div class="card" data-aos="zoom-in">
                        <img src="/partners/partners-logos/snowflake.svg" class="card-img-top" alt="snoflake's Logo">
                        <div class="card-body">
                            <p class="card-text">Technology Partner</p>
                            <h5 class="card-title">Snowflake</h5>
                            <a href="https://snowflake.com/" target="_blank">Visit Snowflake website <OpenInNew /></a>
                        </div>
                    </div>>
                </div>
                <div class="col-12 col-md-4 col-lg-4 mb-4">
                    <div class="card" data-aos="zoom-in">
                        <img src="/partners/partners-logos/motherduck.svg" class="card-img-top" alt="snoflake's Logo">
                        <div class="card-body">
                            <p class="card-text">Technology Partner</p>
                            <h5 class="card-title">MotherDuck</h5>
                            <a href="https://motherduck.com/" target="_blank">Visit MotherDuck website <OpenInNew /></a>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-md-4 col-lg-4 mb-4">
                    <div class="card" data-aos="zoom-in">
                        <img src="/partners/partners-logos/terraform.svg" class="card-img-top" alt="Terraform's Logo">
                        <div class="card-body">
                            <p class="card-text">Technology Partner</p>
                            <h5 class="card-title">Terraform</h5>
                            <a href="https://www.terraform.io/" target="_blank">Visit Terraform website <OpenInNew /></a>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-md-4 col-lg-4 mb-4">
                    <div class="card text-center" data-aos="zoom-in">
                        <img src="/partners/badge-partner.svg" class="card-img-top" alt="Technology Partner" height="118" width="118">
                        <div class="card-body">
                            <h5 class="card-title mb-3">Want to join our Partner Program?</h5>
                            <a href="#form" class="btn btn-primary">Become a Partner</a>
                        </div>
                    </div>
                </div>
            </div>
        </Section>
        <Section title="Consulting Partners">
            <div class="row card-group mb-2">
                <div class="col-12 col-md-4 col-lg-4 mb-4">
                    <div class="card" data-aos="zoom-in">
                        <img src="/partners/partners-logos/converteo.svg" class="card-img-top" alt="Converteo's logo">
                        <div class="card-body">
                            <p class="card-text">Consulting Partner</p>
                            <h5 class="card-title">Converteo</h5>
                            <a href="https://converteo.com/en/" target="_blank">Visit Converteo website <OpenInNew /></a>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-md-4 col-lg-4 mb-4">
                    <div class="card" data-aos="zoom-in">
                        <img src="/partners/partners-logos/hanalytics.svg" class="card-img-top" alt="Converteo's logo">
                        <div class="card-body">
                            <p class="card-text">Consulting Partner</p>
                            <h5 class="card-title">Hanalytics</h5>
                            <a href="https://www.data-hanalytics.io/" target="_blank">Visit Hanalytics website <OpenInNew /></a>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-md-4 col-lg-4 mb-4">
                    <div class="card" data-aos="zoom-in">
                        <img src="/partners/partners-logos/davidson.svg" class="card-img-top" alt="Davidson's logo">
                        <div class="card-body">
                            <p class="card-text">Consulting Partner</p>
                            <h5 class="card-title">Davidson</h5>
                            <a href="https://www.davidson.group/" target="_blank">Visit Davidson website <OpenInNew /></a>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-md-4 col-lg-4 mb-4">
                    <div class="card" data-aos="zoom-in">
                        <img src="/partners/partners-logos/ntico.svg" class="card-img-top" alt="Ntico's logo">
                        <div class="card-body">
                            <p class="card-text">Consulting Partner</p>
                            <h5 class="card-title">Ntico</h5>
                            <a href="https://ntico.com/" target="_blank">Visit Ntico website <OpenInNew /></a>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-md-4 col-lg-4 mb-4">
                    <div class="card text-center" data-aos="zoom-in">
                        <img src="/partners/badge-partner.svg" class="card-img-top" alt="Badge_Kestra_Technology_Partner" height="118" width="118">
                        <div class="card-body">
                            <h5 class="card-title mb-3">Want to join our Partner Program?</h5>
                            <a href="#form" class="btn btn-primary">Become a Partner</a>
                        </div>
                    </div>
                </div>
            </div>
        </Section>
    </div>
</template>

<script setup>
    import Section from '../layout/Section.vue'
    import OpenInNew from 'vue-material-design-icons/OpenInNew.vue'
</script>

<style scoped lang="scss">
    @import "../../assets/styles/variable";

    .card-group {
        background: none !important;
        justify-content: start;

        .card {
            padding: 2rem;

            .coming-soon {
                background: $purple-18;
                padding: 0 0.5rem;
                line-height: 1.375rem;
                height: 22px;
            }

            .card-text {
                font-size: $font-size-sm;
                color: var(--bs-pink);
                font-weight: 800;
                text-transform: uppercase;
                font-family: var(--bs-font-monospace);
                display: inline;
            }

            .card-title {
                margin: 1rem 0;
            }
        }
    }
</style>