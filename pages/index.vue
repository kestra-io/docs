<template>
    <div class="content">
        <Head>
            <Title>Kestra, Open Source Declarative Data Orchestration</Title>
            <Meta name="description" content="Use declarative language to build simpler, faster, scalable and flexible data pipelines" />
        </Head>

        <HomeHeader />
        <HomeFeatures />
        <HomeUI />
        <HomeHow />
        <HomePlugins />
        <HomeTestimonials />
        <HomeEnterpriseEdition />
        <HomeOpenSource />
        <LayoutBlogs title="What’s new in Kestra?" />
        <LayoutNewsletter />
    </div>
</template>

<script setup>
    definePageMeta({
        transparentHeader: true,
    })
</script>

<style lang="scss" scoped>
    .content {
        margin-top: -67px;
    }
</style>