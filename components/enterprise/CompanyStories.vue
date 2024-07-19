<template>
    <div class="container">
        <Section subtitle="Meet the companies who build with" subtitle-after="Kestra">
            <div class="container mt-3">
                <div class="company-stories-container row">
                    <div class="col-sm-12 col-md-5 col-lg-4 mb-4" v-for="(story, index) in stories" :key="index">
                        <StoriesCard :story="story" />
                    </div>
                </div>
            </div>
        </Section>
    </div>
</template>

<script>
  import Section from "../layout/Section.vue";
  export default {
    components: { Section },
  };
</script>

<script setup>
  const route = useRoute()
  const config = useRuntimeConfig();
  const stories = ref([])
  const totalStories = ref(0)

  const fetchStories = async ({currentPage, itemsPerPage}) => {
    const {data} = await useAsyncData('stories', () => {
      return $fetch(`${config.public.apiUrl}/customer-stories-v2?page=${currentPage}&size=${itemsPerPage}`)
    })
    stories.value = data.value.results
    totalStories.value = data.value.total
  }

  await fetchStories({currentPage: 1, itemsPerPage: 3})
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    :deep(section) {
        .subtitle {
            max-width: calc($spacer * 35.5);
            p > span {
                background: linear-gradient(90deg, #e151f7 24.82%, #5c47f5 76.81%) !important;
                background-clip: text !important;
                -webkit-background-clip: text !important;
            }
        }
    }

    :deep(.card) {

        .card-body {
            .card-img-top {
                border-radius: calc($spacer * 0.5);
            }
        }
        .story-tasks {
            display: none !important;
        }

        .card-title {
            font-family: Public Sans;
            font-size: 22px;
            font-weight: 600;
            line-height: 22px;
            letter-spacing: 0em;
            text-align: left;
            color: $white;
            text-transform: capitalize;
        }

        .card-meta-description {
            font-family: Public Sans;
            font-size: 18px;
            font-weight: 400;
            line-height: 26px;
            letter-spacing: 0em;
            text-align: left;
            color: $white-1;
        }
    }

    .company-stories-container {
        display: flex;
        flex-wrap: wrap;

        @include media-breakpoint-down(lg) {
            justify-content: center;
        }
    }
</style>