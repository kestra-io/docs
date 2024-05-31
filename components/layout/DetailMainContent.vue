<template>
    <div class="container">
        <Section
            :subtitle="subtitle"
            :subtitle-after="subtitleAfter"
            :subtitle-before="subtitleBefore"
            :baseline="baseline"
        >
            <template v-for="(item, index) in items">
                <div v-if="index % 2 !== 0" class="row feature-img-right position-relative py-4">
                    <div class="col-md-6 ps-2 ps-sm-5 pe-2 ps-sm-5 order-1 order-md-0 d-flex flex-column justify-content-center" data-aos="fade-left">
                        <h3>{{ item.title }}</h3>
                        <div class="content" v-html="item.content" />
                    </div>
                    <div class="col-md-6 order-0 order-md-1" data-aos="fade-right">
                        <NuxtImg :width="item.imgWidth" :height="item.imgHeight" loading="lazy"  class="img-fluid" :src="item.img" :alt="item.imgAlt" />
                    </div>
                </div>

                <div v-else class="row feature-img-left position-relative py-4">
                    <div class="col-md-6" data-aos="fade-right">
                        <NuxtImg :width="item.imgWidth" :height="item.imgHeight" loading="lazy"  class="img-fluid" :src="item.img" :alt="item.imgAlt" />
                    </div>
                    <div class="col-md-6 ps-2 ps-sm-5 pe-2 ps-sm-5 d-flex flex-column justify-content-center" data-aos="fade-left">
                        <h3>{{ item.title }}</h3>
                        <p v-if="item.description">{{ item.description }}</p>
                        <div class="content" v-html="item.content" />
                    </div>
                </div>
            </template>
        </Section>
    </div>
</template>

<script>
    import Section from './Section.vue';
    export default {
        components: {Section},
        props: {
            subtitle: {
                type: String,
                required: false,
            },
            subtitleAfter: {
                type: String,
                required: false,
            },
            subtitleBefore: {
                type: String,
                required: false,
            },
            baseline: {
                type: String,
                required: false,
            },
            items: {
                type: Array,
                required: false,
            },
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";
    :deep(section) {
        .baseline {
            color: $white;
            font-size: $h6-font-size;
            font-weight: 300;
        }
    }

    h3, p {
        color: $white;
        font-family: $font-family-sans-serif;
        font-weight: 300;
    }

    h3 {
        font-size: $h2-font-size;
        margin-bottom: $rem-1;
    }

    .content {
        font-size: $font-size-md;
        color: $white;

        :deep(ul) {
            display: flex;
            flex-direction: column;
            gap: $spacer;
            li {
                color: $white;
                font-weight: 400;
                span {
                    color: $white-1;
                    font-weight: 300;

                    a {
                        color: $purple-35;
                        text-decoration: underline;
                    }
                }
            }
        }
    }

    .feature-img {
        &-left, &-right {
            &::before {
                content: "";
                position: absolute;
                width: 100%;
                height: 100%;
                z-index: -2;
            }
        }

        &-left::before {
            background: url("/landing/usecases/cdc/feature-grow.svg") no-repeat left;
            background-size: 35% 100%;

            @include media-breakpoint-down(lg) {
                background-size: 60% 100%;
                top: -25%;
                left: -11%;
            }

            @include media-breakpoint-down(md) {
                background-size: 100% 80%;
                top: -20%;
                left: -15%;
            }
        }

        &-right::before {
            background: url("/landing/usecases/cdc/feature-grow.svg") no-repeat right;
            background-size: 32% 100%;
            right: 17%;

            @include media-breakpoint-down(lg) {
                background-size: 60% 100%;
                top: -13%;
                right: -3%;
            }

            @include media-breakpoint-down(md) {
                background-size: 100% 80%;
                top: -20%;
                right: 3%;
            }
        }
    }
</style>