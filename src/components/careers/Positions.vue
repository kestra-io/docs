<script lang="ts" setup>
    import ArrowRight from "vue-material-design-icons/ArrowRight.vue"
    import type { AshbyJob } from "~/utils/careers.ts"
    import { jobPath, OPEN_APPLICATION_PATH } from "~/utils/careersPath.ts"
    import {
        searchDepartment,
        searchLocation,
        searchString,
    } from "./filterState"
    import { computed } from "vue"

    const props = defineProps<{
        positions: Array<AshbyJob>
    }>()

    const positionsByDepartment = computed(() => {
        const departments = new Map<string, AshbyJob["department"]>()
        return {
            departments,
            positions: props.positions.reduce(
                (acc, position) => {
                    if (searchString.value) {
                        const search = searchString.value.toLowerCase()
                        if (!position.title.toLowerCase().includes(search)) {
                            return acc
                        }
                    }
                    if (
                        searchDepartment.value &&
                        position.department?.id !== searchDepartment.value
                    ) {
                        return acc
                    }
                    if (
                        searchLocation.value &&
                        position.location.id !== searchLocation.value
                    ) {
                        return acc
                    }
                    const departmentId = position.department?.id ?? "-"
                    if (position.department) {
                        departments.set(departmentId, position.department)
                    }
                    if (!acc[departmentId]) {
                        acc[departmentId] = []
                    }
                    acc[departmentId].push(position)
                    return acc
                },
                {} as Record<string, AshbyJob[]>,
            ),
        }
    })

    const hasResults = computed(
        () => Object.keys(positionsByDepartment.value.positions).length > 0,
    )

    // Distinguishes "your search matched nothing" from "we have no openings at
    // all", which need different copy: the second has no filters to clear.
    const hasFilters = computed(
        () =>
            !!searchString.value ||
            !!searchDepartment.value ||
            !!searchLocation.value,
    )

    const clearFilters = () => {
        searchString.value = ""
        searchDepartment.value = ""
        searchLocation.value = ""
    }
</script>

<template>
    <section id="positions">
        <div
            v-for="(positions, departmentId) in positionsByDepartment.positions"
            :key="departmentId"
            class="container"
        >
            <h2 class="mb-4">
                {{
                    positionsByDepartment.departments.get(departmentId)?.name ||
                    "Other"
                }}
            </h2>
            <ul class="department-positions">
                <li v-for="doc in positions" :key="doc.id">
                    <a :href="jobPath(doc)">
                        <div class="info-block">
                            <span>{{ doc.title }}</span>
                        </div>

                        <div class="location-block">
                            <span>Remote ({{ doc.location.name }})</span>
                        </div>
                        <div class="arrow-block">
                            <ArrowRight alt="arrow_right" />
                        </div>
                    </a>
                </li>
            </ul>
        </div>

        <div v-if="!hasResults" class="container no-results">
            <template v-if="hasFilters">
                <h3>No roles found for this search.</h3>
                <p>
                    Try a different term, or clear the filters to see every open
                    role. Nothing that fits? We still want to hear from you.
                </p>
                <div class="no-results-actions">
                    <button
                        type="button"
                        class="btn btn-secondary"
                        @click="clearFilters"
                    >
                        Clear all filters
                    </button>
                    <a :href="OPEN_APPLICATION_PATH" class="btn btn-primary">
                        Send an Open Application
                    </a>
                </div>
            </template>
            <template v-else>
                <h3>No open roles right now.</h3>
                <p>
                    We are not hiring for a specific position at the moment, but
                    we are always glad to hear from people who want to build
                    with us.
                </p>
                <div class="no-results-actions">
                    <a :href="OPEN_APPLICATION_PATH" class="btn btn-primary">
                        Send an Open Application
                    </a>
                </div>
            </template>
        </div>
    </section>
</template>

<style lang="scss" scoped>
    section {
        .department-positions {
            list-style-type: none;
            padding: 0;
            display: flex;
            flex-direction: column;
            margin-bottom: 7rem;
        }

        .container {
            padding-inline: 1rem;
        }

        .no-results {
            text-align: center;
            padding-block: 3rem;
            margin-bottom: 7rem;

            h3 {
                font-size: 1.25rem;
                font-weight: 600;
                color: var(--ks-content-primary);
                margin-bottom: 0.5rem;
            }

            p {
                color: var(--ks-content-secondary);
                font-size: $font-size-sm;
                max-width: 32rem;
                margin-inline: auto;
                margin-bottom: 1.5rem;
            }

            .no-results-actions {
                display: flex;
                flex-wrap: wrap;
                gap: 0.75rem;
                justify-content: center;
            }
        }

        h2 {
            color: var(--ks-content-tertiary);
            font-family: $font-family-monospace;
            font-size: 0.8rem;
            font-weight: 400;
        }

        li {
            a {
                padding: 1rem 0.8rem;
                text-decoration: none;
                display: flex;
                align-items: center;
                gap: 1.5rem;
                transition: background-color 0.8s ease;
                border-bottom: 1px solid var(--ks-border-primary);
                &:hover {
                    background-color: var(--ks-background-secondary);
                }

                span {
                    color: var(--ks-content-primary);
                }

                .info-block {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                    flex-grow: 1;

                    span {
                        font-weight: 600;
                    }
                }

                .location-block span {
                    color: var(--ks-content-tertiary);

                    @include media-breakpoint-down(md) {
                        font-size: $font-size-sm;
                    }
                }

                .arrow-block {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                    font-size: 16px;
                }
            }
        }
    }
</style>
