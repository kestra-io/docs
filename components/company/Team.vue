<template>
  <div class="container">
    <Section
      subtitle="An International Team"
      baseline="Kestra is led by experienced founders and industry veterans dedicated to innovation, quality, and customer success."
      data-aos="fade-up"
    >
      <div class="team-grid" data-aos="fade-up" data-aos-delay="200">
        <div
          v-for="(member, index) in teamMembers"
          :key="member.name"
          class="team-card"
          data-aos="zoom-in"
          :data-aos-delay="(index * 50)"
        >
          <NuxtImg :src="member.image" :alt="member.name" width="110px" height="110px" />
          <div class="team-info">
            <div class="team-name" :class="{ 'mb-3': member.isOpenPosition }" v-html="member.name" />
            <div v-if="member.title" class="team-title">{{ member.title }}</div>
            <NuxtLink v-if="member.isOpenPosition" href="/careers" class="btn btn-sm btn-secondary">
              Open Positions
            </NuxtLink>
          </div>
        </div>
      </div>
    </Section>
  </div>
</template>

<script setup lang="ts">
import Section from '~/components/layout/Section.vue';

const teamMembers = [
  { name: "Emmanuel Darras", title: "CEO", image: "/landing/company/teams/edarras-round.png" },
  { name: "Ludovic Dehon", title: "CTO", image: "/landing/company/teams/ldehon-round.png" },
  { name: "Anna Geller", title: "Product Lead", image: "/landing/company/teams/ageller-round.png" },
  { name: "Georg Traar", title: "Product Manager", image: "/landing/company/teams/gtraar-round.png" },
  { name: "David Khan", title: "Sales Leader", image: "/landing/company/teams/dkhan-round.png" },
  { name: "Luke Lipan", title: "Sales Leader", image: "/landing/company/teams/llipan-round.png" },
  { name: "Paul Grainger", title: "Lead Field Engineer", image: "/landing/company/teams/pgrainger-round.png" },
  { name: "Parham Parvizi", title: "Solution Architect", image: "/landing/company/teams/pparvizi-round.png" },
  { name: "Florian Hussonnois", title: "Lead Software Engineer", image: "/landing/company/teams/fhussonois-round.png" },
  { name: "Loïc Mathieu", title: "Lead Software Engineer", image: "/landing/company/teams/lmathieu-round.png" },
  { name: "François Delbrayelle", title: "Lead Software Engineer", image: "/landing/company/teams/fdelbrayelle-round.png" },
  { name: "Martin-Pierre Roset", title: "Lead Growth & Marketing", image: "/landing/company/teams/mproset-round.png" },
  { name: "Elliot Gunn", title: "Product Marketing Manager", image: "/landing/company/teams/egunn-round.png" },
  { name: "Nicolas Callens", title: "Lead Product Designer", image: "/landing/company/teams/ncallens-round.png" },
  { name: "Faizan Qazi", title: "Solution Engineer", image: "/landing/company/teams/fqazi-round.png" },
  { name: "Zeeshan Choudhry", title: "Support Engineer", image: "/landing/company/teams/zchoudhry-round.png" },
  { name: "Antoine Lin", title: "Lead Finance & Admin", image: "/landing/company/teams/alin-round.png" },
  { name: "Benoît Pimpaud", title: "Product Owner", image: "/landing/company/teams/bpimpaud-round.png" },
  { name: "Amara Graham", title: "Developer Advocate", image: "/landing/company/teams/agraham-round.png" },
  { name: "Will Russell", title: "Developer Advocate", image: "/landing/company/teams/wrussel-round.png" },
  { name: "Yann Coornaert", title: "Software Engineer", image: "/landing/company/teams/ycoornaert-round.png" },
  { name: "Brian Mulier", title: "Software Engineer", image: "/landing/company/teams/bmulier-round.png" },
  { name: "Malay Dewangan", title: "Software Engineer", image: "/landing/company/teams/mdewangan-round.png" },
  { name: "Nicolas Kwiatkowski", title: "Software Engineer", image: "/landing/company/teams/nkwiatkowski-round.png" },
  { name: "Roman Acevedo", title: "Software Engineer", image: "/landing/company/teams/racevedo-round.png" },
  { name: "Miloš Paunović", title: "Software Engineer", image: "/landing/company/teams/mpaunovic-round.png" },
  { name: "Bart Ledoux", title: "Software Engineer", image: "/landing/company/teams/elevatebart.png" },
  { name: "Piyush Bhaskar", title: "Software Engineer", image: "/landing/company/teams/pbhaskar-round.png" },
  { name: "Marco Sabatini", title: "Platform Engineer", image: "/landing/company/teams/msabatini-round.png" },
  { name: "Gilles Perreymond", title: "Platform Engineer", image: "/landing/company/teams/gperreymond-round.png" },
  { name: "Alex Emerich", title: "Technical Writer", image: "/landing/company/teams/aemerich-round.png" },
  { name: "Rok Grabnar", title: "Data Analyst", image: "/landing/company/teams/rgrabnar-round.png" },
  { name: "Pradumna Saraf", title: "QA Engineer", image: "/landing/company/teams/psaraf-round.png" },
  { name: "Wish to see <br />your photo here?", title: null, image: "/landing/company/teams/portrait-round.png", isOpenPosition: true }
]
</script>

<style lang="scss" scoped>
@import "~/assets/styles/variable";

:deep(section) {
  padding: 0 !important;
  @include media-breakpoint-up(md) { padding: 2rem !important; }

  .subtitle p, p.baseline {
    margin-bottom: 0;
    color: $black-2 !important;
  }

  p.baseline {
    font-size: 18px;
    line-height: 26px;
    max-width: 100%;
  }
}

.container {
  max-width: 100%;
  background-color: $white;
  padding: 80px 0;

  @include media-breakpoint-up(md) { padding: 80px; }
  @include media-breakpoint-up(xxl) { padding: 80px 100px; }
}

.team-grid {
  max-width: 1140px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4rem 2rem;

  @media (min-width: 500px) and (max-width: 765px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @include media-breakpoint-up(md) { grid-template-columns: repeat(3, 1fr); }
  @include media-breakpoint-up(lg) { grid-template-columns: repeat(4, 1fr); }
  @include media-breakpoint-up(xl) { grid-template-columns: repeat(5, 1fr); }
  @include media-breakpoint-up(xxl) { grid-template-columns: repeat(6, 1fr); }
}

.team-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 $rem-1;
  gap: $rem-1;

  img {
    border-radius: 50%;
    object-fit: cover;
    filter: grayscale(100%);
  }

  .team-info {
    text-align: center;

    .team-name {
      color: $black;
      font-size: $font-size-md;
      font-weight: 700;
      margin-bottom: 4px;
      line-height: 1.2;
    }

    .team-title {
      color: $black-10;
      font-size: $font-size-xs;
      line-height: 20px;
    }

  }
}
</style>