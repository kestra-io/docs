<template>
    <div class="container-fluid">
        <div class="container pt-3">
            <div class="row content mt-5 mb-2">
                <div class="col-12">
                    <h1 data-aos="fade-left title">Title</h1>
                    <h4 data-aos="fade-right" class="fw-normal">
                        Subtitle
                    </h4>
                    <div class="tutorials-container">
                        <div class="tutorials-list">
                            <div class="row">
                                <div class="col-12 col-md-6 col-lg-4 mb-5 mt-3" v-for="video in videos">
                                    <ResourcesTutorialResource
                                        :video="video"
                                        :getYMD="getYMD"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="d-flex justify-content-between mb-5">
                    <div class="items-per-page">
                        <select
                            class="form-select bg-dark-2"
                            aria-label="Default select example"
                            v-model="itemsPerPage"
                        >
                            <option :value="10">10</option>
                            <option :value="25">25</option>
                            <option :value="50">50</option>
                        </select>
                    </div>
                    <div class="d-flex justify-content-between align-items-center">
                        <CommonPagination
                            :totalPages="totalPages"
                            @on-page-change="changePage"
                            v-if="totalPages > 1"
                        />
                        <div class="d-flex align-items-baseline">
                            <span class="total-pages">Total: {{ totalVideos }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
  const {$bootstrap} = useNuxtApp();
  const config = useRuntimeConfig();
  const videos = ref([]);
  const totalPages = ref(0);
  const totalVideos = ref(0);
  const itemsPerPage = ref(25);
  const currentPage = ref(1);

  const {data: tutorialVideo} = await useAsyncData(`tutorial-videos`, () => {
    return $fetch(`${config.public.apiUrl}/tutorial-videos?page=${currentPage.value}&size=${itemsPerPage.value}`);
  });
  const changePage = (pageNo) => {
    currentPage.value = pageNo;
    window.scrollTo(0, 0);
  }


  const setVideos = (data, total) => {
    videos.value = data;
    totalVideos.value = total;
    totalPages.value = Math.ceil(total / itemsPerPage.value);
  }

  const getYMD = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const formattedMonth = month < 10 ? '0' + month : month;
    const formattedDay = day < 10 ? '0' + day : day;

    return `${formattedMonth}.${formattedDay}.${year}`;
  }

  if(tutorialVideo.value) {
    setVideos(tutorialVideo.value.results, tutorialVideo.value.total);
  }

  let timer;
  watch([currentPage, itemsPerPage], ([pageVal, itemVal], [__, oldItemVal]) => {
    if(timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(async () => {
      const { data } = await useFetch(`${config.public.apiUrl}/tutorial-videos?page=${(itemVal != oldItemVal) ? 1 : pageVal}&size=${itemVal}`);
      setVideos(data.value.results, data.value.total);
    }, 500)
  })
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";


    ::deep(main) {
        position: absolute;
    }

    h2 {
        color: $white;
    }

    .content {
        @include media-breakpoint-up(md) {
            margin-right: $rem-1;
        }


        h1 {
            font-size: $font-size-4xl;
            font-weight: 400;
            color: $white;
            margin-bottom: 2rem;
        }

        h4 {
            color: $white-1;
            font-size: $font-size-xl;
            font-weight: 400;
            margin-bottom: 2rem;
        }

        &::after {
            content: "";
            position: absolute;
            height: 12.5rem;
            width: 20%;
            top: 7%;
            left: 10%;
            z-index: -147;
            filter: blur(110px);
            background: linear-gradient(180deg, rgba(98, 24, 255, 0) 0%, #6117FF 100%);
        }
    }

    .tutorials-container {
        padding: calc($spacer * 1.5) 0 $spacer;
        display: flex;
        flex-direction: column;
        gap: 2rem;

        iframe {
            border: 1px solid $black-6;
            border-radius: calc($spacer * 0.5);
            width: 100%;

            @include media-breakpoint-down(lg) {

            }
        }

        .info-block {
            display: flex;
            align-items: center;
            height: 100%;
            max-width: calc($spacer * 23.25);

            .content {
                display: flex;
                flex-direction: column;
                margin: 0 !important;

                p {
                    margin: 0;
                    font-size: $font-size-sm;
                    line-height: calc($spacer * 1.375);
                    font-weight: 400;
                }

                p.category {
                    color: $purple-36;
                }

                h3.title {
                    font-size: $h3-font-size;
                    font-weight: 400;
                    line-height: calc($spacer * 2.375);
                    color: $white;
                    margin: 0;
                }

                p.video-info {
                    color: $white-3;
                }

                p.canal-name {
                    color: $black-8;
                }
            }

            @include media-breakpoint-down(lg) {
                max-width: unset;
                .content {
                    h3.title {
                        line-height: unset;
                    }
                }
            }
        }
    }

    .items-per-page .form-select {
        border-radius: 4px;
        border: $block-border;
        color: $white;
        text-align: center;
        font-family: $font-family-sans-serif;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px;
    }

    .total-pages {
        font-size: $font-size-sm;
        color: $white;
        text-align: center;
        font-family: $font-family-sans-serif;
        font-weight: 400;
        line-height: 22px;
    }
</style>
