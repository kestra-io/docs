<template>
  <div class="table-content" ref="tableContentRef">
    <div class="container table-responsive">
      <h3>Compare All Features</h3>
      <table class="table table-dark">
        <thead class="t-head">
          <tr>
            <th class="t-head-title text-center" v-for="(head, index) in tableHead" :key="index">
              <div class="border-radius" :class="{
                'bg-gray': index !== 0,
              }">
                <p class="fw-bold">{{ head.name }}</p>
                <span>{{ head.period }}</span>
                <NuxtLink v-if="head?.button" :href="head?.button?.href"
                  :class="head.name === 'Enterprise' ? 'enterprise-btn' : 'edition-btn'">
                  {{ head.button?.text }}
                </NuxtLink>
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="t-head-body">
          <tr v-for="(item, index) in tableData" :key="index" :class="!item.textBold ? '' : 'sticky-tr'">
            <td class="ps-5 t-border-data-first-block" :class="!item.textBold ? '' : 't-r-heading-text'">
              <span>
                {{ item.title }}
                <div v-if="!item.textBold && item.description" class="tooltip-container">
                  <Information class="info" />
                  <div class="tooltip-content">
                    {{ item.description.text }}
                    <NuxtLink v-if="item.description.link" :to="item.description.link">Learn more</NuxtLink>
                  </div>
                </div>
              </span>
            </td>
            <td class="tick t-border-data">
              <div class="bg-gray" :class="!item.textBold ? '' : 'heading-bg'">
                <CheckBold v-if="!item.isFullLine && item.isOpenSource" class="check-svg-purple" />
                <Close class="close-svg-red" v-else-if="!item.isFullLine && !item.openSourceText" />
                <span class="enterprise-text" v-else-if="!item.isFullLine">{{ item.openSourceText }}</span>
              </div>
            </td>
            <td class="tick t-border-data">
              <div class="bg-gray" :class="!item.textBold ? '' : 'heading-bg'">
                <CheckBold v-if="!item.isFullLine && item.isEnterprise" class="check-svg-purple" />
                <Close class="close-svg-red" v-else-if="!item.isFullLine && !item.enterpriseText" />
                <span class="enterprise-text" v-else-if="!item.isFullLine">{{ item.enterpriseText }}</span>
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
        <CollapsedFeatures v-for="(item, index) in tableSortedData" :key="index" class="que text-white"
          :title="item.title">
          <div v-for="(child, childIndex) in item.children" :key="childIndex" class="feature-row">
            <div class="feature-row-title" :class="{ 'border-bottom-none': childIndex === item.children.length - 1 }">
              <span>
                {{ child.title }}
                <div v-if="child.description" class="tooltip-container ms-auto">
                  <Information class="info ps-4" />
                  <div class="tooltip-content">
                    {{ child.description.text }}
                    <NuxtLink v-if="child.description.link" :to="child.description.link">Learn more</NuxtLink>
                  </div>
                </div>
              </span>
            </div>
            <div class="feature-row-access" :class="{ 'border-bottom-none': childIndex === item.children.length - 1 }">
              <span v-if="selectedType === 'enterprise' && child.enterpriseText">{{ child.enterpriseText }}</span>
              <span v-else-if="selectedType !== 'enterprise' && child.openSourceText">{{ child.openSourceText }}</span>
              <div v-if="selectedType === 'enterprise' && !child.enterpriseText">
                <Close class="close-svg-red" v-if="!child.isEnterprise" />
                <CheckBold v-else-if="child.isEnterprise" class="check-svg-purple" />
              </div>
              <div v-else-if="selectedType === 'opensource' && !child.openSourceText">
                <Close class="close-svg-red" v-if="!child.isOpenSource" />
                <CheckBold v-else-if="child.isOpenSource" class="check-svg-purple" />
              </div>
            </div>
          </div>
        </CollapsedFeatures>
        <NuxtLink :href="selectedType === 'enterprise' ? '/enterprise' : '/demo'"
          :class="selectedType === 'enterprise' ? 'enterprise-btn' : 'edition-btn'">
          {{ selectedType === 'enterprise' ? 'Talk to Sales' : 'Get Started' }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted } from "vue"
  import Close from 'vue-material-design-icons/Close.vue'
  import CheckBold from 'vue-material-design-icons/CheckBold.vue'
  import Information from 'vue-material-design-icons/Information.vue'
  import CollapsedFeatures from "../../components/layout/CollapsedFeatures.vue";
  import { tableHeadData, getTableSortedData } from "../../data/compare-features"

  const { totalPlugins } = usePluginsCount();

  const selectedType = ref<string>('enterprise');
  const tableHead = computed(() => tableHeadData);
  const tableSortedData = computed(() => getTableSortedData(totalPlugins.value));

  const tableData = computed(() => {
    const flattened: any[] = [];
    tableSortedData.value.forEach(group => {
      flattened.push({
        title: group.title,
        isFullLine: true,
        textBold: true,
      });
      group.children.forEach(child => {
        flattened.push(child);
      });
    });
    return flattened;
  });


  const changeSelectedType = (type: string): void => {
    selectedType.value = type
  }

  const handleScroll = (): void => {
      const stickyElements = document.querySelectorAll('.sticky-tr');
      if(stickyElements) {
        stickyElements?.forEach((item) => {
          if (item.getBoundingClientRect()?.top <= 240) {
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
    @import "../../assets/styles/_variable";
    .shadow {
        box-shadow: 0px 2px 0px 0px #EFEFEF !important;
        td {
            >span {
                margin-top: 25px !important;
            }
        }
    }
    .close-svg-red, .check-svg-purple {
        width: 24px;
        height: auto;
    }
    :deep(.close-svg-red > svg ) {
        color: #FD7278 !important;
        font-size: 24px !important;
    }
    :deep(.check-svg-purple > svg ) {
        color: #8405FF !important;
        font-size: 24px !important;
    }
    .info {
        width: 14px;
        height: auto;
    }

    :deep(.info > svg ) {
        position: absolute;
        bottom: -0.23em;
        color: #B9B9BA !important;

        &:hover {
            color: #646465 !important;
            transition: color 200ms ease-in-out;
        }
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
        border-radius: 8px;
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
        border-radius: 8px;
        font-size: 16px;
        font-weight: 700;
        background-color: transparent;
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

                tr th div{
                  padding-top: 62px;
                }

                tr th:last-child {
                    .border-radius {
                        border-left: 1px solid #7117FF;
                        border-right: 1px solid #7117FF;
                        border-top: 1px solid #7117FF;
                    }
                }

                .border-bottom-elem {
                    position: absolute;
                    width: 100%;
                    z-index: 100;
                    padding: 0 16px 0 44px;

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

            .t-head-body {
                tr:last-child td .bg-gray {
                    border-bottom-left-radius: 8px;
                    border-bottom-right-radius: 8px;
                }
                tr td:last-child .bg-gray {
                    border-left: 1px solid $purple-15;
                    border-right: 1px solid $purple-15;
                }

                tr:first-child td:last-child .bg-gray {
                    border-top: none;
                }

                tr:last-child td:last-child .bg-gray {
                    border-bottom: 1px solid $purple-15;
                }
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
                    top: 240px;
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
                        display: flex;
                        align-items: center;
                        justify-content: end;
                        width: 100%;
                        font-size: 14px;
                        font-weight: 400;
                        color: #000000;
                    }

                    .tooltip-container {
                        position: relative;

                        .tooltip-content {
                            top: calc(100% + 15px);
                            right: -20px;
                            left: auto;
                            transform: none;

                            &::before,
                            &::after {
                                right: 20px;
                                left: auto;
                                transform: none;
                            }

                            &::before {
                                top: -8px;
                                border-left: 8px solid transparent;
                                border-right: 8px solid transparent;
                                border-bottom: 8px solid #E5E5E5;
                            }

                            &::after {
                                top: -7px;
                                border-left: 7px solid transparent;
                                border-right: 7px solid transparent;
                                border-bottom: 7px solid #FFFFFF;
                            }
                        }
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

    .tooltip-container {
        position: relative;
        display: inline-block;
        margin-left: 4px;

        .tooltip-content {
            position: absolute;
            opacity: 0;
            visibility: hidden;
            top: calc(100% + 10px);
            left: 30%;
            transform: translateX(-30%);
            background-color: $white;
            border: 1px solid #9797A6;
            border-radius: 4px;
            padding: 8px 16px;
            width: max-content;
            max-width: 250px;
            z-index: 1000;
            font-size: $font-size-xs;
            line-height: 20px;
            white-space: normal;
            transition: opacity 0.3s ease 0.2s, visibility 0.3s ease 0.2s;

            &::before,
            &::after {
                content: '';
                position: absolute;
                left: 30%;
                transform: translateX(-30%);
            }

            &::before {
                top: -8px;
                border-left: 8px solid transparent;
                border-right: 8px solid transparent;
                border-bottom: 8px solid #9797A6;
            }

            &::after {
                top: -7px;
                border-left: 7px solid transparent;
                border-right: 7px solid transparent;
                border-bottom: 7px solid #FFFFFF;
            }

            a {
                display: inline-block;
                color: #8405FF;
                text-decoration: none;

                &:hover {
                    text-decoration: underline;
                }
            }
        }

        &:hover .tooltip-content {
            opacity: 1;
            visibility: visible;
            transition-delay: 0s;
        }

        .tooltip-content:hover {
            opacity: 1;
            visibility: visible;
        }
    }
</style>