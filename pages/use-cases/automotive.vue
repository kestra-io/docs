<template>
    <div>
        <Head>
          <Title>Kestra for Automotive</Title>
          <Meta name="description" content="Kestra empowers data engineers, software engineers, and platform engineers in the automotive industry to create custom workflows effortlessly." />
        </Head>

        <UseCasesEngineersHeader
            titleHtml="Drive Orchestration<br> for <span>Automotive</span><br>Suppliers"
            description="Kestra empowers data engineers, software engineers, and platform engineers in the automotive industry to create custom workflows effortlessly."
            imageSrc="/landing/usecases/automotive/header-hero.svg"
        />
        <NuxtLazyHydrate when-visible>
            <UseCasesDeploymentChallenges
                :titleHtml="challengesTitle"
                :cardsData="cardsData"
            />
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <UseCasesDeploymentCompanyInfo
                titleHtml="Quadis trust Kestra for Its<br> Business Critical<br> Operations"
                description="Quadis, the largest car retailer in Spain, relies on Kestra to streamline its daily operations, from financial reporting to car delivery alerting. Kestra will support their new data lake architecture, enhancing data analytics, internal web scraping, and resource optimization using AWS services."
                imageSrc="/landing/usecases/automotive/visual.svg"
                logoPath="/landing/companies/quadis.svg"
                logoAlt="Quadis"
                logoWidth="208px"
                storeLink="/blogs/2024-06-13-quadis"
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
                logoPath="/landing/usecases/automotive/car-hatchback.svg"
                logoAlt="car hatchback"
                strokeColor="#E3262F"
                :unlockContent="unlockContent"
            />
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <div class="enterprise-edition">
                <FeaturesEnterpriseEdition
                    logoPath="/landing/usecases/automotive/enterprise-edition.svg"
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
              challengesTitle: `Use Cases in  <span>Automotive</span>`,
              cardsData: [
                {
                  icon: RefreshAuto ,
                  cardInfo: {
                    title: 'Predictive Maintenance',
                    description: 'Use Kestra to orchestrate data from sensors and IoT devices, triggering maintenance workflows based on predictive analytics to reduce downtime and maintenance costs.'
                  },
                },
                {
                  icon: CommentQuoteOutline,
                  cardInfo: {
                    title: 'Data Gathering',
                    description: 'From multiple car dealerships to  warehouses, maintain financial health and operational transparency of all your suppliers or ressellers from a single place.'
                  },
                },
                {
                  icon: ChartBellCurve,
                  cardInfo: {
                    title: 'Quality Control Automation',
                    description: 'Automate quality control processes by orchestrating data from various stages of the manufacturing or supply process, ensuring real-time defect detection and quality assurance.'
                  },
                },
                {
                  icon: FileChartOutline,
                  cardInfo: {
                    title: 'Inventory Management',
                    description: 'Manage  vast inventory across numerous dealerships. Automated workflows handle data collection, processing, and analysis, enabling real-time inventory tracking and optimization.'
                  },
                },
                {
                  icon: ImageFilterCenterFocus,
                  cardInfo: {
                    title: 'Delivery Alerting',
                    description: 'Automate car delivery alerts, ensuring customers are notified promptly when their vehicle or package is ready for pickup. '
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
              },
              unlockContent: {
                leftContent: [
                  { title: 'Plugin Ecosystem', description: 'Capabilities for real-time data processing and decision-making, critical for time-sensitive automotive operations.' },
                  { title: 'Monitoring and Alerting', description: 'Kestra’s intuitive interface and comprehensive documentation make it easy for automotive engineers to quickly build and deploy powerful workflows.' },
                ],
                rightContent: [
                  { title: 'Real-Time Processing', description: 'Extensive plugin support for various data sources and destinations, allowing seamless integration with existing automotive systems.' },
                  { title: 'Quick to Learn, Easy to Master', description: 'Robust monitoring and alerting features that ensure proactive issue resolution, minimizing operational disruptions.' },
                ]
              }
            }
        },
    }
