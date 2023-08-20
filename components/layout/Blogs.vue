<template>
    <div class="container">
        <Section :subtitle="title ? 'blog' : undefined" :title="title || 'Get Kestra updates'">
            <div class="row">
                <template v-for="blog in blogs">
                    <div class="col-md-4 mb-4">
                        <div class="card" data-aos="fade-right">
                            <NuxtLink class="text-dark" :href="blog._path">
                                <NuxtImg loading="lazy" format="webp" quality="80" :src="blog.image" class="card-img-top rounded-3" :alt="blog.image" />
                                <div class="card-body">
                                    <p class="type mt-3 mb-2">{{ blog.category }}</p>
                                    <h4 class="card-title">{{ blog.title }}</h4>
                                    <p class="author">
                                        {{ blog.author.name }}  {{ timesAgo(blog.date) }}
                                    </p>
                                </div>
                            </NuxtLink>
                        </div>
                    </div>
                </template>
            </div>
            <div class="text-center">
                <NuxtLink class="btn btn-primary " href="/blogs" data-aos="zoom-in">See all news</NuxtLink>
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
    import Section from './Section.vue';

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

    .card {
        height: 100%;
        box-shadow: none;
    }

    .card-body {
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
</style>