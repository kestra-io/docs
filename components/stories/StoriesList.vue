<template>
    <div class="container my-5">
        <p class="top-breadcrumb" data-aos="fade-right">
            Solutions
        </p>
        <h2 data-aos="fade-left">Kestra at Work: Stories of Operational Efficiency and Transformation</h2>
        <h5 data-aos="fade-right">Explore real-world applications of Kestra through our stories. Discover how companies around the world are transforming their workflows, automating processes, and managing business-critical applications with Kestra.</h5>
        <div class="row mt-3">
            <div class="col-12 col-md-4" v-for="story in stories" :key="story.id">
                <StoriesCard :story="story" />
            </div>
        </div>
    </div>
</template>

<script setup>
const stories = ref([
    {
        id: 1,
        title: 'Desiplayce',
        description: 'Scaling Data Operations with Kestra'
    },
    {
        id: 2,
        title: 'Reglo',
        description: 'Unified Control Plane and Simplified Orchestration with Kestra'
    },
    {
        id: 3,
        title: 'Leroy merlin',
        description: 'Enabling datamesh architecture and 900% increase in data production with Kestra'
    }
])
</script>

<style scoped lang="scss">
</style>