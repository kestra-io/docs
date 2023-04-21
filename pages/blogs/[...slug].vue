<template>
    <div class="container">
        <BlogsList v-if="slug === '/blogs/'" :blogs="page"/>

        <main v-else class="bd-main order-1 mt-5">
            <ContentRenderer :value="page">
                <NavToc :page="page">
                    <template #header>
                        <BlogDetails :blog="page"/>
                    </template>
                </NavToc>
                <div class="bd-content ps-lg-2">
                    <h1>{{ page.title }}</h1>
                    <img class="mb-5 blog-img" :alt="page.title" :src="page.image"/>
                    <ContentRendererMarkdown :value="page"/>
                </div>
            </ContentRenderer>
        </main>
    </div>

</template>

<script setup>
    import NavToc from "~/components/docs/NavToc.vue";
    import BlogDetails from "~/components/blogs/BlogDetails.vue";

    const route = useRoute()
    const slug = "/blogs/" + (route.params.slug instanceof Array ? route.params.slug.join('/') : route.params.slug);
    let page;
    if (slug === "/blogs/") {
        page = await queryContent("/blogs/").find();
        useHead({
            title: "Insights & News on Data Orchestration",
            description: "Explore the Kestra Blog for the latest articles, insights, product updates & engineering deep dives."
        })
    } else {
        try {
            page = await queryContent(slug).findOne();
        } catch (error) {
            throw createError({statusCode: 404, message: error.toString(), data: error, fatal: true})
        }

        useContentHead(page)
    }
</script>

<style lang="scss">
    @import '../../assets/styles/blogs.scss';
</style>

