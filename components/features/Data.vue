<template>
    <div class="container-fluid">
      <Section>
        <div class="container">
          <div class="heading mx-auto pb-4">
            <h2 class="title text-center">
              Centralized Data Control for
              <span class="title-animate">Improved Efficiency</span>
            </h2>
          </div>
          <div class="row d-flex justify-content-center">
            <div class="col-12 col-md-6 col-lg-3 mb-4">
              <div class="card h-100" data-aos="fade-right">
                <div class="card-body mx-2">
                  <img
                    src="/landing/features/Iconbkg.svg"
                    alt="BackFill pattern svg"
                    class="mb-2"
                  />
                  <h6 class="card-heading">Abstraction of Files</h6>
                  <p class="card-para">
                    The internal Storage feature abstracts files, enabling each
                    task to produce or consume files without needing to know the
                    server's current location.
                  </p>
                </div>
              </div>
            </div>
  
            <div class="col-12 col-md-6 col-lg-3 mb-4">
              <div class="card h-100" data-aos="fade-right">
                <div class="card-body mx-2">
                  <img
                    src="/landing/features/Iconbkg.svg"
                    alt="BackFill pattern svg"
                    class="mb-2"
                  />
                  <h6 class="card-heading">Stateless Servers</h6>
                  <p class="card-para">
                    Allows easy destruction, restart from scratch or restart a
                    previous execution without any hassle.
                  </p>
                </div>
              </div>
            </div>
  
            <div class="col-12 col-md-6 col-lg-3 mb-4">
              <div class="card h-100" data-aos="fade-right">
                <div class="card-body mx-2">
                  <img
                    src="/landing/features/Iconbkg.svg"
                    alt="BackFill pattern svg"
                    class="mb-2"
                  />
                  <h6 class="card-heading">Metadata Storage</h6>
                  <p class="card-para">
                    Metadata from the flow is stored on a database and Kestra's
                    Internal Storage for transparent file systems.
                  </p>
                </div>
              </div>
            </div>
  
            <div class="col-12 col-md-6 col-lg-3 mb-4">
              <div class="card h-100" data-aos="fade-right">
                <div class="card-body mx-2">
                  <img
                    src="/landing/features/Iconbkg.svg"
                    alt="BackFill pattern svg"
                    class="mb-2"
                  />
                  <h6 class="card-heading">Strongly Typed</h6>
                  <p class="card-para">
                    Ensure each piece of data is the right type and well-defined,
                    a date must be a date, an int must be an int, and so on…
                  </p>
                </div>
              </div>
            </div>
  
            <div class="col-12 col-md-6 col-lg-3 mb-4">
              <div class="card h-100" data-aos="fade-right">
                <div class="card-body mx-2">
                  <img
                    src="/landing/features/Iconbkg.svg"
                    alt="BackFill pattern svg"
                    class="mb-2"
                  />
                  <h6 class="card-heading">Amazon Ion Integration</h6>
                  <p class="card-para">
                    Handles more types than JSON, to enable easy mixing of tasks
                    usage without any pain.
                  </p>
                </div>
              </div>
            </div>
  
            <div class="col-12 col-md-6 col-lg-3 mb-4">
              <div class="card h-100" data-aos="fade-right">
                <div class="card-body mx-2">
                  <img
                    src="/landing/features/Iconbkg.svg"
                    alt="BackFill pattern svg"
                    class="mb-2"
                  />
                  <h6 class="card-heading">Communication Between Tasks</h6>
                  <p class="card-para">
                    Each task can easily communicate with all others, making it
                    simple to mix tasks usage without any problems.
                  </p>
                </div>
              </div>
            </div>
  
            <div class="col-12 col-md-6 col-lg-3 mb-4">
              <div class="card h-100" data-aos="fade-right">
                <div class="card-body mx-2">
                  <img
                    src="/landing/features/Iconbkg.svg"
                    alt="BackFill pattern svg"
                    class="mb-2"
                  />
                  <h6 class="card-heading">Task Switch flexibility</h6>
                  <p class="card-para">
                    All switch between tasks, such as BigQuery to MySQL or
                    BigQuery to Redshift, without needing specific operators.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  </template>
  
  <script>
  import Section from "../layout/Section.vue";
  export default {
    components: { Section },
  };
  </script>
  
  <style lang="scss" scoped>
  @import "../../assets/styles/variable";
  
  .container-fluid {
    background-color: $black-1;
  }
  
  .container {
    background-image: url(/landing/features/mask.svg);
    position: relative;
    z-index: 10;
  
    &::before {
      content: "";
      position: absolute;
      width: 400px;
      height: 300px;
      background: linear-gradient(
        140deg,
        rgba(70, 24, 255, 0) -41.95%,
        #7e1cfa 77.28%
      );
      filter: blur(100px);
      left: 28.6rem;
      top: 21rem;
      z-index: 0;
    }
  }
  
  .highlight-underline {
    text-decoration: underline;
  }
  
  .card {
    background-color: $black-2;
    color: $body-tertiary-color;
    z-index: 99;
    box-shadow: none !important;
    border: 1px solid #3d3d3f;
  
    &-body {
      padding: 2.6rem 1.5rem 2rem 1.5rem;
    }
  
    &-heading {
      font-size: $h4-font-size;
      font-weight: 300;
      line-height: 2rem;
    }
  
    &-para {
      font-size: $font-size-sm;
      font-weight: 400;
      line-height: 1.3;
      color: $white-1;
    }
  }
  
  .heading {
    max-width: 509px;
    font-size: $font-size-3xl !important;
    line-height: 2.7rem;
  
    .title {
      line-height: 4rem;
      text-align: center;
      font-weight: 300 !important;
      color: #ffffff;
  
      &-animate {
        background: linear-gradient(90deg, #e151f7 24.82%, #5c47f5 76.81%);
        font-size: $font-size-3xl !important;
        font-weight: 400 !important;
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }
  }
  </style>