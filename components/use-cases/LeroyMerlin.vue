<template>
    <div class="leroy-container">
        <div class="container hero header" data-aos="fade-right">
            <div class="row">
                <div class="col-md-6">
                    <div>
                        <img :src="content.logo.href" :alt="content.logo.alt" />
                        <p class="my-3 subtitle">{{ content.logo.subtitle }}</p>
                    </div>
                    <h4 class="title leroy-title">
                        Leroy Merlin France enabling data <br />mesh
                        architecture and 900% <br />
                        increase in productivity with Kestra:<br />
                    </h4>
                    <p class="description my-4">
                        {{ content.description }}
                    </p>
                    <div class="d-flex flex-wrap gap-2">
                        <NuxtLink :href="content.cta.href">
                            <button
                                class="btn btn-dark"
                                :class="content.cta.style"
                            >
                                {{ content.cta.text }}
                            </button>
                        </NuxtLink>
                    </div>
                </div>

                <div class="col-lg-6">
                    <img
                        class="zoom img-fluid"
                        :src="content.image.href"
                        :alt="content.image.alt"
                    />
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: "LeroyMerlin",

    props: {
        content: {
            type: Object,
            required: true,
            default: () => ({
                description: "",
                cta: [],
                logo: {},
                image: {},
                background: "",
            }),
        },
    },
};
</script>
<style scoped lang="scss">
@import "../../assets/styles/variable";
.subtitle {
    font-size: $font-size-base;
}
.leroy-container {
    position: relative;
    &::after {
        content: "";
        position: absolute;
        height: 272px;
        width: 176px;
        background: url("/retail/grey-mask.svg") no-repeat;
        top: 48px;
        left: 256px;
        z-index: 1;
        filter: blur(100px);
        background: linear-gradient(180deg, rgba(24, 172, 255, 0.00) 0%, #17FF58 100%);
    }
}
.leroy-merlin {
    background: #0d0d0c;
    background: url("/retail/grey-mask.svg") no-repeat;
}
.leroy-title {
    background: url("/assets/retail/header-mask.svg") no-repeat center;
    font-size: $h3-font-size;
    font-weight: 300;
}
.description {
    font-weight: 300;
    font-size: $font-size-lg;
}
.btn-dark{
    --bs-btn-bg: $black-4 ;
    --bs-btn-hover-bg : $black-4;
    border: 1px solid $black-6;
}
</style>
