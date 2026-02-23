<template>
    <section>
        <div class="container">
            <h1><span>250+ Blueprints,</span> Ready to Build.</h1>
            <p>Jump start your workflows with a growing library of workflow templates</p>
        </div>
        <Suspense>
            <BlueprintsCarousel :blueprints="blueprints" />
        </Suspense>
        <div class="button-container">
            <a href="/blueprints" class="btn btn-lg btn-primary">Explore Blueprints</a>
        </div>
    </section>
</template>

<script lang="ts" setup>
    import BlueprintsCarousel from "~/components/common/BlueprintsCarousel.vue"
    defineProps<{
        blueprints: Array<Blueprint>
    }>()
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    section {
        background: var(--ks-background-tertiary);
        padding: 3rem 1.25rem;
    }

    .container {
        text-align: center;
    }

    h1 {
        color: var(--ks-content-primary);
        span {
            font-weight: 600;
            background: linear-gradient(90deg, #7c2eea, #658af9) text;
            -webkit-text-fill-color: transparent;
        }
    }

    p {
        color: var(--ks-content-secondary);
    }

    .button-container {
        text-align: center;
        margin-block: 3rem;
    }
</style>