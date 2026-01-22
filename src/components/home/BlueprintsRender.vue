<template>
    <section>
        <div class="container">
            <h2><span>250+ Blueprints,</span> Ready to Build.</h2>
            <p>Jump start your workflows with a growing library of workflow templates</p>
        </div>
        <Suspense>
            <HomeBlueprintsCarousel :blueprints="blueprints" />
        </Suspense>
        <div class="button-container">
            <a href="/blueprints" class="btn btn-lg btn-primary">Explore Blueprints</a>
        </div>
    </section>
</template>

<script lang="ts" setup>
    import HomeBlueprintsCarousel from "~/components/home/BlueprintsCarousel.vue"
    defineProps<{
        blueprints: Array<Blueprint>
    }>()
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";
    .container {
        text-align: center;
        padding: 1rem;
    }
    h2 {
        color: white;
        font-size: 3rem;
        font-weight: 600;
        span {
            color: $primary;
            background: linear-gradient(90deg, #7c2eea 0%, #658af9 100%) no-repeat center;
            font-weight: 600;
            background-size: cover;
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
    }
    p {
        color: #777;
    }
    .button-container {
        text-align: center;
        margin: 4rem 0 3rem;
    }
</style>