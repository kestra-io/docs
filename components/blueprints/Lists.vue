<template>
    <div class="mt-5">
        <div class="header-container">
            <div class="header container d-flex flex-column align-items-center gap-3">
                <h1 data-aos="fade-left">Blueprints</h1>
                <h4 data-aos="fade-right">The first step is always the hardest. Explore blueprints to kick-start your next flow </h4>
                <div class="col-12 search-input position-relative">
                    <input type="text" class="form-control form-control-lg" placeholder="Search across 250+ blueprints" v-model="searchQuery">
                    <Magnify class="search-icon" />
                </div>
            </div>
        </div>
        <div class="mt-5" data-aos="fade-left">
            <button
                v-for="tag in tagsComplete"
                :key="tag.id"
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

            <div v-if="blueprints.length === 0" class="col-12 d-flex flex-column align-items-center justify-content-center py-5">
                <h4 class="text-white mb-4">No blueprints for your selection</h4>
                <button class="rounded-button active" @click="resetFilters">
                    Reset all tags
                </button>
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

<script setup>
    import Magnify from "vue-material-design-icons/Magnify.vue"
    import { useBlueprintsList } from '~/composables/useBlueprintsList.js'

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
        const customOrder = ['Getting Started', 'Core', 'Infrastructure', 'Data', 'AI', 'Business', 'Cloud'];
        const sortedTags = [...props.tags].sort((a, b) => {
            let indexA = customOrder.indexOf(a.name);
            let indexB = customOrder.indexOf(b.name);
            if (indexA === -1) indexA = 999;
            if (indexB === -1) indexB = 999;
            return indexA - indexB;
        });
        tags.value = [{ name: 'All tags' }, ...sortedTags];
    }

    const getActiveTagIds = () => {
        return activeTags.value
            .filter(tag => tag.name !== 'All tags' && tag.id)
            .map(tag => tag.id)
            .join(',');
    }

    const setTagBlueprints = (tagVal) => {
        if (tagVal.name === 'All tags') {
            activeTags.value = [{ name: 'All tags' }];
            return;
        }

        let currentTags = activeTags.value.filter(t => t.name !== 'All tags');

        const index = currentTags.findIndex(t => t.name === tagVal.name);
        if (index === -1) {
            currentTags.push(tagVal);
        } else {
            currentTags.splice(index, 1);
        }

        if (currentTags.length === 0) {
            activeTags.value = [{ name: 'All tags' }];
        } else {
            activeTags.value = currentTags;
        }
    }

    const resetFilters = () => {
        activeTags.value = [{ name: 'All tags' }];
        searchQuery.value = '';
        currentPage.value = 1;
    }

    const changePage = () => {
        window.scrollTo(0, 0)
    };

    const generateCardHref = (blueprint) => {
      return `/blueprints/${blueprint.id}`
    }

    const setBlueprints = (allBlueprints, total) => {
        blueprints.value = allBlueprints || []
        totalBlueprints.value = total || 0
        totalPages.value = itemsPerPage.value ? Math.ceil(total / itemsPerPage.value) : 0
    }

    if(route.query.page) currentPage.value = parseInt(route.query.page)
    if(route.query.size) itemsPerPage.value = parseInt(route.query.size)
    if(route.query.q) searchQuery.value = route.query.q;

    if(route.query.tags) {
        const tagIds = route.query.tags.split(',');
        const foundTags = tags.value.filter(item => tagIds.includes(item.id));
        if (foundTags.length > 0) {
            activeTags.value = foundTags;
        }
    }

    const { data: blueprintsData, error } = await useAsyncData(
      `blueprints`,
      () => useBlueprintsList({
        page: currentPage.value,
        size: itemsPerPage.value,
        tags: getActiveTagIds(),
        q: searchQuery.value
      })
    )

    if (error && error.value) {
        console.error("Blueprint fetch error:", error.value);
    }

    if(blueprintsData.value) {
        setBlueprints(blueprintsData.value.results, blueprintsData.value.total)
    }

    watch(() => route.query, async () => {
      if (!route.query.tags && !route.query.page && !route.query.size && !route.query.q) {
        activeTags.value = [{ name: 'All tags' }]
      }
    });

    let timer;
    watch([currentPage, itemsPerPage, searchQuery, activeTags], ([pageVal, itemVal, searchVal, activeTagsVal], [oldPage, oldItemVal, oldSearch, oldTags]) => {
        if(timer) clearTimeout(timer)

        timer = setTimeout(async () => {
            const isFilterChange = (itemVal !== oldItemVal) || (searchVal !== oldSearch) || (JSON.stringify(activeTagsVal) !== JSON.stringify(oldTags));
            const newPage = isFilterChange ? 1 : pageVal;

            if (isFilterChange && currentPage.value !== 1) {
                currentPage.value = 1;
            }

            const tagIds = getActiveTagIds();

            const url = `${config.public.apiUrl}/blueprints/versions/latest?page=${newPage}&size=${itemVal}${tagIds ? `&tags=${tagIds}` : ''}${searchVal.length ? `&q=${searchVal}` : ''}`;

            try {
                const { data } = await useFetch(url);
                if (data.value) {
                    setBlueprints(data.value.results, data.value.total);
                } else {
                    setBlueprints([], 0);
                }
            } catch (e) {
                setBlueprints([], 0);
            }

            function getQuery() {
                let query = {
                    page: newPage,
                    size: itemVal,
                };
                if (tagIds) query['tags'] = tagIds;
                if(searchVal.length) query['q'] = searchVal;
                return query
            }

            router.push({ query: getQuery() })

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