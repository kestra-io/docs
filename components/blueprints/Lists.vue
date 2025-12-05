<template>
    <div class="mt-5">
        <div class="header-container">
            <div class="header container d-flex flex-column align-items-center gap-3">
                <h1 data-aos="fade-left">Blueprints</h1>
                <h4 data-aos="fade-right">The first step is always the hardest. Explore blueprints to kick-start your next flow.</h4>
                <div class="col-12 search-input position-relative">
                    <input type="text" class="form-control form-control-lg" placeholder="Search across 250+ blueprints" v-model="searchQuery">
                    <Magnify class="search-icon" />
                </div>
            </div>
        </div>
        <div class="mt-5" data-aos="fade-left">
            <button
                v-for="tag in tagsComplete"
                :key="tag.name"
                :class="{ 'active': activeTags.some(item => item.id === tag.id) }"
                @click="setTagBlueprints(tag)"
                class="m-1 rounded-button"
            >
                {{ tag.name }}
            </button>
        </div>
        <div class="row my-5">
            <div class="col-lg-4 col-md-6 mb-4" v-for="blueprint in blueprints" :key="blueprint.id" data-aos="zoom-in">
                <BlueprintsListCard :blueprint="blueprint" :tags="tags" :href="generateCardHref(blueprint)"/>
            </div>
            <div class="d-flex justify-content-between pagination-container">
                <div class="items-per-page">
                    <select class="form-select bg-dark-2" aria-label="Default select example" v-model="itemsPerPage">
                        <option :value="12">12</option>
                        <option :value="24">24</option>
                        <option :value="48">48</option>
                    </select>
                </div>
                <div class="d-flex align-items-baseline" v-if="totalBlueprints > itemsPerPage">
                    <CommonPagination
                        v-if="totalPages > 1"
                        :current-url="props.currentUrl"
                        :totalPages="totalPages"
                        v-model:current-page="currentPage"
                        @update:current-page="changePage"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import Magnify from "vue-material-design-icons/Magnify.vue"
import { useBlueprintsList } from '~/composables/useBlueprintsList'
import CommonPagination from '~/components/common/Pagination.vue'
import BlueprintsListCard from '~/components/blueprints/ListCard.vue'

const props = defineProps<{
    tags: { id: string, name: string }[],
    currentUrl: string
}>()

const localCurrentUrl = ref(props.currentUrl);

watch(() => props.currentUrl, (newUrl) => {
    localCurrentUrl.value = newUrl;
});

const urlParams = computed(() => new URL(localCurrentUrl.value).searchParams);

const currentPage = ref(parseInt(urlParams.value.get('page') ?? '1'))
const itemsPerPage = computed(() => parseInt(urlParams.value?.get('size') ?? '24'))
const activeTags = ref<{ id: string }[]>([])
const tagsComplete = computed(() => {
    return [{ id: 'All tags', name: 'All tags' }, ...props.tags]
})
const totalPages = ref(0)
const searchQuery = computed(() => urlParams.value?.get('q'))

watch(urlParams, (newParams) => {
    currentPage.value = parseInt(newParams.get('page') ?? '1')
    activeTags.value = newParams.get('tags') ? newParams.get('tags')!.split(',').map(tagId => ({ id: tagId })) : []
}, { immediate: true })

function toggleArrayElement<T>(array: T[], element: T): T[] {
  const index = array.indexOf(element);

  if (index === -1) {
    array.push(element);
  } else {
    array.splice(index, 1);
  }
  return array;
}

const setTagBlueprints = async (tagVal: { id: string }) => {
  if (tagVal.id === 'All tags') {
    activeTags.value = [tagVal];
  } else {
    if (activeTags.value.some(item => item.id === 'All tags')) {
      activeTags.value = []
    }
    activeTags.value = toggleArrayElement(activeTags.value, tagVal);
  }
}

const setBlueprints = (total: number) => {
    totalPages.value = Math.ceil(total / itemsPerPage.value)
}

const {blueprints, total: totalBlueprints} = await useBlueprintsList({
    page: currentPage,
    size: itemsPerPage,
    tags: activeTags,
    q: searchQuery
});

const changePage = () => {
    window.scrollTo(0, 0)
};

const generateCardHref = (blueprint: { id: string }) => {
  return `/blueprints/${blueprint.id}`
}

let timer: any;

watch([searchQuery, activeTags], ([searchVal, activeTagsVal]) => {
    if(timer) {
        clearTimeout(timer)
    }

    timer = setTimeout(async () => {
        setBlueprints(totalBlueprints.value)
        // Update URL without navigation
        const newUrl = new URL(localCurrentUrl.value);
        Object.entries(urlParams.value).forEach(([key, value]) => {
            newUrl.searchParams.set(key, value.toString());
        });
        localCurrentUrl.value = newUrl.toString();
        window.history.pushState({}, '', newUrl.toString());
    }, 500)
}, { deep: true })
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .header-container {
        background: url("/landing/plugins/bg.svg") no-repeat top;
        .header {
            padding-bottom: calc($spacer * 4.125);
            border-bottom: 1px solid rgba(255, 255, 255, 0.10);

            h1, h4 {
                color: $white;
                text-align: center;
                font-weight: 300;
                margin-bottom: 0;
            }

            h1 {
                font-size: $font-size-4xl;
            }

            h4 {
                font-size: $font-size-xl;
            }

            .search-input {
                max-width: 21rem;

                input {
                    border-radius: 4px;
                    border: 1px solid #404559;
                    background-color: #1C1E27;

                    &, &::placeholder {
                        color: $white;
                        font-size: $font-size-md;
                        font-weight: 400;
                    }
                }

                .search-icon {
                    position: absolute;
                    top: calc($spacer * 0.563);;
                    left: calc($spacer * 1.125);
                    font-size: calc($spacer * 1.125);
                    color: $white;
                }
            }
        }

    }
    .form-control {
        padding-left: 2.5rem;

        &:focus {
            border-color: var(--bs-border-color);
            box-shadow: none;
        }
    }

    .rounded-button {
        border-radius: 0.25rem;
        color: var(--bs-white);
        padding: calc($spacer / 2) calc($spacer / 1);
        margin-right: calc($spacer / 2);
        background-color: $black-2;
        border: 0.063rem solid $black-3;
        font-weight: bold;
        font-size: $font-size-sm;
        line-height: 1.375rem;

        &.active {
            background-color: $primary-1;
            border-color: $primary-1;
        }
    }

    .pagination-container .form-select {
        border-radius: 4px;
        border: $block-border;
        color: $white;
        text-align: center;
        font-family: $font-family-sans-serif;
        font-size: $font-size-sm;
        font-style: normal;
        font-weight: 700;
    }
</style>