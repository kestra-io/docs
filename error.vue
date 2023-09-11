<template>
    <NuxtLayout>
        <Error :error="error" :title="title" :description="description" />
    </NuxtLayout>
</template>

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