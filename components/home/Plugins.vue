<template>
    <div class="container">
        <div class="card-block">
            <div class="plugin-text">
                <h2 class="text-white"><span>600+</span> Plugins<br/>That Integrate With<br/>Your <span>Stack</span></h2>
                <h2 class="text-white mobile">Integrate With<br/>Your <span>Stack</span></h2>
                <p>Connect  with third-party systems, data sources, and applications. And if you require a custom integration, our platform makes it easy to build custom plugins.</p>
                <NuxtLink href="/plugins" class="btn btn-primary">See All Plugins</NuxtLink>
            </div>
            <div class="plugin-logos-grid">
                <div v-for="plugin in pluginLogos" :key="plugin.name">
                    <img :src="plugin.logo" :alt="plugin.name" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const plugins = import.meta.glob('@/public/landing/home/plugins/*.svg', {eager: true}) as Record<string, any>

const {data: pluginLogos} = await useAsyncData(() => Promise.resolve(Object.keys(plugins).map((key) => {
    return {
        name: key?.split('/').pop()?.split('.').shift(),
        logo: plugins[key]?.default
    }
}).sort(() => 0.5 - Math.random()).slice(0, 20) as {name: string, logo: string}[]))
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";
    .card-block {
        position: relative;
        background:
            linear-gradient(180deg, #21242E99 0%, #1A1C2499 100%),
            linear-gradient(90deg,#1A1C24 0%, #373a44 50%, #1A1C24 100%);
        border-radius: 1rem;
        box-shadow: 0px 12px 24px 8px #00000017;
        margin-top: 2rem;
        border: 1px solid #2C2E4B;
        z-index: 1;
        @include media-breakpoint-up(lg){
            padding: 2rem 3rem;
            display: flex;
            flex-direction: row-reverse;
            gap: 2rem;
        }
    }

    .plugin-logos-grid{
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        flex: 1;
        > div{
            aspect-ratio: 1;
            padding: .6rem;
            display: flex;
            justify-content: center;
            align-items: center;
            @include media-breakpoint-up(xl){
                padding: .8rem;
            }
            &:nth-child(2n){
                background-color: #1A1C24;
                // shadow inset
                box-shadow: inset 1px 1px 1px #0D0E1388;
            }
        }
        img{
            width: 70%;
            height: 70%;
            transition: all 0.2s;
            &:hover{
                transform: scale(1.2);
            }
        }
    }

    .plugin-text{
        flex: 1;
        text-align: center;
        margin: 2rem auto;
        @include media-breakpoint-up(lg){
            margin: 2rem 0;
        }
        max-width: 450px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 1rem;
        h2{
            display: none;
            @include media-breakpoint-up(lg){
                display: block;
            }
            &.mobile{
                display: block;
                @include media-breakpoint-up(lg){
                    display: none;
                }
            }
            margin: auto;
            color: white;
            font-size: 3rem;
            font-weight: 600;
            text-align: center;
            span{
                color: $primary;
                background: linear-gradient(90deg, #7C2EEA 0%, #658AF9 100%) no-repeat center;
                background-size: cover;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
        }
        p{
            color: #ECEBEF;
            margin: 0 auto;
            text-align: center;
            @include media-breakpoint-up(xl){
                font-size: 1rem;
            }
        }
        .btn{
            margin: 1rem;
        }
    }

    .container{
        margin-bottom: 2rem;
    }
</style>