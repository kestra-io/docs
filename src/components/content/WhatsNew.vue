<template>
    <div>
        <BlogList :posts="posts" :title="title" />
    </div>
</template>

<script setup lang="ts">
    const { public: { CollectionNames } } = useRuntimeConfig()
    import BlogList from '~/components/common/BlogList.vue';

    defineProps({
        title: {
            type: String,
            required: true
        }
    })

    const dateTimeFormat = new Intl.DateTimeFormat('en-US', {
        dateStyle: 'long',
    })

    const { data: posts } = await useAsyncData(
        `Blog-Page-Short-List`,
        () => queryCollection(CollectionNames.blogs).order("date", "DESC").limit(4).all()
    );
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    :deep(h2) {
        font-size: $font-size-xl;
        margin-top: 3rem !important;
        margin-bottom: 1rem;
        padding: 0;
        font-weight: 600;
    }
</style>
