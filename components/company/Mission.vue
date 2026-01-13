<template>
  <section class="mission">
    <div class="mission-content">
      <header data-aos="fade-right">
        <h1>
          Staying <span>True</span> to our Mission
        </h1>
        <p>
          Our values are at the core of everything we do. We are building a platform
          that not only meets the needs of our users but also exceeds their
          expectations. We are driven by a passion for continuous improvement. We
          strive to develop new ideas and solutions that redefine the orchestration
          landscape.
        </p>
      </header>

      <div class="values" data-aos="fade-up" data-aos-delay="200">
        <article v-for="(value, index) in values" :key="value.title" class="value" :data-aos="'fade-up'" :data-aos-delay="300 + (index * 100)">
          <div class="value-header">
            <component :is="value.icon" />
            <h3>{{ value.title }}</h3>
          </div>
          <p>{{ value.description }}</p>
        </article>
      </div>

      <blockquote class="testimonial" data-aos="fade-right" data-aos-delay="700">
        <p>
          "Kestra is like the Wizard of Oz Wizard, doing its magic behind the
          curtain"
        </p>
        <footer>
          <NuxtImg
            src="/landing/company/teams/acxiom.svg"
            alt="Acxiom"
          />
        </footer>
      </blockquote>
    </div>

    <div class="mission-visual">
      <NuxtImg
        src="/landing/company/teams/executions.png"
        alt="Kestra Dashboard"
        class="dashboard-image"
        data-aos="fade-left"
        data-aos-delay="400"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import Verified from "vue-material-design-icons/CheckDecagramOutline.vue";
import Hub from "vue-material-design-icons/Hub.vue";
import SupervisedUserCircle from "vue-material-design-icons/AccountSupervisorCircleOutline.vue";
import Opacity from "vue-material-design-icons/Opacity.vue";

const values = [
  {
    icon: Verified,
    title: "Quality",
    description: "We are committed to deliver a platform that meets the highest standards.",
  },
  {
    icon: Hub,
    title: "Collaboration",
    description: "We are creating a strong relationships with our users, customers, and team members.",
  },
  {
    icon: SupervisedUserCircle,
    title: "User-Centric",
    description: "We incorporate users feedbacks and address their challenges as we continue to build Kestra.",
  },
  {
    icon: Opacity,
    title: "Transparency",
    description: "We value openness and honesty in all aspects of our work at every step.",
  },
];
</script>

<style lang="scss" scoped>
@import "~/assets/styles/variable";

.mission {
  display: grid;
  grid-template-columns: 60% 40%;
  height: 786px;

  @media (max-width: 991px) {
    grid-template-columns: 1fr;
    height: auto;
  }
}

.mission-content {
  background: #0a0a0f;
  color: $white;
  padding: 0 56px 0 290px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 42px;

  @media (max-width: 1399px) {
    padding: $rem-5 200px;
    padding-right: $rem-2;
  }
  @media (max-width: 1199px) {
    padding: $rem-5 150px;
    padding-right: $rem-2;
  }
  @media (max-width: 991px) {
    padding: $rem-5 40px;
  }

  header {
    h1 {
      font-weight: 700;
      font-size: $rem-2;
      line-height: $rem-3;
      margin-bottom: 24px;

      span {
        background: linear-gradient(90.25deg, #7C2EEA 2%, #658AF9 100%);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        color: transparent;
        display: inline-block;
      }
    }

    p {
      font-size: $font-size-md;
      line-height: 1.6;
      color: $white;
      margin: 0;
    }
  }
}

.values {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 29px;

  @media (max-width: 450px) {
    grid-template-columns: 1fr;
  }
}

.value {
  &-header {
    display: flex;
    align-items: center;
    gap: .75rem;
    margin-bottom: .5rem;

    :deep(svg) {
      font-size: $font-size-lg;
    }

    h3 {
      font-weight: 700;
      font-size: $font-size-md;
      line-height: 24px;
      margin: 0;
    }
  }

  p {
    font-size: $font-size-sm;
    line-height: 1.5;
    color: $white-1;
    margin: 0;
  }
}

.testimonial {
  border-left: 1px solid $black-5;
  padding-left: $rem-1;
  margin: 0;

  p {
    font-size: $font-size-sm;
    line-height: 24px;
    color: $white-1;
    margin-bottom: 12px;

    @media (max-width: 575px) {
      font-size: 13px;
      margin-bottom: .5rem;
    }
  }

  footer {
    display: flex;
    flex-direction: column;
    gap: .5rem;

    span {
      font-size: $font-size-sm;

      @media (max-width: 575px) {
        font-size: 12px;
      }
    }

    img {
      width: 105px;
      height: 21px;
    }
  }
}

.mission-visual {
  background-image: url('/landing/company/teams/dashboard-gradient.svg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-color: #0a0a0f;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: end;
  overflow: hidden;

  .dashboard-image {
      width: 100%;
      object-fit: contain;
      border-radius: $border-radius-lg;

      @media (min-width: 1700px) {
        width: auto;
        height: 100%;
        padding: 60px 0;
      }

      @media (max-width: 991px) {
        width: 100%;
        padding: 60px 0;
      }

      @media (max-width: 575px) {
        padding: $rem-3 0 $rem-4 $rem-1;
      }
    }
  }
</style>
