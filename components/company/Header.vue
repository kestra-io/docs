<template>
    <div class="main">
        <div class="container text-center">
            <p data-aos="fade-left">About kestra</p>
            <h2 data-aos="fade-right">Building the <span>Future</span> of Orchestration and Automation</h2>
        </div>
    </div>
    <div class="container">
        <Section
            subtitle="Our"
            subtitle-after="Mission"
        >
            <div class="container text-center baseline-max-width" data-aos="fade-left">
                <p>
                    Nowadays, companies need to grapple with tools that are either too complex, too rigid, or too specialized. From the steep learning curve of complex orchestration framework to the rigidness of no-code solutions and the siloed nature of specialized tools, businesses are left with fragmented systems, operational inefficiencies, and a lack of clarity and collaboration.
                </p>
                <p>
                    Kestra is an open-source, event-driven orchestration platform that solves these challenges by <strong>simplifying</strong> orchestration, <strong>unifying</strong> disparate tools, improving <strong>alignment</strong> between engineers and business users, and bringing <strong>structure</strong> to business-critical operations so that you can build reliable workflows and manage them with confidence.
                </p>
            </div>
        </Section>
    </div>
</template>

<script>
    import Section from '../../components/layout/Section.vue';
    export default {
        components: {Section}
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .main {
        background: url("/landing/company/header.svg") no-repeat bottom center;
        color: var(--bs-white);
        padding-top: calc($spacer * 10);
        margin-top: -80px;
        padding-bottom: calc($spacer * 5);

        .container {
            p {
                color: $white;
                font-size: $font-size-xl;
                font-weight: 300;
            }

            h2 {
                color: $white;
                font-size: $font-size-4xl;
                font-weight: 400;
                max-width: 45%;
                margin: 0 auto;

                @include media-breakpoint-down(xl) {
                    max-width: 100%;
                }

                span {
                    background: linear-gradient(90deg, #E151F7 62.38%, #E151F7 63.52%, #5C47F5 97.62%);
                    background-clip: text;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
            }
        }
    }

    :deep(section) {
        .subtitle, .subtitle p {
            margin-bottom: 0;
        }
        .main {
            padding-top: 1rem !important;
        }

        .baseline-max-width {
            margin: 0 auto;

            p {
                color: $white;
                font-size: $h6-font-size;
                font-weight: 400;
            }
        }
    }

    .team-image {
        margin-top: -10rem;
    }
</style>