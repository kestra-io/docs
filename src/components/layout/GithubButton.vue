<template>
    <div
        v-if="!hasError"
        class="btn-group mb-1 mn-sm-0 me-sm-2 github"
        :class="{ 'btn-group-sm': small }"
    >
        <a
            class="btn btn-dark"
            :class="{ 'btn-sm': small }"
            href="https://github.com/kestra-io/kestra"
            target="_blank"
        >
            <Github /> <span class="d-none d-xl-inline-block"> Star</span>
        </a>
        <a
            class="btn btn-outline-dark"
            :class="{ 'btn-sm': small }"
            href="https://github.com/kestra-io/kestra"
            target="_blank"
        >
            <LayoutGithubStargazer v-if="onClient" @api-error="!hasError" />
            <span v-else class="placeholder" style="width: 39px"></span>
        </a>
    </div>
</template>

<script setup lang="ts">
    import { ref, onMounted } from "vue"
    import Github from "vue-material-design-icons/Github.vue"
    import LayoutGithubStargazer from "~/components/layout/GithubStargazer.client.vue"

    const hasError = ref(false)
    const onClient = ref(false)
    onMounted(() => {
        onClient.value = true
    })

    withDefaults(defineProps<{ small?: boolean }>(), { small: false })
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";
    .btn-group {
        background: transparent !important;
        border: 0 !important;
        &.btn-group-sm {
            .btn-sm {
                padding: 0.25rem 0.5rem;
            }
        }
        .btn {
            border: 1px solid $black-5;
            color: $white-1 !important;
        }
        .btn-dark {
            background: #333336;
        }
        .btn-outline-dark {
            border-left: 0;
            color: $black-5;
            background: #18181B;
            .placeholder {
                background: transparent;
            }
        }
        .btn-outline-dark:hover {
            background: $black-5 !important;
        }
    }
</style>