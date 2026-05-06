<template>
  <section class="unlock">
    <div class="container">
      <header>
        <img
          width="150"
          data-usal="zoomin"
          :src="logo.src"
          :alt="logo.alt"
        />
        <h2 v-if="title" class="title">
          Unlock the <span class="highlight">Potential</span> of Your <br />{{ title }}
        </h2>
        <p class="desc">{{ description }}</p>
      </header>

      <div class="row d-none d-lg-flex justify-content-center mt-5">
        <div class="col-lg-5 z-2" data-usal="zoomin">
          <div class="items text-end">
            <template v-for="info in content.leftContent" :key="info.title">
              <h3 class="item-title">{{ info.title }}</h3>
              <h6 class="item-desc">{{ info.description }}</h6>
            </template>
          </div>
        </div>

        <div class="col-lg-2 z-2" data-usal="zoomin">
          <Stroke strokeColor="var(--ks-content-color-highlight-inverse)" />
        </div>

        <div class="col-lg-5 z-2" data-usal="zoomin">
          <div class="items text-start">
            <template v-for="info in content.rightContent" :key="info.title">
              <h6 class="item-desc">{{ info.description }}</h6>
              <h3 class="item-title">{{ info.title }}</h3>
            </template>
          </div>
        </div>
      </div>

      <div class="cards d-lg-none">
        <div
          v-for="item in [...content.leftContent, ...content.rightContent]"
          :key="item.title"
          class="card"
        >
          <h3 class="item-title mb-2">{{ item.title }}</h3>
          <h6 class="item-desc">{{ item.description }}</h6>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
    import Stroke from "~/components/use-cases/Stroke.vue"

    defineProps<{
    title?: string
    description: string
    logo: {
        src: string;
        alt: string
    }
    content: any
    }>()
</script>

<style lang="scss" scoped>
    .unlock {
        position: relative;
        overflow: hidden;
        text-align: center;
        padding-block: 7.5rem 1rem;
        @include media-breakpoint-down(lg) {
            padding-top: 4rem;
        }
        color: var(--ks-content-primary-inverse);
        background-color: var(--ks-background-primary-inverse);
        background-image: url("~/assets/use-cases/retail/ellipse.svg"), url("~/assets/use-cases/retail/grid.svg");
        background-repeat: no-repeat;
        background-position: top center;
        background-size: auto;

        &::after {
            content: "";
            position: absolute;
            inset: 0;
            pointer-events: none;
            z-index: 0;
            transform: rotate(180deg);
            background-image: inherit;
            background-repeat: inherit;
            background-position: inherit;
            background-size: inherit;
        }

        header {
            display: flex;
            flex-direction: column;
            align-items: center;
            position: relative;
            z-index: 3;
        }

        .title {
            color: var(--ks-content-primary-inverse);
            margin-bottom: 1rem;

            :deep(.highlight) {
                color: var(--ks-content-color-highlight-inverse);
            }
        }

        .desc {
            max-width: $container-max-width;
            color: var(--ks-content-primary-inverse);
            font-size: $font-size-lg;
            margin-bottom: 0;

            @include media-breakpoint-down(lg) {
                max-width: unset;
            }
        }

        .items {
            display: flex;
            flex-direction: column;
            gap: 8rem;
            padding-top: 5rem;

            @include media-breakpoint-down(lg) {
                flex-direction: row;
                gap: $spacer;
                padding-top: $spacer;
            }
        }

        .item-title {
            margin: 0;
            color: var(--ks-content-primary-inverse);

            @include media-breakpoint-down(lg) {
                font-size: $font-size-lg;
            }
        }

        .item-desc {
            margin: 0;
            font-size: $font-size-lg;
            color: var(--ks-content-primary-inverse);
            font-weight: normal;

            @include media-breakpoint-down(md) {
                font-size: $font-size-sm;
            }
        }

        .cards {
            display: flex;
            flex-direction: column;
            gap: 2.5rem;
            padding: 2rem 1rem;
            padding-bottom: 4rem;

            .card {
                padding: $spacer;
                border: 1px solid var(--ks-content-color-highlight-inverse);
                border-radius: $border-radius-lg;
                background: var(--ks-background-primary-inverse);
                text-align: left;
                position: relative;
                box-shadow: 0 0 1rem var(--ks-shadows-light-inverse);
                z-index: 1;

                &:not(:last-child)::after {
                    content: "";
                    position: absolute;
                    left: 2.5rem;
                    bottom: -2.6rem;
                    height: 2.5rem;
                    width: 0;
                    border-left: 1px dashed var(--ks-content-color-highlight-inverse);
                    opacity: 0.6;
                }
            }
        }
    }
</style>