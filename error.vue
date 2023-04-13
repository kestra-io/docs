<template>
    <NuxtLayout>
        <Error :error="error"/>
    </NuxtLayout>
</template>

<script>
    export default {
        props: ['error']
    }
</script>