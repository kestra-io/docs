<template>
    <div class="changelog-list">
        <div class="my-6 d-flex align-items-center gap-3">
            <div class="search-input w-100">
                <Magnify />
                <input
                    class="form-control"
                    placeholder="Search releases..."
                    v-model="searchQuery"
                />
            </div>

            <span
                class="badge-major filter-btn"
                :class="{ active: currentFilter === 'major' }"
                @click="setFilter('major')"
            >
                Major
            </span>

            <span
                class="badge-minor filter-btn"
                :class="{ active: currentFilter === 'minor' }"
                @click="setFilter('minor')"
            >
                Minor
            </span>
        </div>

        <div class="row row-cols-1 row-cols-md-3 g-4" v-if="releasesPaginated.length > 0">
            <div v-for="r in releasesPaginated" :key="r.tag_name" class="col">
                <a
                    class="card h-100 text-decoration-none text-reset release-card"
                    :href="`/docs/changelog/${r.tag_name}`"
                >
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h5 class="card-title mb-0">
                                {{ r.name || r.tag_name }}
                            </h5>

                            <span :class="`badge ${isMajor(r) ? 'badge-major' : 'badge-minor'}`">
                                {{ isMajor(r) ? "Major" : "Minor" }}
                            </span>
                        </div>

                        <small class="text-muted mb-2 d-flex align-items-center gap-1">
                            <b><CalendarRange /> Published on</b>
                            {{ new Date(r.published_at).toLocaleDateString("en-US") }}
                        </small>
                    </div>
                </a>
            </div>
        </div>

        <div
            v-else
            class="col-12 d-flex flex-column align-items-center justify-content-center py-5"
        >
            <h4 class="text-white mb-4">No releases found</h4>
        </div>

        <CommonPaginationContainer
            v-if="filteredReleases.length > 0"
            :current-url="currentUrl"
            :total-items="filteredReleases.length"
            :default-size="12"
            :show-total="false"
            @update="handleUpdate"
        />
    </div>
</template>

<script lang="ts" setup>
    import { computed, onMounted, ref, watch } from "vue"
    import CalendarRange from "vue-material-design-icons/CalendarRange.vue"
    import Magnify from "vue-material-design-icons/Magnify.vue"
    import CommonPaginationContainer from "~/components/common/PaginationContainer.vue"

    interface Release {
        tag_name: string
        name?: string
        body: string
        published_at: string
    }

    const props = defineProps<{
        releases: Release[]
        currentUrl: string
    }>()

    const currentPage = ref(1)
    const itemsPerPage = ref(12)
    const searchQuery = ref("")
    const currentFilter = ref("all")

    onMounted(() => {
        if (typeof window !== "undefined") {
            const params = new URL(window.location.href).searchParams

            currentFilter.value = params.get("filter") ?? "all"
            currentPage.value = parseInt(params.get("page") ?? "1")
            itemsPerPage.value = parseInt(params.get("size") ?? "12")
        }
    })

    const filteredReleases = computed(() => {
        let result = props.releases

        if (searchQuery.value) {
            result = result.filter((r) =>
                `${r.name || r.tag_name} ${r.tag_name}`
                    .toLowerCase()
                    .includes(searchQuery.value.toLowerCase()),
            )
        }

        if (currentFilter.value !== "all") {
            result = result.filter(
                (r) =>
                    (r.tag_name.replace(/^v/, "").split(".").pop() === "0") ===
                    (currentFilter.value === "major"),
            )
        }

        return result
    })

    const releasesPaginated = computed(() =>
        filteredReleases.value.slice(
            (currentPage.value - 1) * itemsPerPage.value,
            (currentPage.value - 1) * itemsPerPage.value + itemsPerPage.value,
        ),
    )

    const updateUrl = () => {
        if (typeof window !== "undefined") {
            const url = new URL(window.location.href)
            if (currentFilter.value === "all") url.searchParams.delete("filter")
            else url.searchParams.set("filter", currentFilter.value)

            window.history.pushState({}, "", url.toString())
        }
    }

    const changePage = () => {
        if (typeof window !== "undefined") {
            window.scrollTo({ top: 0, behavior: "smooth" })
        }
    }

    const setFilter = (filter: string) => {
        currentFilter.value = currentFilter.value === filter ? "all" : filter
        currentPage.value = 1
        updateUrl()
    }

    const handleUpdate = ({ page, size }: { page: number; size: number }) => {
        currentPage.value = page
        itemsPerPage.value = size
        changePage()
    }

    const isMajor = (r: Release) => r.tag_name.replace(/^v/, "").split(".").pop() === "0"

    watch([searchQuery, currentFilter], () => (currentPage.value = 1))
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    .form-control {
        padding: 0.25rem 0.5rem 0.25rem 2rem;
        border: 1px solid var(--ks-border-primary);
        background: var(--ks-background-input);
        color: $white-1;
        font-size: 14px;

        &::placeholder {
            color: $gray-500;
            font-size: 12px;
        }
    }

    .search-input {
        position: relative;

        .magnify-icon {
            position: absolute;
            left: 0.5rem;
            top: 50%;
            bottom: 2px;
            transform: translateY(-50%);
            color: $gray-500;
            z-index: 1;
        }
    }

    .release-card {
        border: 1px solid var(--ks-border-primary);
        background: var(--ks-background-body);
        transition:
            transform 0.2s ease,
            border-color 0.2s ease;

        &:hover {
            border-color: $purple-35;
            transform: scale(1.01);
        }
    }

    .card-title {
        color: $white !important;
    }

    .badge {
        &-major,
        &-minor {
            border-radius: 40px;
            font-size: 12px;
            font-weight: 500;
            padding: 4px 12px;
        }

        &-major {
            border: 1px solid var(--ks-border-running);
            background: var(--ks-background-running);
            color: var(--ks-content-running);
        }

        &-minor {
            border: 1px solid var(--ks-border-warning);
            background: var(--ks-background-warning);
            color: var(--ks-content-warning);
        }
    }

    .filter-btn {
        cursor: pointer;
        transition:
            opacity 0.2s,
            border-color 0.2s;
        display: inline-block;

        &:hover {
            opacity: 0.8;
        }

        &.active {
            opacity: 1;
            box-shadow: 0 0 8px currentColor;
        }
    }

    small {
        color: $white-4 !important;
        font-size: 12px !important;
    }
</style>