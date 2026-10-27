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
            <div v-if="moreCount > 0" class="text-center mt-4">
                <button
                    v-if="!isExpanded"
                    type="button"
                    class="btn btn-secondary"
                    :disabled="isLoading"
                    @click="expand"
                >
                    {{ moreCount }} more contributors
                </button>
                <button
                    v-else
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
    import { rankContributors } from "~/components/community/contributors"

    const props = defineProps<{
        initial: Contributor[]
        total: number
    }>()

    const all = ref<Contributor[]>()
    const isExpanded = ref(false)
    const isLoading = ref(false)
    const topOfSection = ref<HTMLElement>()

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
        isExpanded.value && all.value ? all.value : props.initial,
    )
    const moreCount = computed(() =>
        Math.max(props.total - props.initial.length, 0),
    )

    const expand = async () => {
        if (!all.value) {
            isLoading.value = true
            try {
                const data = await $fetchApiCached<Contributor[]>(
                    "/communities/github/contributors",
                )
                all.value = rankContributors(data)
            } catch (e) {
                return
            } finally {
                isLoading.value = false
            }
        }
        isExpanded.value = true
    }

    const collapse = () => {
        isExpanded.value = false
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
