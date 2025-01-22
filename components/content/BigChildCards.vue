
<template>
    <div class="big-card-grid">
        <NuxtLink :href="item._path" class="big-card" v-for="item in orderedNavigation" :key="item._path">
            <h4 class="card-title">{{ item.title }}</h4>
            <p class="card-text">{{ item.description }}</p>
        </NuxtLink>
    </div>
</template>

<script setup lang="ts">
    import {computed} from "vue";
    import {hash} from "ohash";
    import {useAsyncData} from "#imports";

const props = defineProps<{
    directory: string
}>()

const {data: navigation} = await useAsyncData(
        `BigChildCard-${hash(props.directory)}`,
        () => queryContent(props.directory + "/").find()
    );

const orderedNavigation = computed(() => {
    return navigation.value?.sort((a, b) => {
        const aOrder = a.order?.toString() || "0";
        const bOrder = b.order?.toString() || "0";
        return aOrder.localeCompare(bOrder);
    });
});
</script>

<style lang="scss" scoped>
@import "../../assets/styles/_variable.scss";
.big-card-grid{
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
}

.big-card{
    padding: 2rem;
    border-radius: 0.5rem;
    text-decoration: none;
    background: linear-gradient(180deg, #21242E 0%, #1A1C24 100%);
    color: white;
    border: 1px solid #21242E;
    border-image-source: linear-gradient(180deg, #2B313E 0%, #131725 100%);
    transition: all 0.3s;
    h4 {
        padding-top: 0;
        font-size: $font-size-xl;
        font-weight: normal;
    }
    p{
        font-size: $font-size-sm;
        line-height: 1.5em;
    }
    &:hover{
        background: linear-gradient(180deg, rgba(#21242E, .9) 0%, rgba(#1A1C24,.9) 100%), #fff;
    }
}
</style>
