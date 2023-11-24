<template>
    <div class="container d-flex flex-column align-items-center my-5">
        <h1 data-aos="fade-left" class="title text-center card-title fw-light">
            Connect Your <span>Entire Stack</span> <br />
            with Plugins
        </h1>
        <div data-aos="fade-right" class="d-flex justify-content-center flex-wrap plugins my-4 gap-4">
            <img
                v-for="plugin in content.items"
                :src="plugin.icon"
                :alt="plugin.name"
            />
        </div>
        <div class='mt-5'>
            <NuxtLink :href="content.cta.href" class="btn btn-dark">
                {{ content.cta.text }}
            </NuxtLink>
        </div>
    </div>
</template>

<script>
export default {
    name: "Plugins",
    props: {
        content: {
            type: Object,
            required: true,
            default: () => ({
                items: [],
                title: '',
                cta: {},

            })
        }
    },
};
</script>
<style scoped lang="scss">
@import "../../assets/styles/variable";

.plugins {
    max-width: $container-max-width;
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
.btn-dark{
    --bs-btn-bg: $black-4 ;
    --bs-btn-hover-bg : $black-4;
    border: 1px solid $black-6;
}
.container {
    background: #111113 url("/assets/retail/header-mask.svg") center;
}
</style>
