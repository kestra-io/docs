<template>
    <div class="container base-container mt-5">
        <h3
            data-aos="fade-left"
            class="title fw-light pb-3"
            v-html="content.title"
        ></h3>
        <CardGroup :content="content" />
    </div>
</template>

<script>
import CardGroup from "~/components/write-for-us/CardGroup.vue";

export default {
    name: "Process",

    components: { CardGroup },

    props: {
        content: {
            type: Object,
            required: true,
            default: () => ({
                title: "",
                items: [],
            }),
        },
    },
};
</script>

<style scoped lang="scss">
@import "../../assets/styles/variable";

.base-container {
    max-width: $width-800;
}
</style>
