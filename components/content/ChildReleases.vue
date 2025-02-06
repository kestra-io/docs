<template>
    <div class="row card-group card-centered mb-2">
        <NuxtLink :href="item._path" class="col-12 col-md-10 mb-4" v-for="item in navigation" :key="item._path">
            <div class="card">
                <div class="card-body">
                    <div>
                        <h4 class="text-white">{{ item.release }}</h4>
                        <h4 class="card-title">{{ item.title }}</h4>
                    </div>
                    <p class="card-text">{{ item.description }}</p>
                </div>
            </div>
        </NuxtLink>
    </div>
</template>

<script setup>
    import {hash} from "ohash";
    import {useAsyncData} from "#imports";

    const props = defineProps({
        pageUrl: {
            type: String,
            default: undefined
        },
    });

    const route = useRoute()

    let currentPage = null;

    if (props.pageUrl) {
        currentPage = props.pageUrl;
    } else {
        currentPage = route.path;
    }

    currentPage = currentPage.endsWith("/") ? currentPage.slice(0, -1) : currentPage;

    const {data: navigation} = await useAsyncData(
        `ChildReleases-${hash(currentPage)}`,
        () => () => queryCollection('docs').where('release', 'IS', `NotNull`).sort("release", "DESC").all()
    );
</script>
