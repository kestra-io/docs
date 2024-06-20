<template>
    <div>
        <Head>
          <Title>Kestra for Healthcare</Title>
          <Meta name="description" content="Streamline data processing, accelerate research, and enhance collaboration with Kestra’s advanced orchestration and scheduling solutions" />
        </Head>

        <UseCasesEngineersHeader
            titleHtml="Transform<br> <span>Healthcare</span> <br> with Automated<br> Workflows"
            description="Streamline data processing, accelerate research, and enhance collaboration with Kestra’s advanced orchestration and scheduling solutions"
            imageSrc="/landing/usecases/healthcare/header-hero.svg"
        />
        <NuxtLazyHydrate when-visible>
            <UseCasesDeploymentChallenges
                :titleHtml="challengesTitle"
                :cardsData="cardsData"
            />
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <UseCasesDeploymentCompanyInfo
                titleHtml="Sophia Genetics, reducing its Processing Time From Days to Minutes with Kestra"
                description="Sophia Genetics implemented Kestra to automate their genetic data processing, achieving a  reduction in processing time and significantly increasing accuracy, leading to improved patient outcomes and more efficient research processes. Kestra transforms genomic sequence analysis operations by saving time and improving data accuracy."
                imageSrc="/landing/usecases/automotive/visual.svg"
                logoPath="/landing/companies/sophia-genetics.svg"
                logoAlt="Sophia Genetics"
                logoWidth="208px"
            />
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <UseCasesDeploymentBusinessByUs
                percent="500"
                percentText="In workflow delivery "
                mainInfoHtml="“Kestra adapts to any tool thanks to it’s plugin and <br> it’s easy for anyone to understand”"
                :companyInfo="companyInfo"
            />
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <UseCasesDeploymentUnlockPotential
                title="Automotive Ecosystem"
                description="Kestra empowers data engineers, software engineers, and platform engineers in the automotive industry to create custom workflows effortlessly, ensuring seamless operations and optimized performance across all processes."
                logoPath="/landing/usecases/healthcare/heart-pulse.svg"
                logoAlt="car hatchback"
                strokeColor="#3991FF"
            />
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <div class="enterprise-edition">
                <FeaturesEnterpriseEdition
                    logoPath="/landing/usecases/healthcare/enterprise-edition.svg"
                />
            </div>
        </NuxtLazyHydrate>
    </div>
</template>

<script>
    import RefreshAuto from "vue-material-design-icons/RefreshAuto.vue";
    import CommentQuoteOutline from "vue-material-design-icons/CommentQuoteOutline.vue";
    import ChartBellCurve from "vue-material-design-icons/ChartBellCurve.vue";
    import FileChartOutline from "vue-material-design-icons/FileChartOutline.vue";
    import ImageFilterCenterFocus from "vue-material-design-icons/ImageFilterCenterFocus.vue";

    export default {
        data() {
            return {
              challengesTitle: `Use Cases in  <span>Healthcare</span>`,
              cardsData: [
                {
                  icon: RefreshAuto ,
                  cardInfo: {
                    title: 'Healthcare  Data Management',
                    description: 'Automates the integration and management of patient data from various sources, ensuring that records are always updated and accurate.'
                  },
                },
                {
                  icon: CommentQuoteOutline,
                  cardInfo: {
                    title: 'Genomic Data Processing',
                    description: 'Process large volumes of genomic data quickly and accurately. Kestra automates sequencing workflows and data analysis, significantly cutting down processing times and minimizing errors,'
                  },
                },
                {
                  icon: ChartBellCurve,
                  cardInfo: {
                    title: 'Regulatory Compliance',
                    description: 'Automate the generation of compliance reports, access logs, and data usage reports. Ensure  compliance with regulatory standards reducing the risk of breaches and improving data governance.'
                  },
                },
                {
                  icon: FileChartOutline,
                  cardInfo: {
                    title: 'Predictive Analytics',
                    description: ' Integrates your workflows with machine learning models and analytics platforms to utilize patient data for predictive analytics.'
                  },
                },
                {
                  icon: ImageFilterCenterFocus,
                  cardInfo: {
                    title: 'Streamlined Data Management',
                    description: 'Centralize your fragmented data workflow into a unified control plane, thereby simplifying orchestration and improving efficiency.'
                  },
                },
              ],
              dataOrchestration: [
                {
                  id: 1,
                  title: 'Change data capture',
                  description: 'Streamline Complex Data Pipelines and Automate Repetitive Tasks for Enhanced Efficiency',
                  imageSource: '/landing/usecases/data-engineers/data-capture.svg',
                  imageAlt: 'Change data capture',
                  pageHref: '/use-cases/change-data-capture'
                },
                {
                  id: 2,
                  title: 'Modern Data Stack Integration',
                  description: 'Integrate leading data tools from the Modern Data Stack with Kestra',
                  imageSource: '/landing/usecases/data-engineers/data-stack.svg',
                  imageAlt: 'Data Stack',
                  pageHref: '/use-cases/modern-data-stack'
                },
                {
                  id: 3,
                  title: 'CI/CD for your Kestra Workflows',
                  description: 'Embrace software engineering practices for versioning, deploying, and maintaining data workflows',
                  imageSource: '/landing/usecases/data-engineers/ci-cd.svg',
                  imageAlt: 'CI/CD',
                  pageHref: '/use-cases/ci-cd'
                },
              ],
              companyInfo: {
                personName: 'Ruben Boniz Martinez',
                personRole: 'Team Lead',
                logo: '/landing/companies/quadis.svg',
                logoAlt: 'Quadis',
              }
            }
        },
    }
