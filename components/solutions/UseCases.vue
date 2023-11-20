<template>
    <div class="container mb-5">
        <Section :title="title" :subtitle="subtitle">
            <div class="row">
                <div
                    v-for="_case in cases"
                    class="col-md-4"
                    data-aos="fade-right"
                >
                    <NuxtLink :href="_case.link">
                        <img
                            class="img-fluid"
                            :src="_case.img"
                            :alt="_case.title"
                        />
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

.container .row > div {
    position: relative;
    h4 {
        font-weight: bold;
        color: var(--bs-black);
    }

    img {
        width: 100%;
        margin-bottom: 1rem;
        background: $light-cyan;
        border-radius: $border-radius;
        padding: calc($spacer / 2);
    }

    .badge {
        position: absolute;
        top: 0.625rem;
        right: 1.5rem;
    }

    p {
        color: var(--bs-gray-900);
    }
}
</style>
