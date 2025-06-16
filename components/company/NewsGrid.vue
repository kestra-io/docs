<template>
  <div class="container">
    <div class="news-grid">
      <div class="news-card title-card" data-aos="fade-up">
        <div class="title-content">
            <h2 class="title">News</h2>
            <p class="subtitle">Recent mentions in media.</p>
        </div>
      </div>
      <div
        v-for="(post, index) in filteredPosts"
        :key="post.path"
        class="news-card"
        data-aos="fade-up"
        :data-aos-delay="200 + (index * 100)"
      >
        <NuxtLink :to="post.path">
          <div class="card-content">
            <span class="card-category">News & Product Updates</span>
            <h3 class="card-title">{{ post.title }}</h3>
            <NuxtImg
              src="/landing/usecases/stories/monograme-kestra.svg"
              alt="monograme-kestra"
              class="logo-placeholder"
            />
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { public: { CollectionNames } } = useRuntimeConfig()

const { data: filteredPosts } = await useAsyncData('news-grid-posts', async () => {
  const posts = await queryCollection(CollectionNames.blogs)
    .order("date", "DESC")
    .limit(50)
    .all()
  
  return posts
    .filter(post => post.category === 'News & Product Updates')
    .slice(0, 5)
})
</script>

<style lang="scss" scoped>
@import "../../assets/styles/_variable.scss";
$white-color: #F0F0F0;

.container {
  max-width: 100%;
  background-color: $white;
  padding: 5rem 1rem;

  @include media-breakpoint-up(sm) { padding: 4rem 1rem; }
  @include media-breakpoint-up(md) { padding: 4.5rem 4rem; }
  @include media-breakpoint-up(lg) { padding: 4.5rem; }
  @include media-breakpoint-up(xxl) { padding: 4.5rem 150px; }
}

.news-layout {
  max-width: 1140px;
  margin: 0 auto;
}

.news-grid {
  width: 1140px;
  max-width: 100%;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  
  @include media-breakpoint-up(md) { grid-template-columns: repeat(2, 1fr); }
  @include media-breakpoint-up(xl) { grid-template-columns: repeat(3, minmax(380px, 1fr)); }
}

.news-card {
  padding: 32px;
  height: 277px;
  
  @media (max-width: 767px) {
    &:not(:first-child) {
      border-top: 1px solid $white-color;
    }
  }
  
  @media (min-width: 768px) and (max-width: 1199px) {
    &:nth-child(odd) {
      border-right: 1px solid $white-color;
    }
    
    &:not(:first-child):not(:nth-child(2)) {
      border-top: 1px solid $white-color;
    }
  }
  
  @media (min-width: 1200px) {
    &:nth-child(1),
    &:nth-child(2),
    &:nth-child(3) {
      border-bottom: 1px solid $white-color;
    }
    
    &:nth-child(2),
    &:nth-child(5) {
      border-left: 1px solid $white-color;
      border-right: 1px solid $white-color;
    }
  }
  
  @include media-breakpoint-down(md) {
    height: auto;
    max-height: 277px;
  }
}

.title-card {
  display: flex;
  align-items: center;
  justify-content: center;

  @include media-breakpoint-up(md) {
    align-items: start;
    justify-content: start;
  }

  .title {
    font-size: 2rem !important;
    line-height: 1.2;
    font-weight: 600;
    margin-bottom: 0.5rem;
    text-align: center;
    
    @include media-breakpoint-up(md) {
      text-align: left;
    }
  }
  
  .subtitle {
    font-size: $font-size-md;
    line-height: 1.4;
    margin: 0;
    color: $black-10;
  }
}

.card-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  gap: 1rem;

  img {
    width: 50px;
    height: 50px;
  }
}

.card-details {
  margin-bottom: 1rem;
}

.card-category {
  color: $black-2;
  font-size: $font-size-sm;
  line-height: 1.4;
}

.card-title {
  font-size: $font-size-lg;
  font-weight: 600;
  color: $black-2;
  line-height: 1.4;
}
</style>
