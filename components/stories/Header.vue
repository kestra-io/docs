<template>
    <div class="container-fluid header-container">
        <div class="hero hero-sm container position-relative z-1">
            <div class="row align-items-center mb-5">
                <div class="col-lg-6 align-items-center d-flex order-1 order-lg-0">
                    <div class="hero-content">
                        <img
                            height="56"
                            loading="lazy"
                            :src="logo"
                            :alt="logo"
                            class="mb-3"
                        />
                        <h1 v-if="title">{{title}}</h1>
                        <p class="baseline">{{ metaDescription }}</p>
                    </div>
                </div>
                <div class="col-lg-6 order-0 order-lg-1">
                    <div class="hero-image-container">
                        <img
                            class="hero-image"
                            :src="heroImage"
                            :alt="metaDescription"
                        />
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-12">
                    <div class="metrics d-flex flex-wrap align-items-center justify-content-center">
                        <div class="counter-box">
                            <ContentRenderer :value="kpi1Content" />
                        </div>
                        
                        <div class="vertical-separator d-none d-md-block mx-4"></div>
                        
                        <div class="counter-box">
                            <ContentRenderer :value="kpi2Content" />
                        </div>
                        
                        <div class="vertical-separator d-none d-md-block mx-4"></div>
                        
                        <div class="counter-box">
                            <ContentRenderer :value="kpi3Content" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
  import {parseMarkdown} from '@nuxtjs/mdc/runtime'

  const props = defineProps({
    slug: { type: String, required: true },
    title: { type: String, required: true },
    metaDescription: { type: String, required: true },
    heroImage: { type: String, required: true },
    logo: { type: String, required: true },
    kpi1: { type: String, required: true },
    kpi2: { type: String, required: true },
    kpi3: { type: String, required: true }
  });
  
  const kpi1Content = ref('');
  const kpi2Content = ref('');
  const kpi3Content = ref('');

  kpi1Content.value = await parseMarkdown(props.kpi1, {});
  kpi2Content.value = await parseMarkdown(props.kpi2, {});
  kpi3Content.value = await parseMarkdown(props.kpi3, {});
</script>

<style scoped lang="scss">
  @import "../../assets/styles/variable";

  .header-container {
      background-color: #F4F4F4; 
      position: relative;
      overflow: hidden;
      
      &::before {
          content: "";
          position: absolute;
          right: -18.767px;
          top: 110.197px;
          width: 818.767px;
          height: 414.991px;
          
          background-image: url("/stories/header/dots.svg");
          background-repeat: no-repeat;
          background-size: contain; 
          z-index: 0; 
          pointer-events: none;
      }

      .container {
          position: relative;
          z-index: 2; 
      }

      h1 {
          color: $black-2;
          font-family: $font-family-sans-serif;
          font-weight: 500;
          font-size: $font-size-3xl;
          margin-bottom: 16px;
          line-height: 1.2;
          padding-bottom: 0;

          @include media-breakpoint-down(sm) {
              font-size: 1.875rem;
          }
      }

      p.baseline {
          color: #000;
          font-family: "Mona Sans", sans-serif;
          font-size: 16px;
          font-style: normal;
          font-weight: 500;
          line-height: 23px;
          
          margin-bottom: 2rem;
          padding-bottom: 0;
      }

      .hero-image-container {
          border-radius: 13px;
          border: 1px solid #D4D4D4;
          background: #F4F4F4;
          display: flex;
          padding: 6px;
          flex-direction: column;
          align-items: flex-start;
          gap: 10px;
          width: 100%; 
      }

      .hero-image {
          width: 100%;
          height: auto;
          border-radius: 8px; 
          object-fit: cover;
      }

      :deep(.hero.hero-sm) {
          border-bottom: none;
          padding-bottom: 3rem; 
      }
      
      .metrics {
          margin-top: 1rem;
          justify-content: center;
          
          .vertical-separator {
              width: 1px;
              height: 50px; 
              background-color: #888;
          }

          .counter-box {
              text-align: center;
              
              :deep(h5), :deep(h4), :deep(strong) {
                  color: $black-2;
                  font-size: 2.5rem; 
                  font-weight: 700;
                  margin: 0;
                  line-height: 1;
              }
              
              :deep(p) {
                  color: #444; 
                  font-size: 0.875rem;
                  text-transform: uppercase;
                  font-weight: 600;
                  margin: 0.5rem 0 0 0;
                  letter-spacing: 0.05em;
              }
          }
      }
  }
</style>