
<template>
    <div class="row">
        <div
            class="col-lg-4 col-md-6 col-12 mt-4 pt-2"
            v-for="(item, index) of pricingData"
            :key="index"
        >
            <div class="card pricing-rates business-rate shadow bg-light border-0 rounded">
                <div
                    class="ribbon ribbon-right ribbon-warning overflow-hidden"
                    v-if="item.isBest"
                >
                    <span class="text-center d-block shadow small h6">Soon</span>
                </div>
                <div class="card-body">
                    <h6 class="title font-weight-bold text-uppercase text-primary mb-4">
                        {{ item.title }}
                    </h6>
                    <div class="price h1 text-muted">
                        {{ item.price }}
                    </div>

                    <ul class="list-unstyled mb-0 pl-0">
                        <li
                            v-for="(feature, index) in item.feature"
                            class="h6 text-muted mb-0"
                            :key="index"
                        >
                            <CheckCircleOutline class="text-success mr-2" title="" />
                            {{ feature }}
                        </li>
                    </ul>
                    <div class="text-center">
                        <a href="javascript:void(0)" class="btn btn-primary mt-4">
                            {{ item.button }}
                        </a>
                    </div>
                </div>
            </div>
        </div>
        <!--end col-->
    </div>
</template>

<script>
import CheckCircleOutline from 'vue-material-design-icons/CheckCircleOutline'

export default {
    components: {
        CheckCircleOutline
    },
    data() {
        return {
            pricingData: [
                {
                    title: "Open Source",
                    price: "Always free",
                    feature: [
                        "Scalable orchestrator",
                        "Scalable scheduler",
                        "Rich user interface",
                        "Plugins ecosystem",
                        "Extended Api",
                        "Terraform integration",
                        "No limitations on usage"
                    ],
                    button: "Getting started",
                },
                {
                    title: "Entreprise Edition",
                    price: "Custom pricing",
                    feature: [
                        "Open Source Edition",
                        "Authentification with OIDC / SSO",
                        "Fined grained Role Based Access control",
                        "Namespace configuration & security",
                        "Integration with secret manager",
                        "Audits logs",
                        "Editor autocompletion",
                        "Execution dashboard",
                        "Worker security isolation",
                    ],
                    button: "Contact us",
                },
                {
                    title: "Kestra Cloud",
                    price: "Coming soon",
                    feature: [
                        "Enterprise Edition",
                        "Fully managed by Kestra Expert",
                        "Transparent upgrade",
                        "Available on multiple cloud provider & region",
                        "Bring your own cloud",
                    ],
                    button: "Request early access",
                    isBest: true,
                },
            ],
        };
    },
};
</script>

<style lang="scss" scoped>

@import '../styles/variables';


.pricing-rates {
    position: relative;
    z-index: 1;
    border-bottom: 3px solid $tertiary !important;
    -webkit-transition: all 0.5s ease;
    transition: all 0.5s ease;

    &:hover {
        transform: scale(1.03);
        z-index: 2;
        border-color: $secondary !important;
        box-shadow: 0 5px 13px rgba(60, 72, 88, 0.2) !important;
    }

    .price {
        font-weight: 400;
    }

    ul li {
        padding-left: 30px;
        .material-design-icon {
            position: relative;
            margin-left: -30px;
        }
    }
}

</style>
