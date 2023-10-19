<template>
    <div class="main">
        <div class="row h-100" :style="{ 'background-image': `url(${heroImage})` }">
            <div class="col-12 col-md-6">
                <div class="h-100 d-flex justify-content-end align-items-center">
                    <div class="container">
                        <DocsBreadcrumb :slug="slug" :page-list="pagelist" />
                        <h1 class="text-white">{{ title }}</h1>
                        <p class="text-white fs-4">{{ metaDescription }}</p>
                        <NuxtLink href="/demo">
                            <button class="btn btn-primary btn-lg">Book a demo</button>
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    slug: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    metaDescription: {
        type: String,
        required: true
    },
    heroImage: {
        type: String,
        required: true
    }
})

const pagelist = ['/stories', props.slug]
</script>

<style scoped lang="scss">
@import "../../assets/styles/variable";

.main {
    background-color: $purple-35;
    background-image: url('/stories/header/dots.svg');
    background-repeat: no-repeat;
    background-position: center;
    height: 640px;

    .row {
        background-repeat: no-repeat;
        background-position: 80%;

        .container {
            max-width: 500px;
        }
    }
}

:deep(.slug) {
    margin-left: 0;
}
</style>