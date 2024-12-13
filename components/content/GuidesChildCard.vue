<template>
    <div class="row card-group mb-2">
        <div class="p-0 row filters">
            <div class="col-xl-auto col-sm-6 col-12 pb-3 pb-xl-0">
                <SelectMultiSelect
                    name="topic"
                    :selectedValue="topic"
                    :options="topicOptions"
                    :removeItem="removeTopicItem"
                    :selectItem="selectTopicItem"
                    :toggleDropdown="toggleTopicDropdown"
                    :showDropdown="showTopicDropdown"
                />
            </div>
            <div class="col-xl-auto col-sm-6 col-12 pb-3 pb-xl-0">
                <SelectMultiSelect
                    name="stage"
                    :selectedValue="stage"
                    :options="stageOptions"
                    :removeItem="removeStageItem"
                    :selectItem="selectStageItem"
                    :toggleDropdown="toggleStageDropdown"
                    :showDropdown="showStageDropdown"
                />
            </div>
            <div :class="`col-xl col-md-${stage.length > 0 ? 6 : 12} pb-3 pb-xl-0 form-group`">
                <Magnify />
                <input type="text" class="form-control bg-dark-2" placeholder="Search guides" v-model="search">
            </div>
            <div class="col-xl-auto col-md-6 pb-3 pb-xl-0">
                <div class="clear-filter" @click="removeFilter" v-if="stage.length || topic.length || search">
                    <DeleteOutline/>
                    <span>Clear filters</span>
                </div>
            </div>
        </div>
        <NuxtLink :href="item._path" class="col-12 col-md-4 mb-lg-4 mb-2" v-for="item in navigation" :key="item._path">
            <div class="card">
                <div class="card-body">
                    <span class="card-stage" :style="`background-color: ${stages[item.stage]}`">
                        {{item.stage}}
                    </span>
                    <div class="card-icon">
                        <img :src="item.icon" :alt="item.title" width="50px" height="50px"/>
                    </div>
                    <div>
                        <h4 class="card-title">{{ item.title }}</h4>
                        <p class="card-text">{{item.description}}</p>
                    </div>
                    <div class="topics">
                        <span v-for="(topic, index) in item.topics" :key="index" class="topic-item">{{topic}}</span>
                    </div>
                </div>
            </div>
        </NuxtLink>
    </div>
</template>

