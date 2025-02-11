<template>
    <div class="container p-0">
        <!-- <div class="line"/> -->
        <Section :title="title || 'Get Kestra updates'">
            <div class="row">
                <template v-for="blog in blogs">
                    <div class="col-md-4">
                        <div class="card" data-aos="fade-right">
                            <NuxtLink class="text-dark" :href="blog.path">
                                <NuxtImg loading="lazy" format="webp" quality="80" densities="x1 x2" :src="blog.image" class="card-img-top rounded-3" :alt="blog.image" />
                                <div class="card-body d-flex flex-column">
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
    import Section from '../layout/Section.vue';

    const props = defineProps({
      title: {
        type: String,
        default: undefined,
      },
      page: {
        type: Object,
        default: undefined,
      }
    });

    const {data: blogs} = await useAsyncData(
        `Blog`,
        () => queryCollection("blogs")
            .order("date", "DESC")
            .limit(3)
            .all()
    );

</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .container{
        border-top: $block-border;
    }
    :deep(section){
        .main {
            padding-top: 2rem !important;
        }

        h2 {
            color: $white;
            font-size: 3.125rem;
            font-weight: 300;
        }
    }
    .card {
        height: 100%;
        box-shadow: none;
        background-color: transparent;

        .card-img-top {
            border: $block-border;
        }

        .card-body {
            padding: 0;
            gap: 0.25rem;
            .type {
                font-size: $font-size-sm;
                color: #CDD5EF;
                font-weight: 400;
            }

            .card-title{
                color: $white;
                font-size: $font-size-md;
                font-weight: 300;
                line-height: 1.5rem;
            }
            .author {
                color: $white-1;
                font-size: $font-size-sm;
                font-weight: 400;
            }
        }
    }
</style>