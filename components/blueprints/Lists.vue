<template>
<div class="mt-5">
    <div class="header-container">
        <div class="header container d-flex flex-column align-items-center gap-3">
            <h1 data-aos="fade-left">Blueprints</h1>
            <h4 data-aos="fade-right">The first step is always the hardest. Explore blueprints to kick-start your next flow.</h4>
            <div class="col-12 search-input position-relative">
                <input type="text" class="form-control form-control-lg" placeholder="Search across +180 of blueprints" v-model="searchQuery">
                <Magnify class="search-icon" />
            </div>
        </div>
    </div>
    <div class="grid gap-3 mt-5" data-aos="fade-left">
        <button
            v-for="tag in tags"
            :key="tag.name"
            :class="{ 'active': tag.name === activeTag?.name }"
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
const activeTag = ref({ name: 'All tags' })
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

const setTagBlueprints = async (tagVal) => {
  if (activeTag.value.name !== tagVal.name) {
    activeTag.value = tagVal;
    await navigateTo(`/blueprints/${tagVal.name}`);
  }
}

if(route.query.page) currentPage.value = parseInt(route.query.page)
if(route.query.size) itemsPerPage.value = parseInt(route.query.size)
if(route.params.slug) activeTag.value = tags.value.find(f => f?.name?.toLowerCase() == route.params.slug.toLowerCase())
if(route.query.q) searchQuery.value = route.query.q;

if (!activeTag.value) {
  const id = route.params.slug?.split('-')[0];
  const {data: blueprintInformations} = await useAsyncData('blueprints-informations', () => {
    return $fetch(`/api/blueprint?query=${id}`)
  })

  activeTag.value = { name: 'All tags' };
  if (blueprintInformations && blueprintInformations.value) {
    let tag = tags.value.find(f => f?.id == blueprintInformations.value.page.tags[0]);
    await navigateTo(`/blueprints/${tag.name || 'all tags'}/${route.params.slug}`);
  }
}
const { data: blueprintsData, error } = await useAsyncData('blueprints', () => {
    return $fetch(`${config.public.apiUrl}/blueprints?page=${currentPage.value}&size=${itemsPerPage.value}${route.params.slug && route.params.slug !== 'all tags' ? `&tags=${activeTag.value.id}` : ''}${route.query.q ? `&q=${searchQuery.value}` : ''}`)
})

if ((error && error.value) || !activeTag) {
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
  return `/blueprints/${activeTag.value.name.toLowerCase()}/${blueprint.id}-${slugify(blueprint.title)}`
}

let timer;
watch([currentPage, itemsPerPage, searchQuery], ([pageVal, itemVal, searchVal], [__, oldItemVal, oldTagVal]) => {
  if(timer) {
        clearTimeout(timer)
    }
    timer = setTimeout(async () => {

        const { data } = await useFetch(`${config.public.apiUrl}/blueprints?page=${(itemVal != oldItemVal) ? 1 : pageVal}&size=${itemVal}${route.params.slug && route.params.slug !== 'all tags' ? `&tags=${activeTag.value.id}` : ''}${searchVal.length ? `&q=${searchVal}` : ''}`)
        setBlueprints(data.value.results, data.value.total)

        function getQuery() {
            let query = {
                page: (itemVal != oldItemVal) ? 1 : pageVal,
                size: itemVal,
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
})
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