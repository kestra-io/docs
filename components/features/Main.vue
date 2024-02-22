<template>
  <div class="container">
    <Section subtitle="Add New Workflows in Minutes." subtitle-after="No Ops Required.">
      <div class="item workflow-1 row pb-5">
        <div class="col-md-6 p-5 text-white" data-aos="fade-right">
          <h3 class="card-heading">
            API-first design with declarative workflow definition
          </h3>
          <ul class="card-detail">
            <li>
              <strong>Strong typing and autocompletion:</strong> iterate
              quickly when adding new flows, triggers and tasks. If something
              is incorrect in your workflow definition, you will know in
              advance thanks to the built-in syntax validation.
            </li>
            <li class="py-4">
              <strong>Support for data-mesh:</strong> thanks to the simple
              <NuxtLink href="/features/declarative-data-orchestration" class="highlight-underline">YAML interface
              </NuxtLink>, built-in documentation and blueprints, domain experts can
              build their own workflows, too.
            </li>
            <li>
              <strong>Intuitive UI built not only for engineers:</strong> when
              you add workflows directly from the UI, the live-updating
              topology view helps you see dependencies between processes,
              systems and tasks.
            </li>
          </ul>
        </div>
        <div class="col-md-6" data-aos="fade-right">
          <img class="img-fluid img-api" src="/landing/features/declarative1.svg" alt="API-first design with declarative workflow definition" />
        </div>
      </div>

      <div class="item workflow-2 row mb-5 mt-5">
        <div class="col-md-6 order-1 order-md-0" data-aos="fade-left">
          <img class="img-fluid img-execute" src="/landing/features/execute.svg" alt="Iterate faster without the overhead of CI/CD" />
        </div>
        <div class="col-md-6 p-5 text-white order-0 order-md-1" data-aos="fade-left">
          <h3 class="card-heading">
            Iterate faster without the overhead of CI/CD
          </h3>
          <ul class="card-detail">
            <li>
              <strong>Less time spent babysitting orchestration code:</strong>
              Seamlessly configure your tasks to run sequentially, in parallel
              or only based on a specific condition or presence of events
              without having to navigate convoluted orchestration code bases.
            </li>
            <li class="py-4">
              <strong>Intuitive dependency management:</strong> Easily manage
              task dependencies — defining the sequence of tasks is as simple
              as listing them in the order you want them to run.
            </li>
            <li>
              <strong>Built-in documentation and blueprints:</strong> No need
              to navigate bulky documentation to figure out the right task or
              trigger properties — they are available right next to your code
              editor.
            </li>
          </ul>
        </div>
      </div>

      <div class="item workflow-3 row mb-5">
        <div class="col-md-6 p-5 text-white" data-aos="fade-right">
          <h3 class="card-heading">
            Flexible Event-Driven Workflow Execution
          </h3>
          <ul class="card-detail">
            <li>
              <strong>Time-based scheduling:</strong> workflows run
              automatically at specific times, such as daily, weekly, or
              monthly without the need for manual intervention or inspecting
              crontabs.
            </li>
            <li class="pt-4">
              <strong>Event-based orchestration:</strong> automate your tasks based on real-time events. Trigger workflows to run
              automatically in response to events, such as the arrival of new
              data in a database, file detection in your S3 bucket,
              new message in a message queue, or the completion of other
              workflows.
            </li>
          </ul>
        </div>
        <div class="col-md-6" data-aos="fade-right">
          <img class="img-fluid img-event" src="/landing/features/flowable.svg" alt="Flexible Event-Driven Workflow Execution" />
        </div>
      </div>

      <div class="item workflow-4 row pb-5 mb-n5">
        <div class="col-md-6 order-1 order-md-0" data-aos="fade-left">
          <img class="img-fluid img-monitor" src="/landing/features/monitor.svg" alt="Execute and Monitor in Real Time  " />
        </div>
        <div class="col-md-6 p-5 order-0 order-md-1 text-white" data-aos="fade-left">
          <h3 class="card-heading">Execute and Monitor in Real Time</h3>
          <ul class="card-detail">
            <li>
              <strong>Real-time Workflow Monitoring:</strong> track workflow execution state and the health of your platform in real-time. Troubleshoot failure by restarting failed workflow executions or run a full-text search on the workflow execution logs to identify the root cause.
            </li>
            <li class="pt-4">
              <strong>Actionable Insights:</strong> build custom dashboards to track workflow performance using built-in outputs and metrics. Thanks to a standardized format that Kestra uses, all your workflow metrics can be visualized in Grafana or Kibana.
            </li>
          </ul>
        </div>
      </div>
    </Section>
  </div>
