<template>
<NuxtLink :href="`/blueprints/${blueprint.id}`">
    <div class="card">
        <div class="card-body d-flex flex-column justify-content-between gap-3">
            <div>
                <div class="card-text">
                    <p class="title">{{ blueprint.title }}</p>
                </div>
                <h6 v-if="blueprint.description">
                    {{ blueprint.description.length > 150 ? blueprint.description.substring(0, 150) + '...' : blueprint.description }}
                </h6>
            </div>
            <div class="d-flex flex-wrap gap-3" v-if="icons">
                <div class="icon" v-for="n in blueprint.includedTasks" :key="n">
                    <BlueprintsTaskIcon :cls="icons[n]" v-if="icons[n]" />
                </div>
            </div>
        </div>
    </div>
</NuxtLink>
</template>

<script>
export default {
    props: {
        blueprint: {
            type: Object,
            required: true
        },
        icons: {
            type: Object,
            default: undefined
        }
    }
}
</script>

<style scoped lang="scss">
@import "../../assets/styles/variable";
.card {
    height: 100%;
    .card-body {
        padding: 2rem !important;
        .icon {
            border: 1px solid #E5E4F7;
            padding: 0.313rem 0.625rem;
            width: 44px;
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