<script lang="ts" setup>
    import ArrowRight from "vue-material-design-icons/ArrowRight.vue"
    import type { AshbyJob } from "~/utils/careers.ts"
    import { slugify } from "@kestra-io/ui-libs"
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
                    <a
                        :href="`/careers/${doc.jobPostingIds[0]}-${slugify(doc.title)}`"
                    >
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
