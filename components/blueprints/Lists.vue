<template>
<div class="mt-5">
    <div class="header-container">
        <div class="header container d-flex flex-column align-items-center gap-3">
            <h1 data-aos="fade-left">Blueprints</h1>
            <h4 data-aos="fade-right">The first step is always the hardest. Explore blueprints to kick-start your next flow.</h4>
            <div class="col-12 search-input position-relative">
                <input type="text" class="form-control form-control-lg" placeholder="Search across 180+ of blueprints" v-model="searchQuery">
                <Magnify class="search-icon" />
            </div>
        </div>
    </div>
    <div class="mt-5" data-aos="fade-left">
        <button
            v-for="tag in tags"
            :key="tag.name"
            :class="{ 'active': activeTags.some(item => item.name === tag.name) }"
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
                    :totalPages="totalPages"
                    @on-page-change="changePage"
                    v-if="totalPages > 1"
                />
                <span class="total-pages">Total {{ totalBlueprints }}</span>
            </div>
        </div>
    </div>
</div>
</template>

<script setup>
import Magnify from "vue-material-design-icons/Magnify.vue"

const currentPage = ref(1)
const itemsPerPage = ref(24)
const blueprints = ref([])
const activeTags = ref([{ name: 'All tags' }])
const tags = ref([])
const props = defineProps(["tags"])
const totalPages = ref(0)
const totalBlueprints = ref(0)
const searchQuery = ref('')
const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()

if(props.tags) {
    tags.value = [{ name: 'All tags' }, ...props.tags]
}

const toggleArrayElement = (array, element) => {
  const index = array.indexOf(element);

  if (index === -1) {
    array.push(element);
  } else {
    array.splice(index, 1);
  }
  return  array;
}

const setTagBlueprints = async (tagVal) => {
  if (tagVal.name === 'All tags') {
    activeTags.value = [tagVal];
  } else {
    if (activeTags.value.some(item => item.name === 'All tags')) {
      activeTags.value = []
    }
    activeTags.value = toggleArrayElement(activeTags.value, tagVal);
  }
}

if(route.query.page) currentPage.value = parseInt(route.query.page)
if(route.query.size) itemsPerPage.value = parseInt(route.query.size)
if(route.query.tags) {
  activeTags.value = tags.value.filter(item => route.query.tags.split(',').includes(item.id));
}
if(route.query.q) searchQuery.value = route.query.q;

const { data: blueprintsData, error } = await useAsyncData('blueprints', () => {
  return $fetch(`${config.public.apiUrl}/blueprints/versions/latest?page=${currentPage.value}&size=${itemsPerPage.value}${route.query.tags ? `&tags=${activeTags.value.map(tag => tag.id).join(',')}` : ''}${route.query.q ? `&q=${searchQuery.value}` : ''}`)
})

if ((error && error.value) || !activeTags) {
  throw createError({statusCode: 404, message: 'Page not found', data: error, fatal: true})
}

const setBlueprints = (allBlueprints, total) => {
    blueprints.value = allBlueprints
    totalBlueprints.value = total
    totalPages.value = Math.ceil(total / itemsPerPage.value)
}

if(blueprintsData.value) {
    setBlueprints(blueprintsData.value.results, blueprintsData.value.total)
}

const changePage = (pageNo) => {
    currentPage.value = pageNo
    window.scrollTo(0, 0)
};

const generateCardHref = (blueprint) => {
  return `/blueprints/${blueprint.id}`
}

let timer;
watch(() => route.query, async () => {
  if (!route.query.tags && !route.query.page && !route.query.size) {
    activeTags.value = [{ name: 'All tags' }]
  }
});

watch([currentPage, itemsPerPage, searchQuery, activeTags], ([pageVal, itemVal, searchVal, activeTagsVal], [__, oldItemVal, oldTagVal]) => {
      if(timer) {
        clearTimeout(timer)
      }
  timer = setTimeout(async () => {
      const { data } = await useFetch(`${config.public.apiUrl}/blueprints/versions/latest?page=${(itemVal != oldItemVal) ? 1 : pageVal}&size=${itemVal}${!!activeTagsVal.map(item => item.id).join(',') ? `&tags=${activeTagsVal.map(item => item.id).join(',')}` : ''}${searchVal.length ? `&q=${searchVal}` : ''}`)
      setBlueprints(data.value.results, data.value.total)

        function getQuery() {
            let query = {
                page: (itemVal != oldItemVal) ? 1 : pageVal,
                size: itemVal,
            };
            if (!!activeTagsVal.map(item => item.id).join(',')) {
              query['tags'] = activeTagsVal.map(item => item.id).join(',')
            }
            if(searchVal.length) {
                query['q'] = searchVal
            }

            return query
        }

        router.push({
            query: getQuery()
        })

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
    .total-pages {
        font-size: $font-size-sm;
        color: $white;
        text-align: center;
        font-family: $font-family-sans-serif;
        font-weight: 400;
        line-height: 22px;
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