</template>

<script>
import Section from '../layout/Section.vue';

export default {
  components: { Section }
}
</script>

<style lang="scss" scoped>
@import "../../assets/styles/variable";

.container {
  margin-top: -120px;
  border-bottom: $container-border;
  margin-bottom: -100px;
  :deep(section) {

    .subtitle {
      margin: 0 !important;
      max-width: 52%;

      @include media-breakpoint-down(lg) {
        max-width: 100%;
      }

      p {
        text-align: left !important;
      }
    }
  }

  .card-heading {
  color: #ffffff !important;
  font-weight: 300 !important;
  line-height: 2.8rem !important;
  font-size: $h2-font-size !important;
}

.card-detail {
  line-height: 1.5rem !important;
  font-weight: 300 !important;
}

.img-api{
  transform: scale(1.4);
}
.img-execute{
  transform: scale(0.9);
}
.img-event{
  transform: scale(1.3);
}
.img-monitor{
  transform: scale(0.9);
}

.highlight-underline {
  text-decoration: underline !important;
}

  .item {
    h3 {
      color: $white;
      font-family: $font-family-sans-serif;
      font-size: 49px;
      font-style: normal;
      font-weight: 300;
      line-height: 54px;
    }

    p {
      color: #DEE0E4;
      font-family: $font-family-sans-serif;
      font-size: 18px;
      font-style: normal;
      font-weight: 400;
      line-height: 26px;
    }

  }

  .workflow {
    &-1,
    &-2,
    &-3,
    &-4,
    &-5 {
      h3 {
        position: relative;
      }

      @include media-breakpoint-down(md) {
        margin-top: 0 !important;
        padding-top: 0 !important;

        h3:before {
          display: none !important;
        }
      }
    }

    &-1 {
      padding-top: 115px;
      background-size: 50%;

      h3:before {
        background: url("../../public/landing/how/connection-line-1.svg");
        width: 217px;
        height: 220px;
        background-size: contain;
        background-repeat: no-repeat;
        content: "";
        position: absolute;
        top: -220px;
        left: 50%;
        transform: translateX(-50%);

        @include media-breakpoint-down(lg) {
          left: 80%;
        }
      }
    }

    &-2 {
      margin-top: 100px;

      @include media-breakpoint-down(xxl) {
        margin-top: 175px;
      }

      @include media-breakpoint-down(xl) {
        margin-top: 245px;
      }

      @include media-breakpoint-down(lg) {
        margin-top: 130px;
      }

      h3:before {
        background: url("../../public/landing/how/connection-line-2.svg");
        width: 677px;
        height: 280px;
        background-size: contain;
        background-repeat: no-repeat;
        content: "";
        position: absolute;
        top: -277px;
        left: -8%;
        transform: translateX(-50%);

        @include media-breakpoint-down(xxl) {
          left: -18%;
        }

        @include media-breakpoint-down(xl) {
          top: -235px;
          left: -7%;
          width: 370px;
        }

        @include media-breakpoint-down(lg) {
          top: -230px;
          left: -7%;
          width: 370px;
        }
      }
    }

    &-3 {
      margin-top: 122px;

      @include media-breakpoint-down(xxl) {
        margin-top: 146px;
      }

      h3:before {
        background: url("../../public/landing/how/connection-line-3.svg");
        width: 665px;
        height: 700px;
        background-size: contain;
        background-repeat: no-repeat;
        content: "";
        position: absolute;
        top: -425px;
        left: 30%;

        @include media-breakpoint-down(xl) {
          top: -260px;
          left: 50%;
          width: 425px;
        }

        @include media-breakpoint-down(lg) {
          top: -260px;
          left: 22%;
          width: 425px;
        }
      }
    }

    &-4 {
      padding-top: 96px;
      background-size: 45%;

      @include media-breakpoint-down(lg) {
        padding-top: 270px;
      }

      h3:before {
        background: url("../../public/landing/how/connection-line-4.svg");
        width: 550px;
        height: 445px;
        background-size: contain;
        background-repeat: no-repeat;
        content: "";
        position: absolute;
        top: -438px;
        left: -26%;
        transform: translateX(-50%);

        @include media-breakpoint-down(xxl) {
          width: 510px;
          top: -467px;
          left: -30%;
        }

        @include media-breakpoint-down(xl) {
          top: -260px;
          left: -25%;
          width: 290px;
        }

        @include media-breakpoint-down(lg) {
          top: -430px;
          left: -10%;
          width: 470px;
        }
      }
    }
  }

}</style>
