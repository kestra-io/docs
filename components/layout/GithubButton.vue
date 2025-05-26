<template>
    <div class="btn-group mb-1 mn-sm-0 me-sm-2 github" :class="{'btn-group-sm' : small}">
        <a class="btn-outline-dark d-flex align-items-center justify-content-center gap-3" :class="{'btn-sm' : small}" href="https://github.com/kestra-io/kestra" target="_blank">
            <ClientOnly>
                <Github />
                <template v-slot:fallback>
                    <span class="placeholder" style="width: 39px"></span>
                </template>
                <LayoutGithubStargazer />
            </ClientOnly>
        </a>
    </div>
</template>

<script setup lang="ts">
import Github from "vue-material-design-icons/Github.vue"

withDefaults(defineProps<{ small?: boolean }>(), { small: false })
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .btn-group {
        &.btn-group-sm {
            background: transparent;
            border: 0 !important;
            .btn-sm {
                padding: 0.35rem .5rem;
            }
        }

        :deep(.material-design-icon__svg) {
            height: 1.5em;
            width: 1.5em;
            margin-bottom: -2px;
            margin-left: 5px;
        }

        .btn-outline-dark {
            color: $white;

            .placeholder {
                background: transparent;
            }
        }
    }
</style>