<template>
    <NuxtLayout>
        <Error :error="error"/>
    </NuxtLayout>
</template>

<script>
    export default {
        props: ['error'],
        created() {
            console.log(this.error)
        }
    }
</script>