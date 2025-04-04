<template>
    <div class="container my-5 pt-5 text-center discover-cloud">
        <div class="row">
            <div class="col-md-12 col-lg-5 center">
                <img src="./images/discover_cloud.png" />
            </div>
            <div class="col-md-12 col-lg-7">
                <h2 class="highlight">Discover Kestra Cloud</h2>
                <p>
                    Join Kestra Cloud Early Adopter Program to unlock full,
                    hands-on access to Kestra Cloud. Enjoy a fully managed
                    platform and personalized support.
                </p>
                <button class="btn btn-primary mt-3">
                    Request Access to Kestra Cloud
                </button>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
@import "../../assets/styles/variable";

.discover-cloud {
    border: 1px solid #282d43;
    border-radius: 1rem;

    & > div,
    .center {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    & h2 {
        font-size: $font-size-3xl;
    }

    & p {
        font-size: $font-size-lg !important;
    }

    .highlight {
        background: linear-gradient(90deg, #51cff7 57.35%, #4782f5 95.94%);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        color: transparent;
    }
}
</style>
