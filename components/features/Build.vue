<template>
  <div class="container-fluid">
    <Section subtitle="Development, Painless Deployment" subtitle-before="Fast">
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
                <h6 class="card-heading">CI/CD Deployment</h6>
                <p class="card-para">
                  Automate your Kestra deployments with CI/CD integrations for Terraform, GitHub Actions, GitLab, and BitBucket.
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
                <h6 class="card-heading">
                  Worry-free Production Deployments
                </h6>
                <p class="card-para">
                  Reliable deployments without package dependency conflicts. Script tasks are executed in Docker.
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
                <h6 class="card-heading">Real-Time Events</h6>
                <p class="card-para">
                  Flow execution based on event triggers including file detection, message queues, completion of certain flows, or results of a SQL query or API call.
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
                <h6 class="card-heading">API-first</h6>
                <p class="card-para">
                  Endless possibilities to start a flow through API, using a
                  webhook, waiting for a trigger, or simply starting directly
                  from the Web UI.
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
                <h6 class="card-heading">Monitoring</h6>
                <p class="card-para">
                  Dashboards and metrics directly in the User Interface.
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
                <h6 class="card-heading">Error Handling</h6>
                <p class="card-para">
                  Handle errors automatically and retry failed tasks.
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
                <h6 class="card-heading">Notifications</h6>
                <p class="card-para">
                  Easily configure alerts to get notified on workflow completion, delay or failure.
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
                <h6 class="card-heading">Process Data at Scale</h6>
                <p class="card-para">
                  Use our distributed mapping capabilities to easily process large amounts of data at scale.
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
                <h6 class="card-heading">Micro-Batch CDC</h6>
                <p class="card-para">
                    Capture changed data at regular intervals and process them in micro-batches, reducing the complexity and maintenance costs of real-time systems.
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
                <h6 class="card-heading">No single point of failure</h6>
                <p class="card-para">
                  Horizontal and vertical scaling without worrying about
                  resource allocation.
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
                <h6 class="card-heading">Performance Gains</h6>
                <p class="card-para">
                  Use the benefits of JVM (Java Virtual Machine) technology for better performance and memory management.
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
    width: 540px;
    height: 400px;
    background: linear-gradient(
      140deg,
      rgba(70, 24, 255, 0) -41.95%,
      #7e1cfa 77.28%
    );
    filter: blur(130px);
    left: 28.6rem;
    top: 31rem;
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