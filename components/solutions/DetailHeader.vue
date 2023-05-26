<template>
    <div class="container-fluid">
        <div class="hero hero-sm container">
            <div class="row">
                <div class="col-lg-6 align-items-center d-flex">
                    <div>
                        <h1 data-aos="fade-right">{{ title }}</h1>
                        <p data-aos="fade-left" class="baseline">{{ subtitle }}</p>
                        <NuxtLink href="/docs/getting-started" class="btn btn-lg btn-primary" data-aos="zoom-in">
                            Get started
                        </NuxtLink>
                    </div>
                </div>
                <div class="col-lg-6">
                    <img class="mt-5 mt-md-0" data-aos="zoom-in" :src="image" :alt="title" />
                </div>
            </div>
        </div>
        <div class="container container-white mb-4" data-aos="zoom-in">
            <h5>{{ detailTitle }}</h5>
            <span>{{ detailContent }}</span>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            title: {
                type: String,
                required: true,
            },
            subtitle: {
                type: String,
                required: true,
            },
            image: {
                type: String,
                required: true,
            },
            detailTitle: {
                type: String,
                required: true,
            },
            detailContent: {
                type: String,
                required: true,
            },
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .container-fluid {
        background: $light-cyan;
        padding-top: 80px;
        margin-top: -80px;
        padding-bottom: $spacer;
    }

    .container-white {
        background-color: white;
        font-size: small;
        padding: $spacer;
    }


</style>
