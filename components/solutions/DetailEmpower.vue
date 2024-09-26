<template>
    <div class="section">
        <div class="container-fluid">
            <div class="container">
                <NuxtImg
                    width="164px"
                    height="163px"
                    loading="lazy"
                    format="webp"
                    class="img-fluid"
                    src="/landing/usecases/cicd/monograme.svg"
                    alt="Monograme"
                />
                <h2 data-aos="fade-left">{{ title }}</h2>
                <p class="text-center" data-aos="fade-right">{{ subtitle }}</p>
                <div class="text-center cta">
                    <NuxtLink href="/docs/getting-started/quickstart#start-kestra" class="btn btn-animated btn-purple-animated" data-aos="zoom-in">
                        Get started
                    </NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            title: {
                type: String,
                required: false,
            },
            subtitle: {
                type: String,
                required: false,
            },
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .container {
        max-width: 50rem;
    }

    .section {
        color: $white;
        padding-top: $rem-2;
        padding-bottom: $rem-2;
        text-align: center;
        border-radius: 8px;
        background: $black-2 url("/landing/usecases/cicd/empower-bg.svg") no-repeat;

        .main {
            padding-top: 0;
        }

        h2 {
            font-size: $h3-font-size;
            font-weight: 600;
            margin-bottom: 16px;
        }
    }
</style>
