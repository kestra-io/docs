<template>
    <div class="card h-100">
        <div class="card-body d-flex flex-column justify-content-between">
            <div>
                <p>{{ story.title }}</p>
                <h6>{{ story.description }}</h6>
            </div>
            <span class="text-primary">Read the story</span>
        </div>
    </div>
</template>

<script setup>
defineProps({
    story: {
        type: Object,
        required: true
    }
})
</script>

<style scoped lang="scss">
@import '../../assets/styles/variable';

.card-body {
    p {
        color: var(--bs-pink);
        font-size: $font-size-xs;
        font-weight: 700;
        line-height: 1.75rem;
    }

    h6 {
        line-height: 1.625rem;
    }
}
</style>