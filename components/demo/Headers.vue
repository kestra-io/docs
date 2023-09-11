<template>
  <div class="container-fluid">
        <div class="hero container">
            <div class="row">
                <div class="col-12 col-md-5 position-relative">
                    <img class="img-fluid" src="/demo/background.svg" alt="Illustration of Kestra's logo with a dark background" data-aos="zoom-in"/>
                    <div class="schedule-demo position-absolute">
                        <div class="subtitle">SCHEDULE A DEMO</div>
                        <h1>Ready to See Kestra in Action?</h1>
                        <p class="description">Connect with one of our Product Specialist to get the best out of our product and its value proposition</p>
                    </div>
                </div>
                <div class="col-12 col-md-6 align-items-center d-flex">
                    <div class="card">
                        <div class="card-body">
                            <div class="card-text hs-form-text">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="container text-center">
            <p class="companies-title" data-aos="zoom-in">
                Loved & trusted by leading enterprises worldwide
            </p>
        </div>
        <div class="container-fluid pt-4 pb-4">
            <Companies />
        </div>
    </div>
</template>

<script setup>
import Companies from "../layout/Companies.vue";

onMounted(() => {
    const newForm = hbspt.forms.create({ region: "eu1", portalId: "27220195", formId: "d8175470-14ee-454d-afc4-ce8065dee9f2" })
    const hsForm = document.getElementById(`hbspt-form-${newForm.instanceId}`)
    const cardText = document.getElementsByClassName("hs-form-text").item(0)
    const currentParent = hsForm.parentNode;
    currentParent.removeChild(hsForm);
    cardText.appendChild(hsForm);
})
</script>

<style scoped lang="scss">
@import "../../assets/styles/variable";
.container-fluid {
    background: $purple-16;
    color: var(--bs-white);
    overflow: hidden;

    .hero {
        padding-top: 4rem !important;
        .card {
            box-shadow: none !important;
            width: 100%;
        }
        .schedule-demo {
            top: 50%;
            left: 10%;
            right: 10%;

            h1 {
                padding-bottom: 0 !important;
                line-height: 4rem;
            }
            div.subtitle {
                font-size: $font-size-xl;
                color: var(--bs-pink);
                font-weight: 700;
                text-transform: uppercase;
                font-family: var(--bs-font-monospace);
                display: inline;
                line-height: 1.875rem;
            }
            p.description {
                line-height: 2rem;
                font-size: $font-size-xl;
                width: 85%;
            }
        }

        .img-fluid {
            max-height: 100%;
            max-width: 100%;
        }
    }

    .companies-title {
        position: relative;

        &:after {
            content: '';
            position: absolute;
            left: 50%;
            bottom: calc(-1 * var(--spacer));
            transform: translateX(-50%);
            display: inline-block;
            height: 2px;
            width: 51px;
            background: var(--bs-pink);
        }
    }
    
    @include media-breakpoint-down(lg) {
        .schedule-demo {
           position: relative !important;
           inset: 0 !important;
        }
    }
}
</style>