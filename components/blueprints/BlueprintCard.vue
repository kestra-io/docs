<template>
<NuxtLink :href="blueprint.path">
    <div class="card">
        <div class="card-body d-flex flex-column justify-content-between gap-3">
            <div>
                <div class="card-text">
                    <p class="title">{{ blueprint.title }}</p>
                </div>
                <h6>
                    {{ blueprint.description.length > 150 ? blueprint.description.substring(0, 150) + '...' : blueprint.description }}
                </h6>
            </div>
            <div class="d-flex flex-wrap gap-3">
                <!-- Placeholder for now as data will come from api -->
                <span class="icon" v-for="n in blueprint.includedTasks" :key="n">
                    <!-- <TaskIcon :cls="n"></TaskIcon> -->
                </span>
            </div>
        </div>
    </div>
</NuxtLink>
</template>

<script>
// import TaskIcon from '@kestra-io/ui-libs/src/components/misc/TaskIcon.vue'
export default {
    props: {
        blueprint: {
            type: Object,
            required: true
        }
    },
    // components: { TaskIcon }
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
    .title {
        font-size: $font-size-xs;
        color: var(--bs-pink);
        font-weight: 700;
        text-transform: uppercase;
        font-family: var(--bs-font-monospace);
        line-height: 1.75rem;
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