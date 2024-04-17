<template>
    <div class="container-fluid">
        <div class="container">
            <div class="row content mt-5 mb-2">
                <div class="col-12">
                    <h1 data-aos="fade-left title">Video tutorials</h1>
                    <h4 data-aos="fade-right" class="fw-normal">
                        Get started with our video tutorials
                    </h4>
                    <ul
                        class="nav nav-tabs mt-3 flex-nowrap overflow-x-auto overflow-y-hidden"
                        id="myTab"
                        role="tablist"
                    >
                        <li
                            v-for="cat in categories"
                            :key="cat.name"
                            class="nav-item text-nowrap"
                            role="presentation"
                        >
                            <button
                                class="nav-link"
                                :class="{ active: filter === cat.name }"
                                id="home-tab"
                                data-bs-toggle="tab"
                                data-bs-target="#home"
                                type="button"
                                role="tab"
                                aria-controls="home"
                                aria-selected="true"
                            >
                                {{ cat.name }}
                            </button>
                        </li>
                    </ul>
                    <div class="tab-content" id="myTabContent">
                        <div
                            v-for="cat in categories"
                            :key="cat.name"
                            class="tab-pane fade"
                            :class="{ 'show active': filter === cat.name }"
                            :id="cat.name"
                            role="tabpanel"
                            :aria-labelledby="`${cat.name}-tab`"
                        >
                            <div class="tutorials-container">
                                <div class="main">
                                    <iframe
                                        width="764"
                                        height="424"
                                        :src="videos[0].iframeUrl"
                                        :title="videos[0].title"
                                        frameborder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        referrerpolicy="strict-origin-when-cross-origin"
                                        allowfullscreen
                                    />
                                    <div class="info-block">
                                        <div class="content">
                                            <p class="category">{{videos[0].category}}</p>
                                            <h3 class="title">{{videos[0].title}}</h3>
                                            <p class="video-info">57k views - 2 weeks ago</p>
                                            <p class="canal-name">{{videos[0].author}}</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="tutorials-list">
                                    <div class="row d-flex justify-content-center">
                                        <div class="col-12 col-md-6 col-lg-4 mb-4" v-for="video in videos">
                                            <VideosTutorialVideo :video="video"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class=" d-flex justify-content-between my-5">
                    <div class="items-per-page">
                        <select
                            class="form-select bg-dark-2"
                            aria-label="Default select example"
                            v-model="itemsPerPage"
                            @change="fetchPageData"
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
                            <span class="total-pages">Total: {{ totalPlugins }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    name: "TutorialsList",
    data() {
      return {
        filter: "All videos",
        categories: [
          {
            name: "All videos",
          },
          {
            name: "Hands on Tutorials",
          },
          {
            name: "101 Tutorials",
          },
          {
            name: "Feature showcase",
          },
        ],
        slug: "",
        pageList: [],
        itemsPerPage: 25,
        pageNo: 1,
        totalPages: 2,
        totalPlugins: 39
      };
    },
    props: {
      videos: {
        type: Array,
        default: []
      },
    },
  };
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";


    ::deep(main) {
        position: absolute;
    }

    .right-side-bar {
        border: $block-border;
        height: fit-content;
        padding: 2.25rem 2rem;

        .heading {
            color: $white;
            font-size: $font-size-lg;
            line-height: 1.875rem;
            font-weight: 100;
        }
    }

    .nav-tabs {
        border-bottom: 1px solid $black-6;
    }

    .nav-item {
        .nav-link {
            color: $white;
            font-size: $font-size-md;
            font-weight: 400;

            &:hover, &:focus {
                border-color: transparent;
            }

            &:focus-visible {
                box-shadow: none;
            }
        }

        .active {
            color: $purple-36;
            font-size: $font-size-md;
            background-color: transparent;
            font-weight: 700;

            &, &:hover, &:focus {
                border-color: $purple-36;
                border-width: 0 0 1px 0;
                border-radius: 0;
            }
        }
    }

    .nav::-webkit-scrollbar {
        display: none;
    }

    .nav {
        -ms-overflow-style: none;
        scrollbar-width: none;
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
            top: 3%;
            left: 10%;
            z-index: -147;
            filter: blur(110px);
            background: linear-gradient(180deg, rgba(98, 24, 255, 0) 0%, #6117FF 100%);
        }
    }

    .tutorials-container {
        padding: 2rem 0 1rem;
        display: flex;
        flex-direction: column;
        gap: 2rem;

        .main {
            width: 100%;
            display: flex;
            gap: 2rem;

            iframe {
                border: 1px solid $black-6;
                border-radius: calc($spacer * 0.5);
            }

            .info-block {
                display: flex;
                align-items: center;
                max-width: calc($spacer * 23.25);

                .content {
                    display: flex;
                    flex-direction: column;

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
            }

            @include media-breakpoint-down(lg) {
                flex-direction: column;
                .info-block {
                    max-width: unset;

                    .content {
                        h3.title {
                            line-height: unset;
                        }
                    }
                }

                iframe {
                    width: 100%;
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
