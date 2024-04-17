<template>
  <div class="container-fluid">
    <Section subtitle="Development and Deployment" subtitle-before="Accelerate">
      <div class="container">
        <div class="row d-flex justify-content-center">
            <div class="col-12 col-md-6 col-lg-3 mb-4" v-for="cardItem in mainContent">
                <Card
                    :icon="cardItem.icon"
                    :title="cardItem.title"
                    :description="cardItem.description"
                />
            </div>
        </div>
      </div>
    </Section>
  </div>
</template>

<script setup>
  import Github from "vue-material-design-icons/Github.vue";
  import Docker from "vue-material-design-icons/Docker.vue";
  import TimelineClockOutline from "vue-material-design-icons/TimelineClockOutline.vue";
  import Webhook from "vue-material-design-icons/Webhook.vue";
  import ChartAreaspline from "vue-material-design-icons/ChartAreaspline.vue";
  import AlertCircle from "vue-material-design-icons/AlertCircle.vue";
  import BellRing from "vue-material-design-icons/BellRing.vue";
  import ArrowCollapseAll from "vue-material-design-icons/ArrowCollapseAll.vue";
  import RefreshCircle from "vue-material-design-icons/RefreshCircle.vue";
  import ArrangeSendBackward from "vue-material-design-icons/ArrangeSendBackward.vue";
  import LanguageJava from "vue-material-design-icons/LanguageJava.vue";

  const mainContent = [
    {
      icon: Github,
      title: 'CI/CD Deployment',
      description: 'Automate your Kestra deployments with CI/CD integrations for Terraform, GitHub Actions, GitLab, and BitBucket.',
    },
    {
      icon: Docker,
      title: 'Worry-free Production Deployments',
      description: 'Reliable deployments without package dependency conflicts. Script tasks are executed in Docker.',
    },
    {
      icon: TimelineClockOutline,
      title: 'Real-Time Events',
      description: 'Flow execution based on event triggers including file detection, message queues, completion of certain flows, or results of a SQL query or API call.',
    },
    {
      icon: Webhook,
      title: 'API-first',
      description: 'Endless possibilities to start a flow through API, using a webhook, waiting for a trigger, or simply starting directly from the Web UI.',
    },
    {
      icon: ChartAreaspline,
      title: 'Monitoring',
      description: 'Dashboards and metrics directly in the User Interface.',
    },
    {
      icon: AlertCircle,
      title: 'Error Handling',
      description: 'Handle errors automatically and retry failed tasks.',
    },
    {
      icon: BellRing,
      title: 'Notifications',
      description: 'Easily configure alerts to get notified on workflow completion, delay or failure.',
    },
    {
      icon: ArrowCollapseAll,
      title: 'Process Data at Scale',
      description: 'Use our distributed mapping capabilities to easily process large amounts of data at scale.',
    },
    {
      icon: RefreshCircle,
      title: 'Micro-Batch CDC',
      description: 'Capture changed data at regular intervals and process them in micro-batches, reducing the complexity and maintenance costs of real-time systems.',
    },
    {
      icon: ArrangeSendBackward,
      title: 'No single point of failure',
      description: 'Horizontal and vertical scaling without worrying about resource allocation.',
    },
    {
      icon: LanguageJava,
      title: 'Performance Gains',
      description: 'Use the benefits of JVM (Java Virtual Machine) technology for better performance and memory management.',
    },
  ]
</script>

<script>
  import Section from "../layout/Section.vue";
  import Card from '../card/Card.vue';
  export default {
    components: { Section, Card },
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

    :deep(.card) {
        padding: 4rem 2rem 2rem !important;

        .card-body {
            gap: calc($spacer * 0.5) !important;
            .title-block {
                flex-direction: column;

                .card-title {
                    line-height: 2rem;
                }
            }

            .card-text {
                line-height: calc($spacer * 1.375);

                a {
                    color: $purple-36;
                    text-decoration: underline;
                }
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
</style>