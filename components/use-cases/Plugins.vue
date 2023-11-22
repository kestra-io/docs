<template>
    <div class="d-flex flex-column align-items-center my-5">
        <h2 data-aos="fade-left" class="text-center card-title">
            Connect Your Entire Stack <br />
            with Plugins
        </h2>
        <!-- TODO: Add gradient to 'Entire Stack' -->
        <div class="d-flex justify-content-center flex-wrap plugins my-4">
            <img
                v-for="plugin in plugins"
                :src="plugin.icon"
                :alt="plugin.name"
            />
        </div>
        <div v-if="cta.text">
            <NuxtLink :href="cta.href" class="btn btn-primary">
                <!--TODO Update style -->
                {{ cta.text }}
            </NuxtLink>
        </div>
    </div>
</template>

<script>
export default {
    name: "UseCasesPlugins",
    props: {
        plugins: {
            type: Array,
            default: () => [],
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        cta: {
            type: Object,
            required: false,
            default: () => ({}),
        },
    },
};
</script>
<style scoped lang="scss">
@import "../../assets/styles/variable";

.plugins {
    max-width: $container-max-width;
}
</style>
