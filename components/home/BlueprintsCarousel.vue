<template>
    <div class="blueprints-container">
        <button class="navigation navigation-left" @click="scrollLeft"><ArrowLeftIcon/></button>
        <button class="navigation navigation-right" @click="scrollRight"><ArrowRightIcon/></button>
        <div class="blueprints-carousel" ref="wrapper">
            <BlueprintsListCard v-for="blueprint in blueprints" :key="blueprint.id" :blueprint="blueprint" :href="`/blueprints/${blueprint.id}`"/>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import ArrowLeftIcon from "vue-material-design-icons/ArrowLeft.vue"
import ArrowRightIcon from "vue-material-design-icons/ArrowRight.vue"
import BlueprintsListCard from "../blueprints/ListCard.vue"

defineProps<{
    blueprints: {id: string}[]
}>()

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
    .blueprints-container {
        position: relative;
        .navigation{
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background-color: #444955;
            color: white;
            border-radius: 50%;
            z-index: 1;
            height: 44px;
            width: 44px;
            border: none;
            font-size: 24px;
            padding: 0;
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
</style>