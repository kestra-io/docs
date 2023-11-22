<template>
    <div class="container hero header" data-aos="fade-right">
        <div class="row">
            <h1>Orchestrate Your <br />Retail Ecosystem <br />with Kestra</h1>
            <!-- TODO: Add gradient to 'Retail Ecosystem' -->
            <p>
                {{ description }}
            </p>
            <div class="d-flex flex-wrap gap-2">
                <template v-if="cta.length" v-for="action in cta">
                    <NuxtLink :href="action.href">
                        <button class="btn btn-lg" :class="action.style">
                            {{ action.text }}
                        </button>
                    </NuxtLink>
                </template>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: "UseCaseHeaderCard",

    props: {
        icon: {
            type: Object,
            required: false,
            default: () => ({}),
        },
        description: {
            type: String,
            required: true,
        },
        cta: {
            type: Array,
            required: true,
        }
    },
};
</script>
<style scoped lang="scss">
@import "../../assets/styles/variable";
.header {
    //# TODO: background: url('') no-repeat center;
    p {
        font-size: $font-size-xl;
    }
    padding-top: 8rem;
    padding-bottom: 0;
}
</style>
