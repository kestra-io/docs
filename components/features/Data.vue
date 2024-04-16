<template>
  <div class="container-fluid">
    <Section subtitle="Centralized Data Control for" subtitle-after="Improved Efficiency">
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
  import CodeBrackets from "vue-material-design-icons/CodeBrackets.vue";
  import ViewDashboard from "vue-material-design-icons/ViewDashboard.vue";
  import TextBoxSearchOutline from "vue-material-design-icons/TextBoxSearchOutline.vue";
  import FormatLetterEndsWith from "vue-material-design-icons/FormatLetterEndsWith.vue";
  import FileCheckOutline from "vue-material-design-icons/FileCheckOutline.vue";
  import ArrowCollapse from "vue-material-design-icons/ArrowCollapse.vue";
  import KeyStar from "vue-material-design-icons/KeyStar.vue";

  const mainContent = [
    {
      icon: CodeBrackets,
      title: 'Everything as Code',
      description: 'Whether you build your workflows from a local IDE or from the UI, your entire workflow configuration is always managed as code and automatically versioned.',
    },
    {
      icon: ViewDashboard,
      title: 'Everything from the UI',
      description: 'Create, edit and run your workflows from the integrated code editor in the UI, without having to set up local development environment or managing heavy worker processes.',
    },
    {
      icon: TextBoxSearchOutline,
      title: 'Built-in documentation',
      description: 'The built-in code editor includes a documentation for all tasks and triggers. An up-to-date description of properties, and hands-on examples are at your fingertips.',
    },
    {
      icon: FormatLetterEndsWith,
      title: 'Autocompletion',
      description: 'The embedded code editor provides syntax highlighting and autocompletion for all task and trigger properties, significantly improving your productivity.',
    },
    {
      icon: FileCheckOutline,
      title: 'Syntax Validation',
      description: 'The embedded code editor provides real-time syntax validation as you type, ensuring that your workflows are always valid. No more surprises at runtime — you can catch errors early on.',
    },
    {
      icon: ArrowCollapse,
      title: 'Strongly Typed Inputs and Outputs',
      description: 'Declare data types for your inputs and outputs, and Kestra will enforce them, raising errors if the data doesn\'t match the expected types.',
    },
    {
      icon: KeyStar,
      title: 'Seamlessly pass data between tasks',
      description: 'Kestra\'s internal storage allows to easily pass data between tasks while maintaining data privacy.',
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
</style>