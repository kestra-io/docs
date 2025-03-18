<template>
    <div class="container">

        <div class="card-block">
            <div class="plugin-logos-grid">
                <div v-for="plugin in pluginLogos" :key="plugin.name">
                    <img :src="plugin.logo" :alt="plugin.name" />
                </div>
            </div>

            <div class="plugin-text">
                <h2 class="text-white"><span>600+</span> Plugins<wbr/> That Integrate With<wbr/> Your <span>Stack</span></h2>
                <p>Connect  with third-party systems, data sources, and applications. And if you require a custom integration, our platform makes it easy to build custom plugins.</p>
                <a href="#" class="btn btn-primary">See All Plugins</a>
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
        padding: 2rem 3rem;
        gap: 1rem;
        border: 1px solid #2C2E4B;
        height: 500px;
        display: flex;
        z-index: 1;
    }

    .plugin-logos-grid{
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 3rem;
        margin: 2rem;
        width: 500px;
        justify-content: center;
        align-items: center;
        img{
            width: 80%;
            height: auto;
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
            text-wrap: pretty;
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
            width: 480px;
            margin: 0 auto;
            text-align: center;
            font-size: 1.2rem;
        }
        .btn{
            margin: 1rem;
        }
    }
</style>