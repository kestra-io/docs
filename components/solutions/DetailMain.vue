<template>
    <div class="container">
        <Section
            :subtitle="subtitle"
            :subtitle-after="subtitleAfter"
            :subtitle-before="subtitleBefore"
            :baseline="baseline"
        >
            <template v-for="(item, index) in items">
                <div v-if="index % 2 !== 0" class="row mb-5">
                    <div class="col-md-6 ps-5 pe-5 order-1 order-md-0 d-flex flex-column justify-content-center" data-aos="fade-left">
                        <h3>{{ item.title }}</h3>
                        <p v-html="item.content" />
                    </div>
                    <div class="col-md-6 order-0 order-md-1" data-aos="fade-right">
                        <img class="img-fluid" :src="item.img" :alt="item.imgAlt" />
                    </div>
                </div>

                <div v-else class="row mb-5">
                    <div class="col-md-6" data-aos="fade-right">
                        <img class="img-fluid" :src="item.img" :alt="item.imgAlt" />
                    </div>
                    <div class="col-md-6 ps-5 pe-5 d-flex flex-column justify-content-center" data-aos="fade-left">
                        <h3>{{ item.title }}</h3>
                        <p v-html="item.content" />
                    </div>
                </div>
            </template>
        </Section>
    </div>
</template>

<script>
    import Section from '../layout/Section.vue';
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

    p {
        font-size: $font-size-md;
    }
</style>