</script>
<style lang="scss" scoped>
    :deep(.container-fluid) {
        &::after {
            background: linear-gradient(180deg, rgba(253, 114, 120, 0) 11.24%, #E3262F 72.98%);
        }

        h1 {
            span {
                background: linear-gradient(90.03deg, #E3262F 57.94%, #AB0009 87.71%);
                background-clip: text;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
        }
    }

    :deep(.title-block) {
        .title {
            span {
                background: linear-gradient(90.03deg, #E3262F 57.94%, #AB0009 87.71%) !important;
                background-clip: text !important;
                -webkit-background-clip: text !important;
                -webkit-text-fill-color: transparent !important;
            }
        }
    }

    :deep(.cards-container) {
        &::after {
            background: linear-gradient(180deg, rgba(253, 114, 120, 0) 11.24%, #E3262F 72.98%) !important;
            bottom: 35% !important;
            width: 15rem !important;
            height: 15rem !important;
            left: 40% !important;
        }
    }

    :deep(.card-icon) {
        &::before {
            background: linear-gradient(134.95deg, #E3262F 18.11%, #FCD8DF 27.65%, #DB2727 36.31%, rgba(219, 39, 39, 0) 58.84%, rgba(252, 108, 108, 0.84) 80.5%) !important;
        }

        .material-design-icon {
            filter: drop-shadow(2px 4px 4px rgba(171, 29, 28, 0.25));

            svg path {
                fill: url(#featureiconsgradientRed) !important;
            }
        }
    }

    :deep(.business-container) {
        &::after, &::before {
            background: linear-gradient(180deg, rgba(253, 114, 120, 0) 11.24%, #E3262F 72.98%);
        }

        .subtitle {
            color: #FD9297 !important;
        }

        .icon-block {
            img {
                filter: brightness(0) saturate(100%) invert(75%) sepia(55%) saturate(5609%) hue-rotate(315deg) brightness(107%) contrast(101%);
            }
        }
    }

    :deep(.title-animate) {
        background: linear-gradient(90.03deg, #E3262F 57.94%, #AB0009 87.71%) !important;
        background-clip: text !important;
        -webkit-background-clip: text !important;
        -webkit-text-fill-color: transparent !important;
    }

    .enterprise-edition {
        :deep(.container) {
            &::after {
                width: 365px !important;
                background: linear-gradient(180deg, rgba(253, 114, 120, 0) 11.24%, #E3262F 72.98%) !important;
            }


        }
    }

    :deep(.btn-purple-animated) {
        &::before {
            background: conic-gradient(#fb1010, #ff97af 10%, #db2727, transparent 50%, #ec1010) !important;
        }

        &::after {
            background: #AB0009;
        }

        &:hover {
            box-shadow: 1px 2px 4px 0px rgba(146, 32, 32, 0.29), 3px 6px 7px 0px rgba(146, 18, 16, 0.26), 7px 14px 10px 0px rgba(216, 39, 25, 0.15), 13px 25px 11px 0px rgba(216, 31, 55, 0.04), 20px 40px 12px 0px rgba(101, 24, 216, 0.01);

            &::after {
                background: #AB0009;
            }
        }
    }

    :deep(.btn-dark-animated) {
        &::before {
            background: conic-gradient(#fb1010, #ff97af 10%, #db2727, transparent 50%, #ec1010) !important;
        }

        &:hover {
            box-shadow: 1px 2px 2px 0px rgba(146, 32, 32, 0.29), 3px 6px 7px 0px rgba(146, 18, 16, 0.26), 7px 14px 10px 0px rgba(216, 39, 25, 0.15), 13px 25px 11px 0px rgba(149, 20, 20, 0.13), 20px 40px 12px 0px rgba(101, 24, 216, 0.01);

            &::after {
                background: #771212;
            }
        }
    }
</style>


