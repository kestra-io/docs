<template>
    <div class="container justify-content-center">
        <div class="text-center rounded content">
            <div>
                <h1 class="title fw-light" data-usal="fade-r">
                    {{ content.title }}
                </h1>
                <div class="d-flex gap-2 flex-wrap justify-content-center align-items-center mt-4">
                    <template v-for="action in content.cta">
                        <a :href="action.href" :target="action.target">
                            <button class="btn" :class="action.style">
                                {{ action.text }}
                            </button>
                        </a>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Footer",

        props: {
            content: {
                type: Object,
                required: true,
                default: () => ({
                    title: "",
                    cta: [],
                }),
            },
        },
    }
</script>

<style scoped lang="scss">
    @import "~/assets/styles/variable";

    .container {
        margin-bottom: 4rem;
    }

    .content {
        background-color: $black-2;
        padding: calc($spacer * 2.375) calc($spacer * 1);
        border-radius: 8px;
        overflow: hidden;
        position: relative;
        z-index: 10;
        &::before {
            content: "";
            position: absolute;
            width: 262px;
            height: 170px;
            background: url("/retail/light-mask2.svg");
            right: 0;
            top: 0;
            z-index: 1;
        }
    }

    .btn-dark {
        --bs-btn-bg: $black-4;
        --bs-btn-hover-bg: $black-4;
        border: 1px solid $black-6;
    }

    .title {
        font-size: $h3-font-size;
    }
</style>