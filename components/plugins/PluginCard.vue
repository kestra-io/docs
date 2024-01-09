<template>
    <NuxtLink :href="`/plugins/${plugin.name}`">
        <div class="card">
            <div class="card-body d-flex flex-column justify-content-between gap-3">
                <div class="icon-content d-flex justify-content-center align-items-center">
                    <img :src="`${iconUrl}${plugin.group}`" :alt="plugin.title">
                </div>
                <div>
                    <div class="card-text">
                        <p class="title">{{ plugin.name }}</p>
                    </div>
                    <h6>
                        {{ plugin.title.length > 150 ? plugin.title.substring(0, 150) + '...' : plugin.title }}
                    </h6>
                </div>
            </div>
        </div>
    </NuxtLink>
</template>
<script setup>
    const config = useRuntimeConfig();
    const props = defineProps({
        plugin: {
            type: Object,
            required: true
        },
        icons: {
            type: Object,
            default: undefined
        },
    });
    const  iconUrl = `${config.public.apiUrl}/plugins/icons/`;
</script>


<style scoped lang="scss">
    @import "../../assets/styles/variable";

    .card {
        height: 100%;

        .card-body {
            padding: 2rem !important;

            .icon-content {
                border: 1px solid $white-2;
                padding: 0.313rem 0.625rem;
                height: 7.188rem;
                background-color: $purple-17;
                img {
                    width: 54px;
                }
            }
        }

        .title {
            font-size: $font-size-xs;
            color: var(--bs-pink);
            font-weight: 700;
            text-transform: uppercase;
            font-family: var(--bs-font-monospace);
            line-height: 1.375rem;
        }

        .description {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }

        .description::-webkit-scrollbar {
            display: none;
        }
    }
</style>