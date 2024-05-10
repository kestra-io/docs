<template>
    <div ref="container" class="container-fluid bg-dark-4">
        <div class="container">
            <div class="mb-5 language-agnostic">
                <h2 class="title">Language Agnostic <span>Orchestration</span></h2>
                <div class="row d-flex justify-content-center">
                    <div class="col-12 col-md-6 col-lg-4 mb-4" v-for="item in pageCards" v-bind:key="item.id">
                        <a class="page-item" :href="item.pageHref">
                            <img
                                :src="item.imageSource"
                                :alt="item.imageAlt"
                            />
                            <p class="card-title">{{item.title}}</p>
                            <p class="card-description">{{item.description}}</p>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

  export default {
    data() {
      return {
        active: 1,
        pageCards : [
          {
            id: 1,
            title: 'Orchestrate your Python Scripts',
            description: 'Dive deeper to discover how Kestra optimizes Python script execution across diverse environments.',
            imageSource: '/landing/features/language/card-pages/python-card.svg',
            imageAlt: 'Python Scripts',
            pageHref: '/python'
          },
          {
            id: 2,
            title: 'Orchestrate your R Scripts',
            description: 'Discover Kestra\'s powerful orchestration capabilities for R scripts, simplifying complex data analytics.',
            imageSource: '/landing/features/language/card-pages/r-card.svg',
            imageAlt: '/R Scripts',
            pageHref: '/r'
          },
          {
            id: 3,
            title: 'Orchestrate your Julia Scripts',
            description: 'Learn about Kestra’s support for Julia, optimizing high-performance numerical analysis and computational projects.',
            imageSource: '/landing/features/language/card-pages/julia-card.svg',
            imageAlt: 'Julia Scripts',
            pageHref: '/julia'
          },
        ],
      };
    },
  }
</script>

<style lang="scss" scoped>
    @import "../../../assets/styles/variable";

    .container-fluid {
        color: var(--bs-white);
        padding: 0;

        .container {
            padding: 4rem 0;
        }

        .title {
            margin: 0;
            color: var(--bs-white);
            text-align: center;
            font-family: $font-family-sans-serif;
            font-size: calc($font-size-base * 3.125);
            font-style: normal;
            font-weight: 400;
            line-height: 4rem;
            @include media-breakpoint-down(sm) {
                font-size: 1.875rem;
                line-height: 2.563rem;
            }

            @include media-breakpoint-down(lg) {
                padding: 0;
            }

            span {
                background: linear-gradient(91deg, #E151F7 43.87%, #5C47F5 55.51%);
                background-clip: text;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
        }

        .language-agnostic {
            display: flex;
            flex-direction: column;
            gap: 2rem;
        }

        .page-item {
            display: flex;
            flex-direction: column;
            gap: calc($spacer * 0.5);

            .card-title {
                font-size: $font-size-lg;
                font-weight: 700;
                line-height: calc($font-size-base * 1.625);
                margin: 0;
                color: $white;
            }

            .card-description {
                font-size: $font-size-base;
                font-weight: 400;
                line-height: $font-size-xl;
                margin: 0;
                color: $white-1;
            }
        }
    }
</style>
