
<template>
  <div class="container-fluid">
    <Section subtitle="Workflow Design and Management" subtitle-before="Seamless">
      <div class="container">
        <div class="row d-flex justify-content-center">
          <div class="col-12 col-md-6 col-lg-3 mb-4" v-for="cardItem in mainContent">
              <Card
                  :icon="cardItem.icon"
                  :title="cardItem.title"
                  :description="cardItem.description || null"
                  :descriptionHtml="cardItem.descriptionHtml || null"
              />
          </div>
        </div>
      </div>
    </Section>
  </div>
</template>

<script setup>
    import RocketLaunch from "vue-material-design-icons/Typewriter.vue";
    import TimelineCheckOutline from "vue-material-design-icons/TimelineCheckOutline.vue";
    import Web from "vue-material-design-icons/Web.vue";
    import CodeBrackets from "vue-material-design-icons/CodeBrackets.vue";
    import SmokeDetectorVariantAlert from "vue-material-design-icons/SmokeDetectorVariantAlert.vue";
    import Git from "vue-material-design-icons/Git.vue";
    import ViewModuleOutline from "vue-material-design-icons/ViewModuleOutline.vue";
    import ChartBar from "vue-material-design-icons/ChartBar.vue";
    import FolderEditOutline from "vue-material-design-icons/FolderEditOutline.vue";
    import BugCheckOutline from "vue-material-design-icons/BugCheckOutline.vue";
    import Github from "vue-material-design-icons/Github.vue";

    const mainContent = [
      {
        icon: RocketLaunch,
        title: 'Get started in minutes',
        descriptionHtml: `
             Create and run your workflows from the embedded code editor using a simple,
                  <a href="https://kestra.io/features/declarative-data-orchestration"
                    class="highlight-underline">declarative configuration</a>.`,
      },
      {
        icon: TimelineCheckOutline,
        title: 'Discover errors before it\'s too late',
        description: 'Kestra detects syntax errors while you type, helping you fix the issues before runtime.',
      },
      {
        icon: Web,
        title: 'Code in any language',
        description: 'Build your business logic in any language including Python, R, Julia, Shell, Powershell, and Node.js.',
      },
      {
        icon: CodeBrackets,
        title: 'Everything as code',
        description: 'Deploy workflows as software for easier collaboration and tracking of changes.',
      },
      {
        icon: SmokeDetectorVariantAlert,
        title: 'File detection triggers',
        description: 'Process new files as they come in using event-driven communication between applications.',
      },
      {
        icon: Git,
        title: 'Versioning',
        description: 'All workflows are automatically versioned, allowing you to easily compare changes and roll back when needed.',
      },
      {
        icon: ViewModuleOutline,
        title: 'Modularity',
        description: 'Define your default task or plugin configuration, and use subflows to eliminate boilerplate code.',
      },
      {
        icon: ChartBar,
        title: 'Data validation',
        description: 'Guarantee that your incoming and outgoing data adheres to the schema and quality constraints.',
      },
      {
        icon: FolderEditOutline,
        title: 'Versioning',
        description: 'All workflows are automatically versioned, allowing you to easily compare changes and roll back when needed.',
      },
      {
        icon: BugCheckOutline,
        title: 'Versioning',
        description: 'All workflows are automatically versioned, allowing you to easily compare changes and roll back when needed.',
      },
      {
        icon: Github,
        title: 'Versioning',
        description: 'All workflows are automatically versioned, allowing you to easily compare changes and roll back when needed.',
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

.container-fluid {
  background-color: $black-4;
}

.container {
  background-image: url(/landing/features/mask.svg);
  position: relative;
  z-index: 10;

  &::before {
    content: "";
    position: absolute;
    width: 625px;
    height: 400px;
    background: linear-gradient(
      140deg,
      rgba(70, 24, 255, 0) -41.95%,
      #7e1cfa 77.28%
    );
    filter: blur(130px);
    left: 19.6rem;
    top: 31rem;
    z-index: 0;
  }
}
</style>