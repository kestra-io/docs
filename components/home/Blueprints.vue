<template>
    <div class="container">
        <h2><span>250+ Blueprints,</span> Ready to Build.</h2>
        <p>Jump start your workflows with a growing library of workflow templates</p>
    </div>
    <div class="blueprints-container">
        <button class="navigation navigation-left" @click="scrollLeft"><ArrowLeftIcon/></button>
        <button class="navigation navigation-right" @click="scrollRight"><ArrowRightIcon/></button>
        <div class="blueprints-carousel" ref="wrapper">
            <BlueprintsListCard v-for="blueprint in blueprints" :key="blueprint.id" :blueprint="blueprint" :href="generateCardHref(blueprint)"/>
        </div>
    </div>
    <div class="button-container">
        <NuxtLink href="/blueprints" class="btn btn-lg btn-primary">Explore Blueprints</NuxtLink>
    </div>
</template>

<script lang="ts" setup>
import ArrowLeftIcon from "vue-material-design-icons/ArrowLeft.vue"
import ArrowRightIcon from "vue-material-design-icons/ArrowRight.vue"
const config = useRuntimeConfig()
const { data } = await useFetch<{results: any[]}>(`${config.public.apiUrl}/blueprints/versions/latest?page=1&size=20`)

const blueprints = computed(() => data.value?.results)

const generateCardHref = (blueprint: {id: string}) => {
  return `/blueprints/${blueprint.id}`
}

const wrapper = ref<HTMLElement | null>(null)

const scrollLeft = () => {
    if(wrapper.value){
        wrapper.value.scrollTo({left:wrapper.value.scrollLeft - 400, behavior: 'smooth'})
    }
}

const scrollRight = () => {
    if(wrapper.value){
        wrapper.value.scrollTo({left:wrapper.value.scrollLeft + 400, behavior: 'smooth'})
    }
}
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";
    .container {
        text-align: center;
        padding: 1rem;
    }
    h2 {
        color: white;
        font-size: 3rem;
        span{
            color: $primary;
            background: linear-gradient(90deg, #7C2EEA 0%, #658AF9 100%) no-repeat center;
            font-weight: 600;
            background-size: cover;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
    }
    p {
        color: #777;
    }
    .blueprints-container {
        position: relative;
        .navigation{
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background-color: black;
            color: white;
            border-radius: 50%;
            z-index: 1;
            border: 1px solid white;
            &-left{
                left: 1rem;
            }
            &-right{
                right: 1rem;
            }
        }
    }
    .blueprints-carousel {
        display: flex;
        flex-wrap: nowrap;
        gap: 20px;
        margin: 1rem 2rem;
        overflow-x: auto;
        scrollbar-width: none;
        >a{
            flex: 1;
            min-width: 350px;
        }
    }
    .button-container{
        text-align: center;
        margin: 4rem 0 3rem;
    }
</style>

