<template>
    <div class="container hero header" data-aos="fade-right">
        <div class="row">
            <div class="col-md-6">
                <h1 class="title fw-light">
                    Orchestrate Your <br /><span>Retail Ecosystem</span>
                    <br />with Kestra
                </h1>

                <p class="description fw-light">
                    {{ content.description }}
                </p>
                <div class="d-flex flex-wrap gap-2">
                    <template
                        v-if="content.cta.length"
                        v-for="action in content.cta"
                    >
                        <NuxtLink :href="action.href" :target="action.target">
                            <button class="btn" :class="action.style">
                                {{ action.text }}
                            </button>
                        </NuxtLink>
                    </template>
                </div>
            </div>
            <div class="col-lg-6" data-aos="zoom-in">
                <img
                    class="zoom img-fluid"
                    :src="content.image.href"
                    :alt="content.image.alt"
                />
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: "RetailCard",

    props: {
        content: {
            type: Object,
            required: true,
            default: () => ({
                description: "",
                cta: [],
                icon: {},
                image: {},
                background: "",
            }),
        },
    },
};
</script>
<style scoped lang="scss">
@import "../../assets/styles/variable";
.header {
    background: url("/assets/retail/header-mask.svg") no-repeat center;
    p {
        font-size: $font-size-xl;
    }
    padding-top: 8rem;
    padding-bottom: 0;
}

.title {
    font-size: $h1-font-size;
    span {
        background: var(
            --Text_gradient,
            linear-gradient(90deg, #e151f7 2.16%, #5c47f5 65.09%)
        );
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
}
.description {
    padding-bottom: 2rem;
}
.btn-dark {
    --bs-btn-bg: $black-4;
    --bs-btn-hover-bg: $black-4;
    border: 1px solid $black-6;
}
</style>
