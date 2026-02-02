<template>
    <div class="container base-container mt-5">
        <h3 data-usal="fade-l" class="title fw-light pb-2" v-html="content.title"></h3>
        <div v-for="item in content.items">
            <CustomDetails :title="item.title" class="card">
                <p>
                    {{ item.description }}
                </p>
            </CustomDetails>
        </div>
    </div>
</template>

<script>
    import CustomDetails from "~/components/layout/CustomDetails.vue"

    export default {
        name: "Faqs",

        components: { CustomDetails },

        props: {
            content: {
                type: Object,
                required: true,
                default: () => ({
                    items: [],
                }),
            },
        },
    }
</script>

<style scoped lang="scss">
    @import "~/assets/styles/variable";

    .base-container {
        max-width: $width-800;
    }

    .card {
        background: $black-3;
        box-shadow: none;
        color: white;
        border: $block-border;
    }
</style>