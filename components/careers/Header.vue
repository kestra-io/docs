<template>
    <div class="container-fluid">
        <div class="hero hero-sm container">
            <div class="row">
                <div class="col-md-6 align-items-center d-flex order-1 order-md-0">
                    <div>
                        <p data-aos="fade-left" class="overline">Careers</p>
                        <h1 data-aos="fade-right">Join our Team</h1>
                        <p class="baseline" data-aos="fade-left" >Join our team and drive innovation in a collaborative environment</p>
                        <NuxtLink :href="(route.fullPath === '/careers' ? '' : '/careers') + '#positions'" class="btn btn-lg btn-primary" data-aos="zoom-in">
                            Open positions
                        </NuxtLink>
                    </div>
                </div>
                <div class="col-md-6 order-0 order-md-1">
                    <img class="img-fluid" src="/landing/careers/header.svg" alt="A square with circles inside with emojis in It representing Kestra's inclusive and dynamic workplace culture" data-aos="zoom-in" />
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .container-fluid {
        background: $light-cyan;
        padding-top: 80px;
        margin-top: -80px;
    }
</style>
<script setup lang="ts">
    const route = useRoute()
</script>