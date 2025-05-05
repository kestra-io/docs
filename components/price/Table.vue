<template>
    <div class="table-content" ref="tableContentRef">
        <div class="container table-responsive">
            <h3>Compare All Features</h3>
            <table class="table table-dark">
                <thead class="t-head">
                    <tr>
                        <th
                            class="t-head-title"
                            :class="{
                                        'w-50 ps-5': title === 'Features',
                                        'text-center': title !== 'Features',
                                     }"
                            v-for="(head, index) in  tableHead "
                            :key="head"
                        >
                            <div class="border-radius" :class="{
                                        'bg-gray': index !== 0,
                                   }">
                                <p>{{ head.name }}</p>
                                <span>{{ head.period }}</span>
                                <NuxtLink
                                    v-if="head?.button"
                                    :href="head?.button?.href"
                                    :class="head.name === 'Enterprise' ? 'enterprise-btn' : 'edition-btn'"
                                >
                                    {{head.button?.text}}
                                </NuxtLink>
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody class="t-head-body">
                    <tr v-for="item in tableData"
                        :key="item.id"
                        :class="!item.textBold ? '' : 'sticky-tr'"
                    >
                        <td class="ps-5 t-border-data-first-block"
                            :class="!item.textBold ? '' : 't-r-heading-text'">
                                    <span>
                                        {{item.title }}
                                    </span>
                        </td>
                        <td class="tick t-border-data">
                            <div class="bg-gray" :class="!item.textBold ? '' : 'heading-bg'">
                                <CheckBold v-if="!item.isFullLine && item.isOpenSource"/>
                                <Close class="close-svg-red" v-else-if="!item.isFullLine && !item.openSourceText"/>
                                <span class="enterprise-text" v-else-if="!item.isFullLine">{{item.openSourceText}}</span>
                            </div>
                        </td>
                        <td class="tick t-border-data">
                            <div class="bg-gray" :class="!item.textBold ? '' : 'heading-bg'">
                                <CheckBold v-if="!item.isFullLine && item.isEnterprise"/>
                                <Close class="close-svg-red" v-else-if="!item.isFullLine && !item.enterpriseText"/>
                                <span class="enterprise-text" v-else-if="!item.isFullLine">{{item.enterpriseText}}</span>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div class="collapsed-table">
        <div class="container">
            <div class="buttons">
                <div :class="selectedType === 'enterprise' ? 'enterprs-btn' : 'ops-btn'"
                     @click="changeSelectedType('enterprise')">
                    <p>Enterprise</p>
                    <span>Per Instance</span>
                </div>
                <div :class="selectedType === 'opensource' ? 'enterprs-btn' : 'ops-btn'"
                     @click="changeSelectedType('opensource')">
                    <p>Open-Source</p>
                    <span>Free</span>
                </div>
            </div>
            <div class="features">
                <CollapsedFeatures
                    v-for="(item, index) in tableSortedData"
                    :key="index"
                    class="que text-white"
                    :title="item.title"
                >
                    <div v-for="(child, childIndex) in item.children" :key="childIndex" class="feature-row">
                        <div
                            class="feature-row-title"
                            :class="{'border-bottom-none': childIndex === item.children.length - 1}"
                        >
                            <span>{{child.title}}</span>
                        </div>
                        <div
                            class="feature-row-access"
                            :class="{'border-bottom-none': childIndex === item.children.length - 1}"
                        >
                            <span
                                v-if="selectedType === 'enterprise' && child.enterpriseText">{{child.enterpriseText}}</span>
                            <span v-else-if="selectedType !== 'enterprise' && child.openSourceText">{{child.openSourceText}}</span>
                            <div v-if="selectedType === 'enterprise' && !child.enterpriseText">
                                <Close class="close-svg-red" v-if="!child.isEnterprise"/>
                                <CheckBold v-else-if="child.isEnterprise"/>
                            </div>
                            <div v-else-if="selectedType === 'opensource' && !child.openSourceText">
                                <Close class="close-svg-red" v-if="!child.isOpenSource"/>
                                <CheckBold v-else-if="child.isOpenSource"/>
                            </div>
                        </div>
                    </div>
                </CollapsedFeatures>
                <NuxtLink
                    :href="selectedType === 'enterprise' ? '/enterprise' : '/demo'"
                    :class="selectedType === 'enterprise' ? 'enterprise-btn' : 'edition-btn'"
                >
                    {{selectedType === 'enterprise' ? 'Talk to Sales' : 'Get Started'}}
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<script setup>
  import CollapsedFeatures from "../../components/layout/CollapsedFeatures.vue";
  import Close from 'vue-material-design-icons/Close.vue'
  import Plus from 'vue-material-design-icons/Plus.vue'
  import CheckBold from 'vue-material-design-icons/CheckBold.vue'
  import {ref} from "vue"

  const selectedType = ref('enterprise');
  const tableHead = ref([
    {
      name: "",
      period: "",
    },
    {
      name: 'Open-Source Edition',
      period: "Free",
      button: {
        text: "Get Started",
        href: "/docs/getting-started/quickstart#start-kestra",
      },
    },
    {
      name: 'Enterprise Edition',
      period: "Per Instance",
      button: {
        text: "Talk to us",
        href: "/demo",
      },
    },
  ]);
  const tableData = ref([
    {
      id: 1,
      title: "Core Features",
      isFullLine: true,
      textBold: true,
    },
    {
      id: 2,
      title: "Users Management",
      isOpenSource: false,
      isEnterprise: false,
      openSourceText: '',
      enterpriseText: 'Unlimited',
    },
    {
      id: 3,
      title: "Workflow Creation and Execution",
      isOpenSource: true,
      isEnterprise: true,
    },
    {
      id: 4,
      title: "Multi-Cloud or On-Prem Deployment Options",
      isOpenSource: true,
      isEnterprise: true,
    },
    {
      id: 5,
      title: "Embedded Code Editor",
      isOpenSource: true,
      isEnterprise: true,
    },
    {
      id: 6,
      title: "Plugins",
      isOpenSource: true,
      isEnterprise: true,
    },
    {
      id: 7,
      title: "Plugin Development Support",
      isOpenSource: false,
      enterpriseText: 'On Request',
    },
    {
      id: 8,
      title: "Code Versioning & Git Integration",
      isOpenSource: true,
      isEnterprise: true,
    },
    {
      id: 9,
      title: "Autocompletion & Syntax Validation",
      isOpenSource: true,
      isEnterprise: true,
    },
    {
      id: 10,
      title: "Live-Updated Topology View",
      isOpenSource: true,
      isEnterprise: true,
    },
    {
      id: 11,
      title: "Task & Subflow Dependency Management",
      isOpenSource: true,
      isEnterprise: true,
    },
    {
      id: 12,
      title: "Flexible Scheduling System",
      isOpenSource: true,
      isEnterprise: true,
    },
    {
      id: 13,
      title: "Event-Driven Data Processing",
      isOpenSource: true,
      isEnterprise: true,
    },
    {
      id: 14,
      title: "Embedded Task & Trigger Documentation",
      isOpenSource: true,
      isEnterprise: true,
    },
    {
      id: 15,
      title: "Security & Governance",
      isFullLine: true,
      textBold: true,
    },
    {
      id: 16,
      title: "SSO & OIDC Authentication",
      isOpenSource: false,
      isEnterprise: true,
    },
    {
      id: 17,
      title: "Role-Based Access Control (RBAC)",
      isOpenSource: false,
      isEnterprise: true,
    },
    {
      id: 18,
      title: "Multi-Tenancy Support",
      isOpenSource: false,
      isEnterprise: true,
    },
    {
      id: 19,
      title: "Audit Logs & Revision History",
      isOpenSource: false,
      isEnterprise: true,
    },
    {
      id: 20,
      title: "Secret Manager Integrations",
      isOpenSource: false,
      isEnterprise: true,
    },
    {
      id: 21,
      title: "Namespace-Level Permissions",
      isOpenSource: false,
      isEnterprise: true,
    },
    {
      id: 22,
      title: "Worker Security Isolation",
      isOpenSource: false,
      isEnterprise: true,
    },
    {
      id: 23,
      title: "Encryption & Fault Tolerance",
      isOpenSource: false,
      isEnterprise: true,
    },
    {
      id: 24,
      title: "SCIM Directory Sync",
      isOpenSource: false,
      isEnterprise: true,
    },
    {
          id: 24,
          title: "Log Shipper",
          isOpenSource: false,
          isEnterprise: true,
        },
    {
      id: 25,
      title: "Productivity",
      isFullLine: true,
      textBold: true,
    },
    {
      id: 24,
      title: "Custom Blueprints & Templates",
      isOpenSource: false,
      isEnterprise: true,
    },
    {
      id: 25,
      title: "Full-Text Search on Task Runs",
      isOpenSource: false,
      isEnterprise: true,
    },
    {
      id: 25,
      title: "Centralized User & Permission Management",
      isOpenSource: false,
      isEnterprise: true,
    },
    {
      id: 26,
      title: "Onboarding & Training Support",
      isOpenSource: false,
      isEnterprise: true,
    },
    {
      id: 27,
      title: "Customer Success Program with SLAs",
      isOpenSource: false,
      isEnterprise: true,
    },
    {
      id: 28,
      title: "Custom Apps",
      isOpenSource: false,
      isEnterprise: true,
    },
    {
      id: 29,
      title: "Namespace-Level Secrets Management",
      isOpenSource: false,
      isEnterprise: true,
    },
    {
      id: 30,
      title: "Scalability & Infrastructure",
      isFullLine: true,
      textBold: true,
    },
    {
      id: 31,
      title: "High Availability (No Single Point of Failure)",
      isOpenSource: false,
      isEnterprise: true,
    },
    {
      id: 32,
      title: "Worker Groups for Distributed Tasks",
      isOpenSource: false,
      isEnterprise: true,
    },
    {
      id: 33,
      title: "Task Runners",
      isOpenSource: false,
      isEnterprise: true,
    },
    {
      id: 34,
      title: "Service Accounts & API Tokens",
      isOpenSource: false,
      isEnterprise: true,
    },
    {
      id: 35,
      title: "Dedicated Storage & Tenant Isolation",
      isOpenSource: false,
      isEnterprise: true,
    },
    {
      id: 36,
      title: "Cluster Monitoring & Custom Storage",
      isOpenSource: false,
      isEnterprise: true,
    },
    {
      id: 37,
      title: "High-Throughput Event Handling",
      isOpenSource: false,
      isEnterprise: true,
    }
  ]);
  const tableSortedData = ref([
    {
      id: 1,
      title: "Core Features",
      isFullLine: true,
      textBold: true,
      children: [
        {
          id: 2,
          title: "Users Management",
          isOpenSource: false,
          isEnterprise: false,
          openSourceText: '',
          enterpriseText: 'Unlimited',
        },
        {
          id: 3,
          title: "Workflow Creation and Execution",
          isOpenSource: true,
          isEnterprise: true,
        },
        {
          id: 4,
          title: "Multi-Cloud or On-Prem Deployment Options",
          isOpenSource: true,
          isEnterprise: true,
        },
        {
          id: 5,
          title: "Embedded Code Editor",
          isOpenSource: true,
          isEnterprise: true,
        },
        {
          id: 6,
          title: "Plugins",
          isOpenSource: true,
          isEnterprise: true,
        },
        {
          id: 7,
          title: "Plugin Development Support",
          openSourceText: false,
          enterpriseText: 'On-Demand',
        },
        {
          id: 8,
          title: "Code Versioning & Git Integration",
          isOpenSource: true,
          isEnterprise: true,
        },
        {
          id: 9,
          title: "Autocompletion & Syntax Validation",
          isOpenSource: true,
          isEnterprise: true,
        },
        {
          id: 10,
          title: "Live-Updated Topology View",
          isOpenSource: true,
          isEnterprise: true,
        },
        {
          id: 11,
          title: "Task & Subflow Dependency Management",
          isOpenSource: true,
          isEnterprise: true,
        },
        {
          id: 12,
          title: "Flexible Scheduling System",
          isOpenSource: true,
          isEnterprise: true,
        },
        {
          id: 13,
          title: "Event-Driven Data Processing",
          isOpenSource: true,
          isEnterprise: true,
        },
        {
          id: 14,
          title: "Embedded Task & Trigger Documentation",
          isOpenSource: true,
          isEnterprise: true,
        },
      ]
    },
    {
      id: 2,
      title: "Security & Governance",
      isFullLine: true,
      textBold: true,
      children: [
        {
          id: 16,
          title: "SSO & OIDC Authentication",
          isEnterprise: true,
          isOpenSource: false,
        },
        {
          id: 17,
          title: "Role-Based Access Control (RBAC)",
          isOpenSource: false,
          isEnterprise: true,
        },
        {
          id: 18,
          title: "Multi-Tenancy Support",
          isOpenSource: false,
          isEnterprise: true,
        },
        {
          id: 19,
          title: "Audit Logs & Revision History",
          isOpenSource: false,
          isEnterprise: true,
        },
        {
          id: 20,
          title: "Secret Manager Integrations",
          isOpenSource: false,
          isEnterprise: true,
        },
        {
          id: 21,
          title: "Namespace-Level Permissions",
          isOpenSource: false,
          isEnterprise: true,
        },
        {
          id: 22,
          title: "Worker Security Isolation",
          isOpenSource: false,
          isEnterprise: true,
        },
        {
          id: 23,
          title: "Encryption & Fault Tolerance",
          isOpenSource: false,
          isEnterprise: true,
        },
        {
          id: 24,
          title: "SCIM Directory Sync",
          isOpenSource: false,
          isEnterprise: true,
        },
        {
          id: 24,
          title: "Log Shipper",
          isOpenSource: false,
          isEnterprise: true,
        },
      ]
    },
    {
      id: 3,
      title: "Productivity",
      isFullLine: true,
      textBold: true,
      children: [
        {
          id: 24,
          title: "Custom Blueprints & Templates",
          isOpenSource: false,
          isEnterprise: true,
        },
        {
          id: 25,
          title: "Full-Text Search on Task Runs",
          isOpenSource: false,
          isEnterprise: true,
        },
        {
          id: 25,
          title: "Centralized User & Permission Management",
          isOpenSource: false,
          isEnterprise: true,
        },
        {
          id: 26,
          title: "Onboarding & Training Support",
          isOpenSource: false,
          isEnterprise: true,
        },
        {
          id: 27,
          title: "Customer Success Program with SLAs",
          isOpenSource: false,
          isEnterprise: true,
        },
        {
          id: 28,
          title: "Apps",
          isOpenSource: false,
          isEnterprise: true,
        },
        {
          id: 29,
          title: "Namespace-Level Secrets Management",
          isOpenSource: false,
          isEnterprise: true,
        },
        {
          id: 30,
          title: "Apps",
          isOpenSource: false,
          isEnterprise: true,
        },
      ]
    },
    {
      id: 4,
      title: "Scalability & Infrastructure",
      isFullLine: true,
      textBold: true,
      children: [
        {
          id: 31,
          title: "High Availability (No Single Point of Failure)",
          isOpenSource: false,
          isEnterprise: true,
        },
        {
          id: 32,
          title: "Worker Groups for Distributed Tasks",
          isOpenSource: false,
          isEnterprise: true,
        },
        {
          id: 33,
          title: "Task Runners",
          isOpenSource: false,
          isEnterprise: true,
        },
        {
          id: 34,
          title: "Service Accounts & API Tokens",
          isOpenSource: false,
          isEnterprise: true,
        },
        {
          id: 35,
          title: "Dedicated Storage & Tenant Isolation",
          isOpenSource: false,
          isEnterprise: true,
        },
        {
          id: 36,
          title: "Cluster Monitoring & Custom Storage",
          isOpenSource: false,
          isEnterprise: true,
        },
        {
          id: 37,
          title: "High-Throughput Event Handling",
          isOpenSource: false,
          isEnterprise: true,
        }
      ]
    },
  ]);
  const changeSelectedType = (type) => {
    selectedType.value = type
  }

  const handleScroll = () => {
      const stickyElements = document.querySelectorAll('.sticky-tr');
      if(stickyElements) {
        stickyElements?.forEach((item) => {
          if (item.getBoundingClientRect()?.top <= 210) {
            item?.classList.add('shadow')
          } else {
            item?.classList.remove('shadow')
          }
        });
      }
  };
  onMounted(() => {
    window.addEventListener('scroll', handleScroll);
  });
  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
  });
