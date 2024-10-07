<template>
    <div class="container hero header" data-aos="fade-right">
        <div class="row header-content">
            <div class="col-md-6">
                <h1 class="title " v-html="content.tag"></h1>
                <p class="description fw-light pb-4">
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
            <div
                class="col-lg-6 image"
                :class="content.image.style"
                data-aos="zoom-in"
            >
                <NuxtImg
                    :width="content.image.width"
                    :height="content.image.height"
                    loading="lazy"
                    format="webp"
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
    background: url("/retail/header-mask.svg") no-repeat center;
    p {
        font-size: $font-size-xl;
    }
    padding-top: $rem-8;
    padding-bottom: 0;
    @include media-breakpoint-down(sm) {
        padding-top: $rem-4;
    }

    .header-content {
        @include media-breakpoint-down(md) {
            flex-direction: column-reverse;
        }
    }
}

.title {
    font-size: $h1-font-size;
    font-weight: 500;
}

.title-sm {
    font-size: $h2-font-size;
}

.description {
    padding-bottom: $rem-2;
}

.btn-dark {
    --bs-btn-bg: $black-4;
    --bs-btn-hover-bg: $black-4;
    border: 1px solid $black-6;
}

.image {
    &-retail {
        margin-top: -176px;
    }

    &-community {
        margin-top: -80px;
    }
    @include media-breakpoint-down(lg) {
        margin-top: 0;
    }
}

.hero{
    padding-bottom: 0rem;
    @include media-breakpoint-down(md) {
        padding-top: 0;
    }
}

</style>
