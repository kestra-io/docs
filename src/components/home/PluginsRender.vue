<template>
    <HomeCard class="container card-block">
        <div class="plugin-text">
            <h2 class="text-white">
                <span>{{ totalPlugins }}+</span> Plugins<br />That Integrate With<br />Your
                <span>Stack</span>
            </h2>
            <h2 class="text-white mobile">Integrate With<br />Your <span>Stack</span></h2>
            <p>
                Connect with third-party systems, data sources, and applications. And if you require
                a custom integration, our platform makes it easy to build custom plugins.
            </p>
            <a href="/plugins" class="btn btn-md btn-primary">See All Plugins</a>
        </div>
        <div class="plugin-logos-grid">
            <a v-for="plugin in plugins" :key="plugin.link" :href="plugin.link">
                <img :src="plugin.icon" :alt="plugin.title" />
            </a>
        </div>
    </HomeCard>
</template>

<script setup lang="ts">
    import HomeCard from "~/components/home/Card.vue"
    defineProps<{
        totalPlugins: string | number
        plugins: {
            title: string
            name: string
            artifactId: string
            link: string
            icon: string
        }[]
    }>()
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";
    .card-block {
        position: relative;
        z-index: 1;
        margin-top: 2rem;
        @include media-breakpoint-down(sm) {
            width: auto;
        }
        @include media-breakpoint-up(xl) {
            padding: 4rem;
            display: flex;
            flex-direction: row-reverse;
            gap: 4rem;
        }
    }

    .plugin-logos-grid {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        flex: 1;
        margin: 1rem;
        @include media-breakpoint-up(sm) {
            margin: 2rem;
        }
        @include media-breakpoint-up(xl) {
            margin: 0;
        }
        > a {
            aspect-ratio: 1;
            padding: 0.6rem;
            display: flex;
            justify-content: center;
            align-items: center;
            @include media-breakpoint-up(xl) {
                padding: 0.8rem;
            }
            &:nth-child(2n) {
                background-color: #1a1c24;
                // shadow inset
                box-shadow: inset 1px 1px 1px #0d0e1388;
            }
        }
        img {
            width: 70%;
            height: 70%;
            transition: all 0.2s;
            &:hover {
                transform: scale(1.2);
            }
        }
    }

    .plugin-text {
        flex: 1;
        text-align: center;
        margin: 2rem auto;
        @include media-breakpoint-up(xl) {
            margin: 0;
        }
        max-width: 450px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 1rem;
        h2 {
            display: none;
            @include media-breakpoint-up(xl) {
                display: block;
            }
            &.mobile {
                display: block;
                @include media-breakpoint-up(xl) {
                    display: none;
                }
            }
            margin: auto;
            color: white;
            font-size: 3rem;
            font-weight: 600;
            text-align: center;
            span {
                color: $primary;
                background: linear-gradient(90deg, #7c2eea 0%, #658af9 100%) no-repeat center;
                background-size: cover;
                background-clip: text;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
        }
        p {
            color: #ecebef;
            margin: 0 auto;
            text-align: center;
            @include media-breakpoint-up(xl) {
                font-size: 1rem;
            }
        }
        .btn {
            margin: 1rem;
        }
    }

    .container {
        margin-bottom: 5rem;
    }
</style>