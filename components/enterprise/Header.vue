<template>
    <div class="container-fluid">
        <div class="hero container">
            <div class="row">
                <div class="col-md-6">
                    <p class="overline">Enterprise Edition</p>
                    <h1>Kestra Enterprise Edition for Scaling companies<span class="dot">.</span></h1>
                    <p class="baseline">Get full access of all the Open source features and unlock the full potential with Enterprise only features</p>
                    <a href="https://meetings-eu1.hubspot.com/quentin-sinig/meeting-link-demo" target="_blank" class="btn btn-lg btn-primary me-2 mb-2">
                        Book a demo
                    </a>
                    <NuxtLink href="/contact-us" class="btn btn-lg btn-dark mb-2">
                        Contact us
                    </NuxtLink>
                </div>
                <div class="col-md-6">
                    <img class="img-fluid" src="/landing/ee/background.svg" alt="Illustration of Kestra's logo with a dark background"/>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .container-fluid {
        background: $purple-7;
        color: var(--bs-white);

        .baseline {
            font-size: 1.15rem;
        }
    }
</style>