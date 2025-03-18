<template>
    <div class="container">
        <div class="card-block">
            <div class="plugin-text">
                <h2 class="text-white"><span>600+</span> Plugins<wbr/> That Integrate With<wbr/> Your <span>Stack</span></h2>
                <p>Connect  with third-party systems, data sources, and applications. And if you require a custom integration, our platform makes it easy to build custom plugins.</p>
                <a href="#" class="btn btn-primary">See All Plugins</a>
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
            gap: 1rem;
        }
    }

    .plugin-logos-grid{
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        margin: 1rem;
        @include media-breakpoint-up(lg){
            margin: 2rem;
            max-width: 500px;
        }
        > div{
            width: 55px;
            height: 55px;
            padding: .6rem;
            display: flex;
            justify-content: center;
            align-items: center;
            @include media-breakpoint-up(lg){
                width: 80px;
                height: 80px;
                padding: .8rem;
            }
            &:nth-child(2n){
                background-color: #1A1C24;
            }
        }
        img{
            width: 70%;
            height: 70%;
            transition: all 0.2s;
            &:hover{
                transform: scale(1.1);
            }
        }
    }

    .plugin-text{
        flex: 1;
        text-align: center;
        h2{
            max-width: 350px;
            margin: 3rem auto;
            color: white;
            font-size: 2.5rem;
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
            font-size: .8rem;
            @include media-breakpoint-up(lg){
                width: 480px;
                font-size: 1.2rem;
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