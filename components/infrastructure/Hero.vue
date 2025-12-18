<template>
    <section class="hero">
        <div class="container">
            <div style="position: relative; padding-bottom: calc(56.461% + 41px); height: 0px; width: 100%;">
                <iframe
                    src="https://demo.arcade.software/cuDf2qq3l9LX1WgP52Fp?embed&embed_mobile=inline&embed_desktop=inline&show_copy_link=true"
                    title="Hero Infra" frameborder="0" loading="lazy" webkitallowfullscreen mozallowfullscreen
                    allowfullscreen allow="clipboard-write"
                    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; color-scheme: light;"></iframe>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
    //NOOP
</script>

<style lang="scss" scoped>
.hero {
    position: relative;
    z-index: 1;
    padding-top: calc(var(--nav-height, 72px) + 1rem);
    min-height: 100vh;
    overflow: visible;
}

.hero::before {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: calc(100vh + var(--nav-height, 72px));
    background-image: url('/landing/infrastructure/Hero-bk.png');
    background-size: cover;
    background-position: top center;
    background-repeat: no-repeat;
    z-index: -1;
    pointer-events: none;
}

.container {
    position: relative;
    z-index: 2;
}
</style>