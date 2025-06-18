<template>
  <div class="container">
    <div class="title-section" data-aos="fade-up">
      <h2 class="title">Our investors</h2>
      <p class="subtitle">
        Kestra is proudly backed by two strategic funding rounds: a <strong>$3M Pre-seed</strong>
        <br class="d-none d-lg-block"> and an <strong>$8M Seed round</strong>, supported by visionary leaders and founders <br class="d-none d-lg-block"> from
        industry-leading companies. These investments fuel Kestra's mission to<br class="d-none d-lg-block">
        redefine orchestration.
      </p>
    </div>

    <div class="logos" data-aos="fade-up" data-aos-delay="200">
      <div
  v-for="(logo, index) in investorsLogos"
  :key="logo.name"
  class="logo"
  data-aos="zoom-in"
  :data-aos-delay="300 + (index * 100)"
>
  <a :href="logo.link" target="_blank" rel="noopener noreferrer" class="logo-link">
    <NuxtImg :src="logo.src" :alt="logo.name" class="logo-image" />
  </a>
</div>


    </div>

    <div class="profiles" data-aos="fade-up" data-aos-delay="600">
      <div
        v-for="(profile, index) in investorsProfiles"
        :key="profile.name"
        class="profile"
        data-aos="fade-up"
        :data-aos-delay="300 + (index * 50)"
      >
        <NuxtImg :src="profile.image" :alt="profile.name" class="profile-img" />
        <div class="profile-text">
          <h6 class="profile-name">{{ profile.name }}</h6>
          <p class="profile-title">{{ profile.title }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const investorsLogos = [
{ name: "Alven", src: "/landing/company/teams/alven-sm.svg", link: "https://www.alven.co" },
{ name: "Isai", src: "/landing/company/teams/isai-sm.svg", link: "https://isai.vc" },
{ name: "Axeleo Capital", src: "/landing/company/teams/axeleo-sm.svg", link: "https://www.axc.vc/" }
];

const investorsProfiles = [
  { name: "Nicolas Dessaigne", title: "Founder at Algolia & partner Y Combinator", image: "/landing/company/teams/nico-algolia.svg" },
  { name: "Olivier Pomel", title: "Founder & CEO at Datadog", image: "/landing/company/teams/olivier-datadog.svg" },
  { name: "Tristan Handy", title: "Founder & CEO at dbt Labs", image: "/landing/company/teams/tristian-dbt.svg" },
  { name: "Michel Tricot", title: "Founder & CEO at Airbyte", image: "/landing/company/teams/michel-airbyte.svg" },
  { name: "Frédéric Plais", title: "Founder & CEO at Platform.sh", image: "/landing/company/teams/fred-invest.svg" },
  { name: "Clément Delangue", title: "Founder & CEO at Hugging Face", image: "/landing/company/teams/clement-hugface.svg" },
  { name: "Bertrand Diard", title: "Co-Founder & former CEO at Talend", image: "/landing/company/teams/bert-syroco.svg" },
  { name: "Pierre Burgy", title: "Founder & CEO at Strapi", image: "/landing/company/teams/pierre-strapi.svg" },
  { name: "Stijn Christiaens", title: "Co-founder & Chief Data Citizen at Collibra", image: "/landing/company/teams/schristiaens.png" }
]
</script>

<style lang="scss" scoped>
@import "../../assets/styles/variable";

.container {
  max-width: 100%;
  background-color: $white;
  padding-top: 5rem;
  padding-bottom: 5rem;
}

.title-section {
  max-width: 1140px;
  margin: 0 auto;
  text-align: center;
  margin-bottom: 4rem;

  .title {
    font-size: 2rem;
    line-height: 48px;
    font-weight: 600;
    color: $black-2;
    margin-bottom: 1rem;
  }

  .subtitle {
    font-size: 18px;
    line-height: 26px;
    color: $black-2;
    margin: 0;
    font-weight: 400;

    .d-none {
      display: none;
    }

    @include media-breakpoint-up(lg) {
      .d-lg-block {
        display: inline !important;
      }
    }
  }
}

.logos {
  width: 1140px;
  max-width: 100%;
  margin: 0 auto 4rem;
  display: grid;
  grid-template-columns: 1fr;
  border: 1px solid #F0F0F0;
  box-shadow: 0px 2px 4px 0px #ECEBEF;

  @include media-breakpoint-up(xl) {
    grid-template-columns: repeat(3, 1fr);
  }

  .logo {
    padding: 2rem;
    height: 150px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid #F0F0F0;

    @include media-breakpoint-up(xl) {
      border-bottom: none;
      border-right: 1px solid #F0F0F0;
    }

    &:last-child {
      border: none;
    }

    .logo-image {
      width: 120px;
      height: 60px;
      object-fit: contain;
    }

    .logo-link {
      display: inline-block;
      transition: transform 0.3s ease-in-out;

      &:hover {
        transform: scale(1.1);
      }
    }
  }
}



.profiles {
  width: 1140px;
  max-width: 100%;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 2rem;

  @include media-breakpoint-up(md) {
    grid-template-columns: repeat(2, 1fr);
  }

  @include media-breakpoint-up(lg) {
    grid-template-columns: repeat(3, 1fr);
  }

  .profile {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 0 1rem;

    .profile-img {
      width: 50px;
      height: 50px;
      flex-shrink: 0;
    }

    .profile-text {
      .profile-name {
        font-weight: 700;
        color: $black-2;
        font-size: $font-size-md;
        line-height: 1.2;
        margin-bottom: .25rem;
      }

      .profile-title {
        color: $black-10;
        font-size: $font-size-xs;
        line-height: 20px;
        margin: 0;
      }
    }
  }
}

</style>