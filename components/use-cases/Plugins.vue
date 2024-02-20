<template>
    <div ref="container" class="container-fluid bg-dark-4">
        <div class="container">
            <div class="mb-5">
                <h1 data-aos="fade-left" class="title text-center card-title fw-light">
                    Connect Your <span>Entire Stack</span> <br />
                    with Plugins
                </h1>
                <LayoutPlugins />
            </div>
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
                title: "",
                cta: {},
            }),
        },
    },
};
</script>

<style scoped lang="scss">
@import "../../assets/styles/variable";

.plugins {
    max-width: $container-max-width;
}

.title {
    font-size: $font-size-3xl;
    span {
        background: var(
            --Text_gradient,
            linear-gradient(90deg, #e151f7 2%, #5c47f5 65%)
        );
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
}

.btn-dark {
    --bs-btn-bg: $black-4;
    --bs-btn-hover-bg: $black-4;
    border: 1px solid $black-6;
}

.container-fluid {
    background: url("/landing/home/plugins/background.svg") no-repeat center;
    color: var(--bs-white);
    padding: 0;

    .container {
        padding: 4rem 0;
        border-bottom: $block-border;
        border-top: $block-border;
    }
}

</style>
