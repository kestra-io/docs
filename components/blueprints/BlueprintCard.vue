<template>
<NuxtLink :href="blueprint.path">
    <div class="card">
        <div class="card-body d-flex flex-column justify-content-between gap-3">
            <div>
                <div class="card-text">
                    <div class="category">{{ blueprint.category }}</div>
                </div>
                <h6 class="card-title">{{ blueprint.title }}</h6>
            </div>
            <div class="d-flex flex-wrap gap-3">
                <!-- Placeholder for now as data will come from api -->
                <span class="icon" v-for="n in 3" :key="n">Icon</span>
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
        }
    }
    div.category {
        font-size: $font-size-xs;
        color: var(--bs-pink);
        font-weight: 700;
        text-transform: uppercase;
        font-family: var(--bs-font-monospace);
        line-height: 1.75rem;
    }
}
</style>