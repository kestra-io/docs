<template>
    <div class="container">
        <Section :subtitle="props.title || undefined" :title="props.title ? undefined : 'Get Kestra updates'">
            <div class="row">
                <template v-for="blog in blogs">
                    <div class="col-md-4 mb-4">
                        <div class="card bg-dark-4" data-aos="fade-right">
                            <NuxtLink class="text-dark" :href="blog._path">
                                <NuxtImg loading="lazy" format="webp" quality="80" densities="x1 x2" :src="blog.image" class="card-img-top rounded-3" :alt="blog.image" />
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
                <NuxtLink class="btn btn-animated btn-purple-animated" href="/blogs" data-aos="zoom-in">See all news</NuxtLink>
            </div>
        </Section>
    </div>
</template>
<script setup>
    import Section from './Section.vue';

    const props = defineProps({
        title: {
            type: String,
            required: true
        },
    })

    const {data: blogs} = await useAsyncData(
        `layout-blog`,
        () => queryCollection("blogs").order("date", "DESC").select('title', 'category', 'image', 'author', 'date', 'path').limit(3).all(),
        {
            serverMaxAge: 60 * 10,
        }
    );

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
            color: $purple-36;
        }

        .card-title {
            color: $white;
        }

        .author {
            font-size: $font-size-sm;
            color: $white-5;
            margin-bottom: 0;
        }
    }
</style>