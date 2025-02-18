<template>
    <div class="row card-group mb-2">
        <NuxtLink :href="item.path" class="col-12 col-md-6 mb-lg-4 mb-2" v-for="item in navigation" :key="item.path">
            <div class="card">
                <div class="card-body d-flex">
                        <span v-if="!hideIcons" class="card-icon">
                            <img :src="item.icon ?? currentPage.icon" :alt="item.title" width="50px" height="50px"/>
                        </span>
                    <div>
                        <h4 class="card-title">{{ item.title }}</h4>
                        <p class="card-text">{{ item.description }}</p>
                    </div>
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
        hideIcons: {
            type: Boolean,
            default: false
        }
    });

    const route = useRoute()

    let currentPageSlug = null;

    if (props.pageUrl) {
        currentPageSlug = props.pageUrl;
    } else {
        currentPageSlug = route.path;
    }

    currentPageSlug = currentPageSlug.replace(/\/$/, '');

    const {data: navigation} = await useAsyncData(
        `ChildCard-${hash(currentPageSlug)}`,
        () => queryCollection('docs')
            .where('path', 'LIKE', `${currentPageSlug}/%`)
            .where('path', 'NOT LIKE', `${currentPageSlug}/%/%`)
            .all()
    );

    const {data: currentPage} = await useAsyncData(
        `ChildCardCurrentPage-${hash(currentPageSlug)}`,
        () => queryCollection('docs').path(currentPageSlug).first()
    );

    // if (currentPage == "/docs/faq") {
    //   navigation.value = navigation.value.map(item => {
    //     return { ...item, icon: item.icon ? item.icon : '/docs/icons/faq.svg'}
    //   })
    // }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/_variable.scss";

    .card-title {
        font-size: $font-size-xl !important;
        line-height: 1.375rem !important;
    }

    .card-text {
        font-size: $font-size-sm !important;
        line-height: 1rem !important;
    }

    .card-icon {
        img {
            max-width: unset;
            width: 48px !important;
            height: 48px !important;
        }
    }
</style>
