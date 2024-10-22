<template>
    <div class="container-fluid bg-dark-4">
        <div class="container">
            <div class="title mb-5">
                <p>Explore Blueprints</p>
            </div>
            <div class="mt-3">
                <Carousel v-bind="settings" :breakpoints="breakpoints">
                    <Slide v-for="blueprint in blueprints" :key="blueprint.id" >
                        <div class="carousel--item">
                            <BlueprintsListCard :blueprint="blueprint" :tags="tags" :href="generateCardHref(blueprint)" />
                        </div>
                    </Slide>
                    <template #addons>
                        <navigation>
                            <template #next>
                                <div class="carousel-control carousel-control-next">
                                    <ChevronRight />
                                </div>
                            </template>
                            <template #prev>
                                <div class="carousel-control carousel-control-prev">
                                    <ChevronLeft />
                                </div>
                            </template>
                        </navigation>
                    </template>
                </Carousel>
            </div>
        </div>
    </div>
</template>
<script setup>
  const config = useRuntimeConfig();
  const blueprints = ref([])
  const props = defineProps({
    tag: {
      type: String,
      required: false
    }
  })
  const { data: blueprintsData } = await useAsyncData('blueprints', () => {
    return $fetch(`${config.public.apiUrl}/blueprints/versions/latest?tags=${props.tag}`)
  });
  const {data: tags} = await useAsyncData('blueprints-tags', () => {
    return $fetch(`${config.public.apiUrl}/blueprints/versions/latest/tags`)
  })
  const generateCardHref = (blueprint) => {
    let tag = tags.value.find(f => f?.id == blueprint.tags[0]);
    if (!tag || !tag.id) {
        return `/blueprints/unknown/${blueprint.id}`;
    }
    return `/blueprints/${tag.id}/${blueprint.id}`
  }
  if (blueprintsData.value) {
    blueprints.value = blueprintsData.value.results
  }
</script>

<script>
  import Section from '../../layout/Section.vue';
  import ChevronRight from "vue-material-design-icons/ChevronRight.vue";
  import ChevronLeft from "vue-material-design-icons/ChevronLeft.vue";
  export default {
    components: {
      ChevronLeft,
      ChevronRight,
      Section,
    },
    data() {
      return {
        settings: {
          itemsToShow: 1,
          snapAlign: 'center',
        },
        breakpoints: {
          800: {
            itemsToShow: 2,
            snapAlign: 'start',
          },
          900: {
            itemsToShow: 2,
            snapAlign: 'start',
          },
          990: {
            itemsToShow: 3,
            snapAlign: 'start',
          },
          1024: {
            itemsToShow: 3,
            snapAlign: 'start',
          },
          1300: {
            itemsToShow: 3,
            snapAlign: 'start',
          },
          1500: {
            itemsToShow: 4,
            snapAlign: 'start',
          },
        },
      };
    },
  }
</script>

<style lang="scss" scoped>
    @import "../../../assets/styles/variable";
    .container {
        border-top: $block-border;
        padding: 3rem 0;
        position: relative;

        &::after {
            content: "";
            position: absolute;
            height: 20rem;
            width: 20rem;
            bottom: 30%;
            left: 40%;
            z-index: 1;
            filter: blur(100px);
            background: linear-gradient(180deg, rgba(98, 24, 255, 0) 0%, #6117FF 100%);
        }

        .title {
            position: relative;
            z-index: 2;
            p {
                text-align: center;
                font-size: calc($font-size-base * 2.25);
                font-weight: 500;
                color: $white;
                margin: 0;
            }
        }
        :deep(.card) {
            text-align: left;
            min-width: calc($spacer * 17.7);
            margin-right: $spacer;
            min-height: calc($spacer * 19.1);
        }
        .carousel-control-prev, .carousel-control-next {
            width: fit-content;
            background-color: $primary-1;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            opacity: 1;
            :deep(.material-design-icon > .material-design-icon__svg) {
                bottom: 0;
                color: $white;
            }
        }
        .carousel--item {
            width: 100%;
            height: 100%;
        }
        :deep(.carousel) {
            .carousel__viewport {
                position: relative;
                z-index: 2;
                &:before {
                    content: "";
                    position: absolute;
                    right: -142px;
                    width: 16rem;
                    top: -63px;
                    background-color: $black-4;
                    height: 140%;
                    z-index: 1;
                    filter: blur(47px);
                }
            }
            .carousel__prev {
                left: calc($spacer * 3.6);
            }
            .carousel__next {
                right: calc($spacer * 3.6);
            }
            .carousel__next,
            .carousel__prev {
                z-index: 2 !important;
                opacity: 1;
            }
            .carousel__next--disabled,
            .carousel__prev--disabled {
                display: none;
            }
        }
    }
</style>