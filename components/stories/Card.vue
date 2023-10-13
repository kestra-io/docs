<template>
  <NuxtLink :href="''">
    <div class="card" data-aos="fade-right">
      <div class="card-body d-flex flex-column justify-content-between">
        <div>
          <NuxtImg
            loading="lazy"
            format="webp"
            quality="80"
            densities="x1 x2"
            :src="cardData.img"
            class="card-img-top rounded-3"
          />
          <p class="card-name type mt-3 mb-2 text-pink">{{ cardData.name }}</p>
          <h4 class="card-title">{{ cardData.title }}</h4>
        </div>
        <span class="author text-primary">
          Read the Story <img src="/stories/icons/arrow_right_alt.svg" alt="" />
        </span>
      </div>
    </div>
  </NuxtLink>
</template>
<script setup >
const props = defineProps(["cardData"]);
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