</script>
<style lang="scss" scoped>
    :deep(.container-fluid) {
        &::after {
            background: linear-gradient(180deg, rgba(23, 130, 255, 0) 0%, #1782FF 100%);
        }

        h1 {
            span {
                background: linear-gradient(96.15deg, #51CFF7 13.99%, #4782F5 58.72%);
                background-clip: text;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
        }
    }

    :deep(.title-block) {
        .title {
            span {
                background: linear-gradient(94.69deg, #51CFF7 57.35%, #4782F5 95.94%) !important;
                background-clip: text !important;
                -webkit-background-clip: text !important;
                -webkit-text-fill-color: transparent !important;
            }
        }
    }

    :deep(.cards-container) {
        &::after {
            background: linear-gradient(180deg, rgba(24, 241, 255, 0) 0%, #1782FF 100%) !important;
            bottom: 35% !important;
            width: 15rem !important;
            height: 15rem !important;
            left: 40% !important;
        }
    }

    :deep(.card-icon) {
        &::before {
            background: linear-gradient(134.95deg, #A7EAFF 18.11%, #10C2FB 100%) !important;
        }

        .material-design-icon {
            filter: drop-shadow(2px 4px 4px rgba(36, 68, 171, 0.25));

            svg path {
                fill: url(#featureiconsgradientBlue) !important;
            }
        }
    }

    :deep(.business-container) {
        &::after, &::before {
            background: linear-gradient(180deg, rgba(24, 172, 255, 0) 0%, #309AE6 100%);
        }

        .subtitle {
            color: #5BB8FF !important;
        }

        .icon-block {
            img {
                filter: brightness(0) saturate(100%) invert(77%) sepia(54%) saturate(4726%) hue-rotate(183deg) brightness(104%) contrast(104%);
            }
        }
    }

    :deep(.title-animate) {
        background: linear-gradient(94.69deg, #51CFF7 57.35%, #4782F5 95.94%) !important;
        background-clip: text !important;
        -webkit-background-clip: text !important;
        -webkit-text-fill-color: transparent !important;
    }

    .enterprise-edition {
        :deep(.container) {
            &::after {
                width: 365px !important;
                background: linear-gradient(139.54deg, #3991FF 63.37%, rgba(89, 188, 245, 0) 90.85%) !important;
            }


        }
    }

    :deep(.btn-purple-animated) {
        &::before {
            background: conic-gradient(#0a60fd, #0a60fd 10%, #0a60fd, transparent 50%, #0a60fd) !important;
        }

        &::after {
            background: #1761FD;
        }

        &:hover {
            box-shadow: 1px 2px 4px 0px rgba(10, 96, 253, 0.29), 3px 6px 7px 0px rgba(10, 96, 253, 0.26), 7px 14px 10px 0px rgba(10, 96, 253, 0.15), 13px 25px 11px 0px rgba(10, 96, 253, 0.04), 20px 40px 12px 0px rgba(101, 24, 216, 0.01);

            &::after {
                background: #0a60fd;
            }
        }
    }

    :deep(.btn-dark-animated) {
        &::before {
            background: conic-gradient(#0a60fd, rgba(10, 81, 196, 0.7) 10%, #0a51c4, transparent 50%, #0a60fd) !important;
        }

        &:hover {
            box-shadow: 1px 2px 4px 0px rgba(10, 96, 253, 0.29), 3px 6px 7px 0px rgba(10, 96, 253, 0.26), 7px 14px 10px 0px rgba(10, 96, 253, 0.15), 13px 25px 11px 0px rgba(10, 96, 253, 0.04), 20px 40px 12px 0px rgba(101, 24, 216, 0.01);

            &::after {
                background: #0a60fd;
            }
        }
    }
</style>


