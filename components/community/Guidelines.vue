<template>
    <div class="container-fluid">
        <div class="container">
            <Section
                subtitle="Community Guidelines"
                baseline="The Kestra community is a friendly and welcoming place for everyone."
            >
                <div class="guidelines row">
                    <div class="col-md-6 col-sm-12 p-3">
                        <Card
                            :icon="AutoMode"
                            :cardInfo="kestraCommunity"
                        />
                    </div>
                    <div class="col-md-6 col-sm-12 p-3">
                        <Card
                            :icon="ChartBoxOutline"
                            :cardInfo="makeEasy"
                        />
                    </div>
                    <div class="col-md-6 col-sm-12 p-3">
                        <Card
                            :icon="AccountGroupOutline"
                            :cardInfo="relevantChannel"
                        />
                    </div>
                    <div class="col-md-6 col-sm-12 p-3">
                        <Card
                            :icon="AccountGroupOutline"
                            :cardInfo="dontSpam"
                        />
                    </div>
                    <div class="d-flex flex-wrap justify-content-center">
                        <p>If you have any questions, don't hestitate to ask us on <a target="_blank" href="https://kestra.io/slack">Slack</a></p>
                    </div>
                </div>
            </Section>
        </div>
    </div>
</template>

<script setup>
  import AutoMode from "vue-material-design-icons/AutoMode.vue";
  import AccountGroupOutline from "vue-material-design-icons/AccountGroupOutline.vue";
  import ChartBoxOutline from "vue-material-design-icons/ChartBoxOutline.vue";
</script>

<script>
  import Section from '../../components/layout/Section.vue';
  import Card from '../card/Card.vue';

  export default {
    components: {Section, Card},
    data() {
      return {
        kestraCommunity: { title: "Be respectful to the Kestra community", descriptionHtml: "Be respectful towards other members of this Slack Community. Do not harass others. <br/><br/> Assume positive intent."},
        makeEasy: {

          title: "Make it easy to help you",
          descriptionHtml: "<ul>\n" +
            "                   <li>Please share relevant flows (YAML), logs and stack traces <a target='_blank' href='https://slack.com/intl/en-gb/help/articles/202288908-Format-your-messages'>formatted</a> in code blocks (no screenshots, please).</li><br/>\n" +
            "                   <li>Please share how you have deployed Kestra:\n" +
            "                   <ol type='a'>\n" +
            "                       <li>Deployment choices (Standalone, Docker, Kubernetes, etc.).</li>\n" +
            "                       <li>The version of Kestra.</li>\n" +
            "                       <li>Your OS and its version.</li>\n" +
            "                       </ul>\n" +
            "                   </ol>\n" +
            "               </ul>"
        },
        relevantChannel: { title: "Use relevant channels", description: "Refrain from asking questions multiple times across different channels." },
        dontSpam: { title: "Don’t spam", descriptionHtml: "While we’ll do our best to help you, there is no guaranteed timeline to answer your question. <br /><br /> If you need support with SLA guarantees, <a href='https://kestra.io/demo' target='_blank'>reach out to us.</a>" },
      };
    }
  }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";
    .container-fluid {
        background: url("/landing/community/guidelines-bg.svg") no-repeat bottom center;
        :deep(.card-body) {
            h4 {
                font-weight: 600;
                font-size: $font-size-2xl;
            }
        }
        p {
            font-weight: 500;
            font-size: $font-size-lg;
            margin-top: 64px;
            color: $white;
        }
    }
</style>