<template>
    <div class="container mt-5">
        <h1 data-aos="fade-right" class="title text-center card-title mb-3">
            End-To-End Solution for Managing <br />
            <span>Complex</span> Retail Operations
        </h1>
        <p class="description">{{ content.description }}</p>

        <div class="row m-0 content my-4">
            <template v-for="item in content.items">
                <div class="col-md-6 my-4">
                    <div class="d-flex">
                        <div class="icon">
                            <img :src="item.icon" :alt="item.title" />
                        </div>
                        <div>
                            <h4 class="card-title mb-2">{{ item.title }}</h4>
                            <p>{{ item.text }}</p>
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
export default {
    name: "RetailOps",
    props: {
        content: {
            type: Object,
            required: true,
            default: () => ({
                header: "",
                description: "",
                items: [],
            }),
        },
    },
};
</script>

<style scoped lang="scss">
@import "../../assets/styles/variable";

.description {
    text-align: center;
    font-size: $font-size-lg;
    max-width: $container-max-width;
    margin: $spacer auto 0;
    font-weight: 300;
}

.container {
    position: relative;
    z-index: 99;

    .heading {
        max-width: 800px;
    }

    > div {
        h6 {
            font-weight: normal;
            line-height: 1.625rem;
        }
    }

    &::after {
        content: "";
        position: absolute;
        height: 266.493px;
        width: 170.248px;
        background: url("/retail/solutions/light-mask.svg") no-repeat;
        bottom: -70px;
        right: -100px;
        z-index: -1;
        background: linear-gradient(
            180deg,
            rgba(98, 24, 255, 0) 0%,
            #6117ff 100%
        );
        filter: blur(100px);
    }
}
.content {
    background: $black-2;
    padding: calc($spacer * 2.375) calc($spacer * 3);
    border-radius: 8px;

    &::before {
        content: "";
        position: absolute;
        width: 228px;
        height: 480px;
        background: url("/retail/solutions/light-mask.svg") no-repeat;
        bottom: 0;
        left: 14px;
        z-index: 1;
        border-radius: 8px;
    }
}
.title {
    font-weight: 300;
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
.card-title {
    font-weight: 300;
}

.icon {
    margin-right: 1rem;
    height: 100px;
}
</style>
