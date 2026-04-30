<template>
    <div class="resource-hero">
        <h1>All Orchestration Resources</h1>
        <p class="subtitle">
            Discover a comprehensive index of in-depth guides, whitepapers,
            and playbooks spanning data orchestration, AI workflows, and
            infrastructure automation — built for engineers and platform
            teams shipping production workflows at every stage.
        </p>
        <label class="search">
            <Magnify class="search-icon" />
            <input
                type="search"
                v-model="query"
                placeholder="Search resources…"
                aria-label="Search resources"
            />
        </label>
    </div>
</template>

<script setup lang="ts">
    import { ref, watch, onMounted } from "vue"
    import Magnify from "vue-material-design-icons/Magnify.vue"

    const query = ref("")

    watch(query, (value) => {
        window.dispatchEvent(
            new CustomEvent("resources-search", { detail: value }),
        )
    })

    onMounted(() => {
        const initial = new URL(window.location.href).searchParams.get("q")
        if (initial) query.value = initial
    })
</script>

<style lang="scss" scoped>
    .resource-hero {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        max-width: 720px;
    }

    h1 {
        margin: 0;
    }

    .subtitle {
        color: var(--ks-content-secondary);
        font-size: $font-size-md;
        margin: 0;
    }

    .search {
        position: relative;
        display: flex;
        align-items: center;
        margin-top: 0.75rem;
        background: var(--ks-background-body);
        border: $block-border;
        border-radius: 10px;
        padding: 0.5rem 0.75rem 0.5rem 2.5rem;
        transition: border-color 0.2s ease, box-shadow 0.2s ease;

        &:focus-within {
            border-color: var(--ks-content-link);
            box-shadow: 0 0 0 3px rgba(94, 110, 212, 0.16);
        }

        .search-icon {
            position: absolute;
            left: 0.75rem;
            top: 50%;
            transform: translateY(-50%);
            color: var(--ks-content-tertiary);
            font-size: 1.25rem;
            pointer-events: none;
        }

        input {
            flex: 1;
            border: 0;
            outline: 0;
            background: transparent;
            color: var(--ks-content-primary);
            font-size: $font-size-sm;
            padding: 0.125rem 0;

            &::placeholder {
                color: var(--ks-content-tertiary);
            }

            &::-webkit-search-cancel-button {
                cursor: pointer;
            }
        }
    }
</style>
