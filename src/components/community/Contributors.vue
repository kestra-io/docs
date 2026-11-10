<template>
    <section>
        <div class="container">
            <h2 class="text-center">Our contributors</h2>
            <div ref="topOfSection" />
            <div class="contributors d-flex flex-wrap justify-content-center">
                <a
                    v-for="contributor in displayedContributors"
                    :key="contributor.name"
                    :href="'https://github.com/' + contributor.name"
                    target="_blank"
                    rel="noopener"
                    class="d-flex flex-column gap-3 align-items-center"
                >
                    <img
                        width="90"
                        height="90"
                        loading="lazy"
                        decoding="async"
                        class="rounded-circle"
                        :src="avatarUrl(contributor.avatar)"
                        :alt="contributor.name"
                    />
                    <p>{{ contributor.name }}</p>
                </a>
            </div>
            <div v-if="remaining > 0 || isExpanded" class="actions mt-4">
                <button
                    v-if="remaining > 0"
                    type="button"
                    class="btn btn-secondary"
                    :disabled="isLoading"
                    @click="showMore"
                >
                    {{ formatNumber(remaining) }} more contributors
                </button>
                <button
                    v-if="isExpanded"
                    type="button"
                    class="btn btn-secondary"
                    @click="collapse"
                >
                    Show less
                </button>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
    import { computed, ref } from "vue"
    import { $fetchApiCached } from "~/utils/fetch"
    import type { Contributor } from "~/components/community/types"
    import { orderContributors } from "~/components/community/contributors"

    const props = defineProps<{
        initial: Contributor[]
        total: number
        seed?: number
    }>()

    // Each click reveals one more page, the size of the server-rendered set,
    // rather than the whole list of thousands at once.
    const pageSize = props.initial.length
    const all = ref<Contributor[]>()
    const shown = ref(pageSize)
    const isLoading = ref(false)
    const topOfSection = ref<HTMLElement>()

    const formatNumber = new Intl.NumberFormat("en-US").format

    const avatarUrl = (avatar: string) => {
        try {
            const url = new URL(avatar)
            url.searchParams.set("s", "180")
            return url.toString()
        } catch {
            return avatar
        }
    }

    const displayedContributors = computed(() =>
        (all.value ?? props.initial).slice(0, shown.value),
    )
    const remaining = computed(() =>
        Math.max((all.value?.length ?? props.total) - shown.value, 0),
    )
    const isExpanded = computed(() => shown.value > pageSize)

    const showMore = async () => {
        if (!all.value) {
            isLoading.value = true
            try {
                const data = await $fetchApiCached<Contributor[]>(
                    "/communities/github/contributors",
                )
                all.value = orderContributors(data, props.seed)
            } catch (error) {
                console.error("Could not load the full contributor list:", error)
                return
            } finally {
                isLoading.value = false
            }
        }
        shown.value += pageSize
    }

    const collapse = () => {
        shown.value = pageSize
        topOfSection.value?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        })
    }
</script>

<style lang="scss" scoped>
    section {
        padding: 7.5rem $rem-1;
        background: var(--ks-background-secondary);

        h2 {
            margin-bottom: 3rem;
        }
    }

    .actions {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 1rem;
    }

    .contributors {
        height: 100%;
        max-height: 100%;
        overflow: hidden;
        text-align: center;
        gap: 2rem;
        a {
            width: 90px;
            color: var(--ks-content-primary);
            text-decoration: none;
            font-size: $font-size-md;
            img {
                width: 90px;
                height: 90px;
                border-radius: 50%;
            }
            p {
                max-width: 100%;
                margin: 0;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
        }
    }
</style>
