<template>
    <div class="container">
        <Section subtitle="blog" title="What’s new at Kestra ?">
            <div class="row">
                <template v-for="blog in lasts">
                    <div class="col-md-4 mb-4">
                        <div class="card" data-aos="fade-right">
                            <NuxtLink class="text-dark" :href="blog._path">
                                <img :src="blog.image" class="card-img-top rounded-3" :alt="blog.image">
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
                <NuxtLink class="btn btn-lg btn-primary " href="/blogs">See all news</NuxtLink>
            </div>
        </Section>
    </div>
</template>
<script setup>
const blogs = await queryContent("/blogs/").find();

const lasts = blogs.reverse().slice(0,3);

</script>
<script>
    import Section from '../layout/Section.vue';
    import {timesAgo} from "~/utils/times.js";

    export default {
        components: {Section},
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