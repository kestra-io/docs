<template>
    <div class="container mb-5">
        <Section
            :subtitle="subtitle"
            :subtitle-after="subtitleAfter"
        >
            <div class="row">
                <div
                    v-for="_case in cases"
                    class="col-md-4"
                    data-aos="fade-right"
                >
                    <NuxtLink :href="_case.link" class="d-flex flex-column gap-2">
                        <div class="img-block bg-dark-2">
                            <img
                                class="img-fluid"
                                :src="_case.img"
                                :alt="_case.title"
                            />
                        </div>
                        <h4 class="title">{{ _case.title }}</h4>
                        <p>{{ _case.description }}</p>
                    </NuxtLink>
                </div>
            </div>
        </Section>
    </div>
</template>

<script>
import Section from "~/components/layout/Section.vue";
import useCases from "~/data/use-cases.js";

export default {
    components: { Section },
    data: () => ({
        ...useCases,
    }),
};
</script>

<style lang="scss" scoped>
@import "../../assets/styles/variable";

.container {
    :deep(section) {
        .subtitle {
            max-width: 70%;

            @include media-breakpoint-down(lg) {
                max-width: 100%;
            }
        }
    }

    .row > div {
        position: relative;
    }

    h4 {
        font-size: $h5-font-size;
        font-weight: 700;
    }

    p {
        font-size: $font-size-md;
        font-weight: 400;
    }

    h4, p {
        color: $white;
        font-family: $font-family-sans-serif;
        font-style: normal;
        margin: 0;
    }

    .img-block {
        border-radius: 8px;
        border: $block-border;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 192.01px;
    }
}
</style>
