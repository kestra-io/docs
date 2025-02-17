<template>
    <DefaultLayout>
        <Error :error="error" :title="title" :description="description" />
    </DefaultLayout>
</template>

<script setup>
    import DefaultLayout from "~/layouts/default.vue";
</script>

<script>
    export default {
        props: ['error'],
        computed: {
            title() {
                return this.error.statusCode === 404 ?
                    "We lost that page..." :
                    "We broke that page..."
            },
            description() {
                return this.error.statusCode === 404 ?
                    "Sorry, the page you are looking for doesn’t exist or has been moved." :
                    "Sorry, an error occurred."
            },
        },
    }
</script>