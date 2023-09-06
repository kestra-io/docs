<template>
    <div class="container">
        <Section title="Technologies Partners">
            <div class="row card-group mb-2">
                <div class="col-12 col-md-4 col-lg-4 mb-4">
                    <div class="card" data-aos="zoom-in">
                        <img src="/partners/partners-logos/airbytelogo.svg" class="card-img-top" alt="airbytelogo">
                        <div class="card-body">
                            <p class="card-text">Technology Partner</p>
                            <h5 class="card-title">Airbyte</h5>
                            <a href="#">Visit the Airbyte website <OpenInNew /></a>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-md-4 col-lg-4 mb-4">
                    <div class="card" data-aos="zoom-in">
                        <img src="/partners/partners-logos/dlthublogo.svg" class="card-img-top" alt="dlthublogo">
                        <div class="card-body">
                            <p class="card-text">Technology Partner</p>
                            <h5 class="card-title">dlthub</h5>
                            <a href="#">Visit the dlthub website <OpenInNew /></a>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-md-4 col-lg-4 mb-4">
                    <div class="card" data-aos="zoom-in">
                        <img src="/partners/partners-logos/terraformlogo.svg" class="card-img-top" alt="terraformlogo">
                        <div class="card-body">
                            <p class="card-text">Technology Partner</p>
                            <h5 class="card-title">Terraform</h5>
                            <div class="coming-soon d-inline-block rounded text-white">Coming soon...</div>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-md-4 col-lg-4 mb-4">
                    <div class="card" data-aos="zoom-in">
                        <img src="/partners/partners-logos/databrickslogo.svg" class="card-img-top" alt="databrickslogo">
                        <div class="card-body">
                            <p class="card-text">Technology Partner</p>
                            <h5 class="card-title">Databricks</h5>
                            <div class="coming-soon d-inline-block rounded text-white">Coming soon...</div>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-md-4 col-lg-4 mb-4">
                    <div class="card text-center">
                        <img src="/partners/Badge_Kestra_Technology_Partner.svg" class="card-img-top" alt="Badge_Kestra_Technology_Partner" height="118" width="118">
                        <div class="card-body">
                            <h5 class="card-title mb-3">Want to be listed as a Kestra Partner?</h5>
                            <button class="btn btn-primary">Become a Technology Partner</button>
                        </div>
                    </div>
                </div>
            </div>
        </Section>
        <Section title="Services Partners">
            <div class="row card-group mb-2">
                <div class="col-12 col-md-4 col-lg-4 mb-4">
                    <div class="card" data-aos="zoom-in">
                        <img src="/partners/partners-logos/converteologo.svg" class="card-img-top" alt="converteologo">
                        <div class="card-body">
                            <p class="card-text">Service Partner</p>
                            <h5 class="card-title">Converteo</h5>
                            <a href="#">Visit the Converteo website <OpenInNew /></a>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-md-4 col-lg-4 mb-4">
                    <div class="card" data-aos="zoom-in">
                        <img src="/partners/partners-logos/nticologo.svg" class="card-img-top" alt="nticologo">
                        <div class="card-body">
                            <p class="card-text">Service Partner</p>
                            <h5 class="card-title">Ntico</h5>
                            <div class="coming-soon d-inline-block rounded text-white">Coming soon...</div>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-md-4 col-lg-4 mb-4">
                    <div class="card text-center">
                        <img src="/partners/Badge_Kestra_Technology_Partner.svg" class="card-img-top" alt="Badge_Kestra_Technology_Partner" height="118" width="118">
                        <div class="card-body">
                            <h5 class="card-title mb-3">Want to be listed as a Kestra Partner?</h5>
                            <button class="btn btn-primary">Become a Technology Partner</button>
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