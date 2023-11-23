<template>
    <div class="container">
        <!-- <div class="line"/> -->
        <Section :title="title || 'Get Kestra updates'">
            <div class="row">
                <template v-for="blog in blogs">
                    <div class="col-md-4">
                        <div class="card" data-aos="fade-right">
                            <NuxtLink class="text-dark" :href="blog._path">
                                <NuxtImg loading="lazy" format="webp" quality="80" densities="x1 x2" :src="blog.image" class="card-img-top rounded-3" :alt="blog.image" />
                                <div class="card-body">
                                    <p class="type mt-1 mb-0">{{ blog.category }}</p>
                                    <h6 class="card-title mb-0">{{ blog.title }}</h6>
                                    <p class="author ">
                                        {{ blog.author.name }}  {{ timesAgo(blog.date) }}
                                    </p>
                                </div>
                            </NuxtLink>
                        </div>
                    </div>
                </template>
            </div>
        </Section>
    </div>
</template>
<script setup>
    import {useAsyncData} from "#imports";

    const {data: blogs} = await useAsyncData(
        `Blog`,
        () => queryContent("/blogs/")
            .sort({ date: -1 })
            .without('unused-key')
            .limit(3)
            .find()
    );

</script>
<script>
    import Section from '../layout/Section.vue';

    export default {
        components: {Section},
        props: {
            title: {
                type: String,
                default: undefined,
            },
        },
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";
    
    .container{
        border-top: 1px solid $gray-600;
    }
    :deep(.main){
        padding-top: 2rem !important;
    }
    .card {
        height: 100%;
        box-shadow: none;
    }

    .card-body {
        padding: 0px;
        .type {
            font-size: $font-size-sm;
            color: $primary;
        }

        .author {
            font-size: $font-size-sm;
            color: $gray-500;
            margin-bottom: 0;
        }
    }
    .card-title{
        line-height: 1.5rem;
    }
</style>