<template>
    <div class="container mt-5 pt-5 text-center">
        <img :src="logoImage.src" class="d-lg-none flip" />
        <h5 class="highlight">Read-Only</h5>
        <h1>Access to Kestra Preview Environment</h1>
    </div>
</template>

<script setup lang="ts">
    import logoImage from "./images/Logo_kestra.svg"
</script>

<style scoped lang="scss">
    .flip {
        width: 200px;
        transform: scaleX(-1);
    }
</style>