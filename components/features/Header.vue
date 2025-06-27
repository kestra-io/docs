<template>
  <section :class="['main-header', { scrolled: isScrolled }]">
    <div class="hero container">
      <div class="text-block">
        <h6 class="highlight">Core Features</h6>
        <h1 data-aos="zoom-in">Fast, Scalable, Declarative Orchestrator</h1>
        <div class="buttons">
          <NuxtLink href="/docs/getting-started/quickstart#start-kestra" class="btn btn-lg btn-primary me-3 mb-2">
            Get Started!
          </NuxtLink>
          <NuxtLink href="/demo" class="btn btn-lg btn-secondary mb-2" target="_blank">
            Talk to us
          </NuxtLink>
        </div>
      </div>
      <div class="img-block">
        <NuxtImg src="/landing/features/application.png" width="100%" height="100%" alt="Kestra" class="img-fluid d-none d-lg-block" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useWindowScroll } from '@vueuse/core'
import { computed } from 'vue'

const { y } = useWindowScroll()
const isScrolled = computed(() => y.value > 50)
</script>

<style lang="scss" scoped>
@import "../../assets/styles/variable";

.main-header {
  position: relative;
  width: 100%;

  @include media-breakpoint-up(lg) {
    background:
      url("/landing/features/feature_gradients.svg") top/cover,
      url("/landing/features/cpt.png") right 0% bottom 45%/contain no-repeat;
  }

  @media screen and (max-width: 991px) {
    &::after {
      content: "";
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      background: url("/landing/features/cpt.png") center/contain no-repeat;
      z-index: -1;
    }
  }

  .hero {
    position: relative;
    padding: 3rem 0 0;
  }

  .text-block {
    position: relative;
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    margin: 4rem 0;
    gap: $spacer;
  }

  .highlight {
    background: linear-gradient(90deg, #9F79F3 0%, #658AF9 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
    z-index: 12;
  }

  h1 {
    color: white;
    text-align: center;
    font-weight: 600;
    font-size: 2rem;
    max-width: 100%;
    padding: 0;
    margin: 0;

    @include media-breakpoint-up(lg) {
      font-size: 3.875rem;
      line-height: 1.2;
      max-width: 800px;
    }
  }

  .buttons {
    text-align: center;
    margin-top: 1.5rem;
    white-space: nowrap;
  }

  .img-block {
    position: relative;
    display: flex;
    justify-content: center;
    border: 1px solid;
    border-image-source: radial-gradient(
      46.16% 31.1% at 73.05% 39.82%, 
      #2B313E 0%, 
      #6B66D5 44.15%, 
      #2D344E 100%
    );

    &::after {
      content: "";
      position: absolute;
      bottom: -12.5rem;
      left: 0;
      right: 0;
      height: 100%;
      background: url("/landing/features/overlay_ellipse.png") bottom center/cover no-repeat;
      opacity: 0.85;
      pointer-events: none;
    }
  }
}
</style>