<script setup>
    import {hash} from "ohash";
    import {useAsyncData} from "#imports";
    import Magnify from "vue-material-design-icons/Magnify.vue";
    import ChevronDown from "vue-material-design-icons/ChevronDown.vue";
    import Close from "vue-material-design-icons/Close.vue"
    import DeleteOutline from "vue-material-design-icons/DeleteOutline.vue"


    const props = defineProps({
        pageUrl: {
            type: String,
            default: undefined
        },
    });

    const route = useRoute();

    const navigation = ref([]);
    const stage = ref([]);
    const topic = ref([]);
    const showStageDropdown = ref(false);
    const showTopicDropdown = ref(false);
    const search = ref("");
    const stageOptions = ['Getting Started', 'Intermediate', 'Advanced'];
    const topicOptions = ['Scripting', 'DevOps', 'Integrations', 'Version Control', 'Kestra Workflow Components', 'Kestra Concepts', 'Best Practices'];

    const stages = ref({
      "Getting Started": "#5A3ABC",
      "Intermediate": "#029E73",
      "Advanced": "#AB0009"
    });

    const toggleStageDropdown = (value = !showStageDropdown.value) => {
      showStageDropdown.value = value;
    };

    const toggleTopicDropdown = (value = !showTopicDropdown.value ) => {
      showTopicDropdown.value = value;
    };

    const selectStageItem = (option) => {
      if (!stage.value.includes(option)) {
        stage.value = [...stage.value, option];
      }
      showStageDropdown.value = false;
    };

    const selectTopicItem = (option) => {
      if (!topic.value.includes(option)) {
        topic.value = [...topic.value, option];
      }
      showTopicDropdown.value = false;
    };

    const removeStageItem = (index) => {
      stage.value = stage.value.filter((item, i) => i !== index);
    };

    const removeTopicItem = (index) => {
      topic.value = topic.value.filter((item, i) => i !== index);
    };

    const removeFilter = () => {
      stage.value = [];
      topic.value = [];
      search.value = '';
    };

    let currentPage = null;

    if (props.pageUrl) {
        currentPage = props.pageUrl;
    } else {
        currentPage = route.path;
    }

    currentPage = currentPage.endsWith("/") ? currentPage.slice(0, -1) : currentPage;
    const currentPageDir = currentPage.split('/').reverse()[0];

    const fetchChildDocs = async () => {
      const {data: result} = await useAsyncData(
        `ChildCard-${hash(currentPage)}`,
        () => {
          let query = queryContent(currentPage + "/").where({ _dir: currentPageDir });

          let queryParams = {};

          if (Array.isArray(stage.value) && stage.value.length > 0) {
            queryParams.stage = { $in: stage.value };
          }

          if (Array.isArray(topic.value) && topic.value.length > 0) {
            queryParams.topics = { $contains: topic.value };
          }

          if (search.value) {
            queryParams.title = { $icontains: search.value }
          }
          query = query.where(queryParams);

          return query.find();
        });
      navigation.value = result.value;
    };

    fetchChildDocs();

    const changeFilter = () => {
      fetchChildDocs();
    }

    function debounce(func, delay) {
      let timeout;
      return (...args) => {
        if (timeout) {
          clearTimeout(timeout);
        }
        timeout = setTimeout(() => {
          func(...args);
        }, delay);
      };
    }

    const debouncedFilterPlugins = debounce(() => {
      fetchChildDocs()
    }, 1000);

    watch([currentPage, search, () => stage.value, () => topic.value], () => {
      debouncedFilterPlugins();
    });

</script>

<style lang="scss" scoped>
    @import "../../assets/styles/_variable.scss";

    .card {
        padding: 8px;
    }
    .card-title {
        font-size: calc($font-size-base * 1.5);;
        line-height: calc($font-size-base * 2.25);;
        font-weight: 600;
    }

    .card-text {
        font-size: $font-size-sm !important;
        line-height: 1rem !important;
        color: $white-3;
    }
    .card-stage {
        border-radius: 4px;
        height: 28px;
        padding: 4px 8px;
        color: $white;
        font-weight: 400;
        font-size: $font-size-xs;
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: 18px;
        right: 17px;
    }
    .topics {
        margin-top: 1rem;
        display: flex;
        .topic-item {
            background-color: #3D3D3F;
            color: #FFFFFF;
            font-weight: 400;
            font-size: $font-size-xs;
            height: 28px;
            padding: 4px 8px;
            border-radius: 4px;
            margin-right: 8px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }

    .card-icon {
        border: 2px solid $black-6;
        width: 83px;
        height: 64px;
        float: unset;
        background-color: #111113;
        img {
            max-width: unset;
            width: 32px !important;
            height: 33px !important;
        }
    }
    .filters {
        margin-bottom: 2rem;
        .form-select {
            border-color: $black-3;
            font-size: $font-size-sm !important;
            height:  2rem;
            color: $white;
        }
        .form-group {
            position: relative;
            .magnify-icon {
                position: absolute;
                top: calc(2rem / 2 - 8px);
                left: 30px;
                color: $white;
                width: 16px;
                height: 16px;
            }
            .form-control {
                border-color: $black-3;
                height:  2rem;
                padding-left: 2rem;
                color: $white;
                &::placeholder {
                    color: $white;
                    font-size: $font-size-sm !important;
                }
            }
        }
    }

    .clear-filter {
        display: flex;
        align-items: center;
        gap: 4px;

        span {
            color: $white-3;
        }

        :deep(.material-design-icon) {
            .material-design-icon__svg {
                bottom: 0;
                fill: $white-3;
            }
        }
    }

</style>
