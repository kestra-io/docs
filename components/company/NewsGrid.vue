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
        v-for="(news, index) in newsItems"
        :key="news.id"
        class="news-card"
        data-aos="fade-up"
        :data-aos-delay="200 + (index * 100)"
      >
        <NuxtLink :to="news.url" :external="news.external">
          <div class="card-content">
            <span class="card-category">{{ news.source }}</span>
            <h3 class="card-title">{{ news.title }}</h3>
            <NuxtImg
              :src="news.logo"
              :alt="news.source"
              :width="news.width"
              :height="news.height"
            />
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const newsItems = [
  {
    id: 1,
    title: "Kestra raises another $8M for its open source orchestration platform",
    source: "TechCrunch",
    url: "https://techcrunch.com/2024/09/23/kestra-raises-another-8-million-for-its-open-source-orchestration-platform/",
    external: true,
    logo: "/landing/company/teams/techcrunch.svg",
    width: 56,
    height: 51
  },
  {
    id: 2,
    title: "How Kestra Raised $8M: Our Seed Deck, Now Public",
    source: "Medium",
    url: "https://medium.com/@edarras/how-kestra-raised-8m-our-seed-deck-now-public-b3493f5a9fbb",
    external: true,
    logo: "/landing/company/teams/medium.svg",
    width: 52,
    height: 52
  },
  {
    id: 3,
    title: "Kestra is an open source data orchestration platform for complex workflows",
    source: "TechCrunch",
    url: "https://techcrunch.com/2023/10/04/kestra-is-an-open-source-data-orchestration-platform-for-complex-workflows/",
    external: true,
    logo: "/landing/company/teams/techcrunch.svg",
    width: 56,
    height: 51
  },
  {
    id: 4,
    title: "Kestra: a Scalable Open-Source Orchestration and Scheduling Platform",
    source: "InfoQ",
    url: "https://www.infoq.com/news/2022/03/kestra-orchestration-platform/",
    external: true,
    logo: "/landing/company/teams/infoq.svg",
    width: 65,
    height: 19
  },
  {
    id: 5,
    title: "Kestra Secures $8 Million to Simplify and Unify Orchestration for All Engineers",
    source: "Medium",
    url: "https://medium.com/@edarras/kestra-secures-8-million-to-simplify-and-unify-orchestration-for-all-engineers-28e7d61e3511",
    external: true,
    logo: "/landing/company/teams/medium.svg",
    width: 52,
    height: 52
  }
]
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
  justify-content: space-between;

  img {
    margin-top: auto;
    align-self: flex-start;
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
