<template>
    <div class="container example">
        <h1 data-aos="fade-left" class="title text-center mb-5 fw-light">
            Use Cases in <span>Retail</span>
        </h1>
        <div class="row card-group card-centered no-shadow mb-2">
            <template v-for="(item, index) in items">
                <div class="col-md-4 mb-4">
                    <div
                        class="card"
                        :class="index === 1 && 'mask'"
                        data-aos="zoom-in"
                    >
                        <div class="card-body">
                            <img
                                :src="item.icon"
                                :alt="item.title"
                                class="icon mb-2"
                            />
                            <h4 class="card-title fw-light">
                                {{ item.title }}
                            </h4>
                            <p class="card-text fw-light">{{ item.text }}</p>
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
export default {
    name: "Examples",

    props: {
        items: {
            type: Array,
            required: true,
        },
    },
};
</script>

<style scoped lang="scss">
@import "../../assets/styles/variable";

.container {
    background: #111113 url("/assets/retail/header-mask.svg") center;
}

.card {
    background: $black-2;
    color: white;
    box-shadow: none !important;

    .card-body {
        padding: 3rem 2rem 3rem 2rem;
        background: $black-2;

        p {
            font-size: $font-size-sm;
            line-height: 1.375rem;
        }
    }
    &-title {
        font-size: $font-size-xl !important;
        line-height: 2rem;
    }
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

.mask {
    &::after {
        content: "";
        position: absolute;
        height: 272px;
        width: 176px;
        bottom: -80px;
        right: -96px;
        background: linear-gradient(
            180deg,
            rgba(98, 24, 255, 0) 0%,
            #6117ff 100%
        );
        filter: blur(100px);
        z-index: -1;
    }
}
</style>
