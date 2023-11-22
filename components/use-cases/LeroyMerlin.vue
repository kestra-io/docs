<template>
    <div class="leroy-container">
        <div class="container hero header" data-aos="fade-right">
            <div class="row">
                <div>
                    <img :src="icon" :alt="alt" />
                </div>
                <p class="fs-4">
                    Leroy Merlin France enabling data <br />mesh architecture
                    and 900% <br />
                    increase in productivity with Kestra:<br />
                </p>
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
    </div>
</template>
<script>
export default {
    name: "UseCaseLeroyMerlin",

    props: {
        icon: {
            type: String,
            required: true,
        },
        alt: {
            type: String,
            required: true,
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
    p {
        font-size: $font-size-xl;
    }
}
.leroy-container {
    //TODO add correct background : background: url('') no-repeat center;
}
</style>
