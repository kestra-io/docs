<template>
    <div class="container-fluid bg-dark-4">
        <div class="container">
            <div class="cloud-cards">
                <Card
                    :icon="RocketLaunch"
                    titleHtml="Get started </br> In minutes"
                />
                <Card
                    :icon="CreditCardOff"
                    titleHtml="Sign up for free </br> No credit card required"
                />
                <Card
                    :icon="CloudCheck"
                    titleHtml="Fully-managed </br> Infrastructure"
                />
            </div>
        </div>
    </div>
</template>

<script setup>
  import RocketLaunch from "vue-material-design-icons/RocketLaunch.vue"
  import CreditCardOff from "vue-material-design-icons/CreditCardOff.vue"
  import CloudCheck from "vue-material-design-icons/CloudCheck.vue"
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .container-fluid {
        position: relative;
        &::before {
            content: "";
            position: absolute;
            width: calc($spacer * 11);
            height: calc($spacer * 11);
            background: linear-gradient(180deg, rgba(98, 24, 255, 0) 0%, #6117FF 100%);
            filter: blur(82px);
            z-index: 5;
            left: 50%;
            top: -5rem;

            @include media-breakpoint-down(lg) {
                left: 35%;
                top: 50%;
            }
        }
    }
    .cloud-cards {
        padding: calc($spacer * 2) 0 calc($spacer * 5.6);
        display: flex;
        justify-content: center;
        gap: calc($spacer * 1.8);
        position: relative;
        z-index: 6;

        :deep(.title-block) {
            align-items: center;
        }

        :deep(.card) {
            width: 100%;
            height: unset;
        }

        @include media-breakpoint-down(lg) {
            flex-direction: column;
            align-items: center;

            :deep(.card) {
                width: 60%;
            }
        }

        @include media-breakpoint-down(md) {
            :deep(.card) {
                width: auto;
                min-width: 100%;
            }
        }
    }
</style>
