<template>
    <div class="p-0 row filters">
        <div class="col-xl-auto col-sm-6 col-12 pb-3 pb-xl-0">
            <MultiSelect
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
            <MultiSelect
                name="stage"
                :selectedValue="stage"
                :options="stageOptions"
                :removeItem="removeStageItem"
                :selectItem="selectStageItem"
                :toggleDropdown="toggleStageDropdown"
                :showDropdown="showStageDropdown"
            />
        </div>
        <div :class="`col-xl col-md-${stage?.length > 0 ? 6 : 12} pb-3 pb-xl-0 form-group`">
            <Magnify class="magnify-icon" />
            <input
                type="text"
                class="form-control bg-dark-2"
                placeholder="Search guides"
                v-model="search"
            />
        </div>
        <div class="col-xl-auto col-md-6 pb-3 pb-xl-0">
            <div
                class="clear-filter"
                @click="removeFilter"
                v-if="stage?.length || topic?.length || search"
            >
                <DeleteOutline />
                <span>Clear filters</span>
            </div>
        </div>
    </div>
    <div class="card-grid mb-2">
        <a class="card" :href="item.path" v-for="item in navigation" :key="item.path">
            <span class="card-stage" :style="`background-color: ${stages[item.stage]}`">
                {{ item.stage }}
            </span>
            <div>
                <img
                    class="card-icon"
                    :src="item.icon"
                    :alt="item.title"
                    width="50px"
                    height="50px"
                />
                <h4 class="card-title">{{ item.title }}</h4>
            </div>
            <MDCParserAndRenderer :content="item.description" class="bd-markdown" />
            <div class="topics">
                <span v-for="(topic, index) in item.topics" :key="index" class="topic-item">{{
                    topic
                }}</span>
            </div>
        </a>
    </div>
</template>

<script setup>
    import { ref, watch } from "vue"
    import Magnify from "vue-material-design-icons/Magnify.vue"
    import DeleteOutline from "vue-material-design-icons/DeleteOutline.vue"
    import MultiSelect from "~/components/select/MultiSelect.vue"
    import MDCParserAndRenderer from "~/components/MDCParserAndRenderer.vue"

    const props = defineProps({
        pageUrl: {
            type: String,
            default: undefined,
        },
        navigation: {
            type: Array,
            default: undefined,
        },
    })

    const stage = ref([])
    const topic = ref([])
    const showStageDropdown = ref(false)
    const showTopicDropdown = ref(false)
    const search = ref("")
    const stageOptions = ["Getting Started", "Intermediate", "Advanced"]
    const topicOptions = [
        "Scripting",
        "DevOps",
        "Integrations",
        "Version Control",
        "Kestra Workflow Components",
        "Kestra Concepts",
        "Best Practices",
    ]

    const stages = ref({
        "Getting Started": "#5A3ABC",
        Intermediate: "#029E73",
        Advanced: "#AB0009",
    })

    const toggleStageDropdown = (value = !showStageDropdown.value) => {
        showStageDropdown.value = value
    }

    const toggleTopicDropdown = (value = !showTopicDropdown.value) => {
        showTopicDropdown.value = value
    }

    const selectStageItem = (option) => {
        if (!stage.value.includes(option)) {
            stage.value = [...stage.value, option]
        }
        showStageDropdown.value = false
    }

    const selectTopicItem = (option) => {
        if (!topic.value.includes(option)) {
            topic.value = [...topic.value, option]
        }
        showTopicDropdown.value = false
    }

    const removeStageItem = (index) => {
        stage.value = stage.value.filter((item, i) => i !== index)
    }

    const removeTopicItem = (index) => {
        topic.value = topic.value.filter((item, i) => i !== index)
    }

    const removeFilter = () => {
        stage.value = []
        topic.value = []
        search.value = ""
    }

    function filterLocalNavigation() {
        let results = props.navigation ?? []

        if (Array.isArray(stage.value) && stage.value?.length > 0) {
            results = results.filter((item) => stage.value.includes(item.stage))
        }

        if (Array.isArray(topic.value) && topic.value?.length > 0) {
            results = results.filter((item) => {
                for (const t of topic.value) {
                    if (!item.topics?.includes(t)) return false
                }
                return true
            })
        }

        if (search.value) {
            const q = search.value.toLowerCase()
            results = results.filter(
                (item) =>
                    (item.title || "").toLowerCase().includes(q) ||
                    (item.description || "").toLowerCase().includes(q),
            )
        }

        return results
    }

    const navigation = ref(props.navigation ?? [])

    function debounce(func, delay) {
        let timeout
        return (...args) => {
            if (timeout) {
                clearTimeout(timeout)
            }
            timeout = setTimeout(() => {
                func(...args)
            }, delay)
        }
    }

    const debouncedFilter = debounce(() => {
        navigation.value = filterLocalNavigation()
    }, 300)

    watch([search, () => stage.value, () => topic.value], () => {
        debouncedFilter()
    })
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    .card-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 0.5rem;
    }

    .card {
        padding: 1rem;
        background: $black-4;
    }

    .card-title {
        font-size: calc($font-size-base * 1);
        line-height: calc($font-size-base * 1.5);
        font-weight: 600;
    }

    :deep(.bd-markdown) p {
        font-size: $font-size-sm !important;
        line-height: 1rem !important;
        color: $white-3;
        flex: 1;
    }

    .card-stage {
        border-radius: 4px;
        height: 28px;
        padding: 4px 8px;
        color: $white;
        font-weight: 400;
        font-size: $font-size-xs;
        align-self: flex-start;
        margin-bottom: 1rem;
    }
    .topics {
        margin-top: 1rem;
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        .topic-item {
            background-color: #3d3d3f;
            color: #ffffff;
            font-weight: 400;
            font-size: $font-size-xs;
            height: 28px;
            padding: 4px 8px;
            border-radius: 4px;
            white-space: nowrap;
        }
    }

    .card-icon {
        padding: 0.5rem;
        border-radius: 0.5rem;
        border: 1px solid $black-3;
        max-width: unset;
        width: 48px;
        height: 48px;
    }

    .filters {
        margin-bottom: 2rem;
        .form-select {
            border-color: $black-3;
            font-size: $font-size-sm !important;
            height: 2rem;
            color: $white;
        }
        .form-group {
            position: relative;
            .magnify-icon {
                position: absolute;
                top: 50%;
                left: 18px;
                transform: translateY(-55%);
                color: $white-3;
                font-size: 1.25rem;
                z-index: 1;
                pointer-events: none;
            }
            .form-control {
                border-color: $black-3;
                height: 2rem;
                padding-left: 2rem;
                color: $white;
                &::placeholder {
                    color: $white-3;
                    font-size: $font-size-sm !important;
                }
                &:focus {
                    background-color: $black-2 !important;
                    color: $white;
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