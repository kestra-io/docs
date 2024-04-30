<template>
    <div class="row card-group mb-2">
        <NuxtLink :href="item._path" class="col-12 col-md-6 mb-4" v-for="item in navigation" :key="item._path">
            <div class="card">
                <div class="card-body">
                    <div>
                        <span class="card-icon">
                            <img :src="item.icon" :alt="item.title" />
                        </span>
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
    import Typewriter from "vue-material-design-icons/Typewriter.vue";

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
        `ChildCard-${hash(currentPage)}`,
        () => queryContent(currentPage + "/").find()
    );
    console.log(navigation);
    // if (currentPage == "/docs/faq") {
    //   navigation.value = navigation.value.map(item => {
    //     return { ...item, icon: item.icon ? item.icon : '/docs/icons/faq.svg'}
    //   })
    // }
</script>
