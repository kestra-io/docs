<template>
    <div class="container mb-5">
        <Section :subtitle="subtitle" :subtitle-after="subtitleAfter">
            <div class="row">
                <div v-for="_case in cases" class="col-md-4" data-usal="fade-r">
                    <a :href="_case.link" class="d-flex flex-column gap-2">
                        <div class="img-block bg-dark-2">
                            <img class="img-fluid" :src="_case.img" :alt="_case.title" />
                        </div>
                        <h4 class="title">{{ _case.title }}</h4>
                        <p>{{ _case.description }}</p>
                    </a>
                </div>
            </div>
        </Section>
    </div>
</template>

<script>
    import Section from "~/components/layout/Section.vue"

    export default {
        components: { Section },
        data: () => ({
            ...useCases,
        }),
    }

    const useCases = {
        subtitle: "Find Out More About Kestra's",
        subtitleAfter: "Capabilities",
        cases: [
            {
                link: "/use-cases/change-data-capture",
                img: "/landing/usecases/cdc/intro.svg",
                title: "Change data capture",
                description:
                    "Streamline Complex Data Pipelines and Automate Repetitive Tasks for Enhanced Efficiency",
            },
            {
                link: "/use-cases/modern-data-stack",
                img: "/landing/usecases/mds/intro.svg",
                title: "Modern Data Stack Integration",
                description: "Integrate leading data tools from the Modern Data Stack with Kestra",
            },
            {
                link: "/use-cases/ci-cd",
                img: "/landing/usecases/cicd/intro.svg",
                title: "CI/CD for your Kestra Workflows",
                description:
                    "Embrace software engineering practices for versioning, deploying, and maintaining data workflows",
            },
        ],
    }
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    .container {
        :deep(section) {
            .subtitle {
                max-width: 70%;

                @include media-breakpoint-down(lg) {
                    max-width: 100%;
                }
            }
        }

        .row > div {
            position: relative;
        }

        h4 {
            font-size: $h5-font-size;
            font-weight: 700;
        }

        p {
            font-size: $font-size-md;
            font-weight: 400;
        }

        h4,
        p {
            color: $white;
            font-family: $font-family-sans-serif;
            font-style: normal;
            margin: 0;
        }

        .img-block {
            border-radius: 8px;
            border: $block-border;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 192.01px;
            padding: calc($spacer * 0.25);

            .img-fluid {
                height: 100%;
            }
        }
    }
</style>