</script>

<style scoped lang="scss">
    @import "../../assets/styles/variable";
    .shadow {
        box-shadow: 0px 2px 0px 0px #EFEFEF !important;
        td {
            >span {
                margin-top: 25px !important;
            }
        }
    }
    .close-svg-red {
        width: 24px;
        height: auto;
    }
    :deep(.close-svg-red > svg ) {
        color: #E3262F !important;
        font-size: 24px !important;
    }

    .enterprise-btn {
        &:hover {
            background-color: #8255FF;
        }
        margin-top: 8px;
        display: flex;
        width: 100%;
        justify-content: center;
        color: $white !important;
        padding: 9px 0;
        border-radius: 4px;
        font-size: 16px;
        font-weight: 700;
        background-color: #7117FF;
    }

    .edition-btn {
        &:hover {
            background: #F2F5F8;
        }
        margin-top: 8px;
        display: flex;
        width: 100%;
        justify-content: center;
        color: $black-2 !important;
        padding: 9px 0;
        border-radius: 4px;
        font-size: 16px;
        font-weight: 700;
        background-color: #F8F8F8;
        border: 1px solid #B0B0B0;
    }

    .container {
        @include media-breakpoint-down(sm) {
            padding: 0 $rem-2;
        }
    }

    .table-content {
        background-color: #FFFFFF;
        padding: 100px 0;

        @media screen and (max-width: 824px) {
            display: none;
        }

        .table-responsive {
            overflow: unset;
            max-width: 1140px;
            padding: 0;
        }

        h3 {
            color: $black-2;
            font-size: 40px;
            text-align: center;
            padding-bottom: 40px;
        }

        :deep(svg) {
            font-size: 16px;
        }

        .border-radius {
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
        }

        .table {
            overflow: unset;
            background-color: $white !important;
            border-radius: 8px;
            border: none;

            .border-top-transparent {
                border-top: 16px solid transparent;
            }

            .t-r-heading-text {
                display: flex;
                color: $black-2;
                line-height: 24px;
                max-height: 74px;

                span {
                    margin-top: 32px;
                    font-weight: 700;
                    font-size: 18px !important;
                }
            }

            .t-head {
                background: #FFFFFF;
                border: none;
                z-index: 200;
                position: sticky;
                top: 67px;
                @include media-breakpoint-down(xl) {
                    top: 64px;
                }

                .border-bottom-elem {
                    position: absolute;
                    width: 100%;
                    z-index: 99999999!important;
                    padding: 0 16px 0 44px;
                    bottom: -47px;

                    @include media-breakpoint-down(xl) {
                        padding: 0 16px;
                    }
                    div {
                        padding: 0;
                        width: 100%;
                        border-bottom: 1px solid #B0B0B0;
                    }
                }
            }

            .heading-bg {
                min-height: 74px !important;
            }

            .bg-gray {
                min-height: 45px;
                padding: 10px $rem-2;
                background-color: #F8F8F8;
            }

            .t-head-title {
                border: none;
                font-size: $font-size-md;
                font-weight: 700;
                line-height: 1.5rem;
                padding: 0 $rem-1;

                p {
                    margin: 0;
                    white-space: nowrap;
                    color: $black-2;
                    font-size: 18px;
                    line-height: 24px;
                    font-weight: 400;
                }

                span {
                    color: #827DFE;
                    line-height: 28px;
                    font-weight: 400;
                }
            }

            .t-head-body {
                .tick {
                    text-align: center;
                }
                .sticky-tr {
                    position: sticky;
                    top: 185px;
                    background: #FFFFFF;
                    z-index: 100;
                }

                tr {
                    line-height: 16px;
                    td {
                        min-width: 358px;
                        font-size: $font-size-base;
                        padding: 0 $rem-1;

                        @include media-breakpoint-down(xl) {
                            min-width: 300px;
                        }
                    }
                }
            }

            .t-border-data {
                border-bottom: none;
                color: $black-2;

                .enterprise-text {
                    font-size: 14px;
                    font-weight: 400;
                    color: #000000;
                }
            }

            .t-border-data-first-block {
                border-bottom: none;
                vertical-align: middle;

                @include media-breakpoint-down(xl) {
                    min-width: unset !important;
                    padding-left: $rem-1 !important;
                }

                span {
                    color: $black-2;
                    font-size: 14px;
                }
            }
        }

        .table-dark {
            --bs-table-bg: $black-2 !important;
            color: transparent !important;
            outline: none !important;
        }
    }

    .collapsed-table {
        background-color: #FFFFFF;
        padding: $rem-4 0;
        display: none;

        @media screen and (max-width: 824px) {
            display: block;
        }

        .buttons {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;

            .enterprs-btn {
                padding: $rem-1 30px;
                border-radius: 4px;
                cursor: pointer;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-width: 160px;
                background-color: #000000;

                p {
                    white-space: nowrap;
                    margin: 0;
                    color: $white;
                    font-size: $rem-1;
                    font-weight: 600;
                    line-height: 20px;
                    text-align: center;
                }

                span {
                    color: #B9B9BA;
                    font-size: 12px;
                    font-weight: 400;
                    text-align: left;
                    line-height: 22px;
                }
            }

            .ops-btn {
                padding: $rem-1 30px;
                border-radius: 4px;
                cursor: pointer;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-width: 160px;
                background-color: #E1E1E1;

                p {
                    white-space: nowrap;
                    margin: 0;
                    font-size: $rem-1;
                    font-weight: 600;
                    line-height: 20px;
                    text-align: center;
                }

                span {
                    font-size: 12px;
                    font-weight: 400;
                    line-height: 22px;
                    text-align: left;
                    color: #3D3D3F;
                }
            }
        }

        .features {
            margin-top: $rem-1;

            .border-bottom-none {
                border-bottom: 0 !important;
            }

            .feature-row {
                width: 100%;
                min-height: 60px;
                display: grid;
                grid-template-columns: 70% 30%;
                align-items: center;

                :deep(svg) {
                    font-size: 16px;
                }

                &:first-child {
                    border-top: 1px solid $black-1;
                }

                .feature-row-title {
                    padding: 8px;
                    display: flex;
                    height: 100%;
                    align-items: center;
                    border: 1px solid $black-1;
                    border-left: 0;
                    border-top: 0;
                    color: $black-1;

                    span {
                        font-size: 14px;
                        font-weight: 400;
                        color: #000000;
                    }
                }

                .feature-row-access {
                    display: flex;
                    height: 100%;
                    align-items: center;
                    border-bottom: 1px solid $black-1;
                    color: $black-1;
                    justify-content: center;
                    padding: 8px;

                    span {
                        text-align: center;
                        font-size: 14px;
                        font-weight: 400;
                        color: #000000;
                    }
                }
            }
        }
    }
</style>