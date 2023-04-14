<template>
    <div class="container">
        <nav v-if="false">
        </nav>
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
                    <img class="mb-5" :alt="page.title" :src="page.image"/>
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
    let page = null;
    if (slug === "/blogs/") {
        page = await queryContent("/blogs/").find();
    } else {
        page = await queryContent(slug).findOne();
    }
    useContentHead(page)

</script>

<style lang="scss">
    @import '../../assets/styles/blogs.scss';
</style>

