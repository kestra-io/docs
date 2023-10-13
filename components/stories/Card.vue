<template>
    <NuxtLink :href="`/stories/${story.name.split(' ').join('-').toLowerCase()}`">
          <div class="card" data-aos="fade-right">
              <div class="card-body d-flex flex-column justify-content-between ">
                  <div>
                      <NuxtImg loading="lazy" format="webp" quality="80" densities="x1 x2" :src="story.img" alt="Story_Img" class="card-img-top rounded-3" />
                      <p class="card-name type mt-3 mb-2 text-pink">{{ story.name }}</p>
                      <h4 class="card-title">{{ story.title }}</h4>
                      <div class="d-flex flex-wrap gap-3 my-3" v-if="icons">
                          <div class="icon" v-for="icon in icons" :key="icon.name">
                              <CommonTaskIcon :cls="icon"/>
                          </div>
                      </div>
                  </div>
                  <span class="author text-primary">
                      Read the Story <img src="/stories/icons/arrow_right_alt.svg" alt="right icons" />
                  </span>
              </div>
          </div>
    </NuxtLink>
</template>
<script setup >
defineProps({
  story: {
    type: Object,
    required: true,
  },
  icons: {
    type: Array,
    required: true,
},
});
</script>
<style lang="scss" scoped>
@import "../../assets/styles/variable";
.card {
  height: 100%;

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

    .icon {
        border: 1px solid #E5E4F7;
        padding: 0.313rem 0.625rem;
        width: 44px;
    }
  }
  &-title {
    font-size: $h6-font-size;
    line-height: 1.625rem;
  }
  &-name {
    font-size: $font-size-xs !important;
    line-height: 1.75rem !important;
    text-transform: uppercase !important;
  }
}
</style>