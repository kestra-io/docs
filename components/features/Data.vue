<template>
  <div class="container-fluid">
    <Section subtitle="and Everything from the UI" subtitle-before="Everything as Code">
      <div class="container">
        <div class="row d-flex justify-content-center">



          <div class="col-12 col-md-6 col-lg-3 mb-4">
            <div class="card h-100" data-aos="fade-right">
              <div class="card-body mx-2">
                <img
                  src="/landing/features/Iconbkg.svg"
                  alt="BackFill pattern svg"
                  class="mb-2"
                />
                <h6 class="card-heading">Everything as Code</h6>
                <p class="card-para">
                  Whether you build your workflows from a local IDE or from the UI, your entire workflow configuration is always managed as code and automatically versioned.
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
                <h6 class="card-heading">Everything from the UI</h6>
                <p class="card-para">
                  Create, edit and run your workflows from the integrated code editor in the UI, without having to set up local development environment or managing heavy worker processes.
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
                <h6 class="card-heading">Built-in documentation</h6>
                <p class="card-para">
                 The built-in code editor includes a documentation for all tasks and triggers. An up-to-date description of properties, and hands-on examples are at your fingertips.
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
                <h6 class="card-heading">Autocompletion</h6>
                <p class="card-para">
                  The embedded code editor provides syntax highlighting and autocompletion for all task and trigger properties, significantly improving your productivity.
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
                <h6 class="card-heading">Syntax Validation</h6>
                <p class="card-para">
                    The embedded code editor provides real-time syntax validation as you type, ensuring that your workflows are always valid. No more surprises at runtime — you can catch errors early on.
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
                <h6 class="card-heading">Strongly Typed Inputs and Outputs</h6>
                <p class="card-para">
                  Declare data types for your inputs and outputs, and Kestra will enforce them, raising errors if the data doesn't match the expected types.
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
                <h6 class="card-heading">Seamlessly pass data between tasks</h6>
                <p class="card-para">
                  Kestra's internal storage allows to easily pass data between tasks while maintaining data privacy.
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
  background-color: $black-4;

    :deep(section) {
        .subtitle {
            max-width: calc($spacer * 37.5);
            p > span {
                background: linear-gradient(90deg, #e151f7 24.82%, #5c47f5 76.81%) !important;
                background-clip: text !important;
                -webkit-background-clip: text !important;
            }
        }
    }
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
</style>