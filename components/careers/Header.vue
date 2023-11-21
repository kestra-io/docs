<template>
    <div class="container-fluid">
        <div class="hero hero-sm container">
            <div class="row">
                <div class="col-md-6 align-items-center d-flex">
                    <div>
                        <p data-aos="fade-left" class="overline">Careers</p>
                        <h1 data-aos="fade-right">Become a Kestra Member</h1>
                        <p class="baseline" data-aos="fade-left" >Join our amazing team and drive innovation in a collaborative workspace</p>
                        <NuxtLink :href="(route.fullPath === '/careers' ? '' : '/careers') + '#positions'" class="btn btn-lg btn-primary" data-aos="zoom-in">
                            Open positions
                        </NuxtLink>
                    </div>
                </div>
                <div class="col-md-6">
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