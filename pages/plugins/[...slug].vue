<template>
    <div class="container-xxl bd-gutter mt-3 my-md-4 bd-layout">
<!--        <NavSidebar items={allDocs}  depthLevel={0} activeSlug={Astro.url.pathname.replace("/docs/","")} client:load/>-->

        <nav>
            <ContentList path="/plugins" v-slot="{ list }">
                <template v-for="article in list" :key="article._path">
                    <NuxtLink :to="article._path">{{ article.title }}</NuxtLink><br />
                </template>
            </ContentList>
        </nav>

        <main class="bd-main order-1">
            <ContentRenderer :value="page">
                <div class="bd-intro pt-2 ps-lg-2">
                    <div class="d-md-flex flex-md-row-reverse align-items-center justify-content-between">
                        <div class="mb-3 mb-md-0 d-flex text-nowrap">
                            <a class="btn btn-sm btn-outline-primary rounded-2" href="#" title="View and edit this file on GitHub" target="_blank" rel="noopener">
                                View on GitHub
                            </a>
                        </div>
                        <h1 class="bd-title mb-0" id="content">{{ page.title }}</h1>
                    </div>
                </div>

<!--                <NavToc headings={headings} />-->

                <div class="bd-content ps-lg-2">
                    <ContentRendererMarkdown :value="page" />
                </div>
            </ContentRenderer>
        </main>
    </div>

</template>

<script setup>
    const route = useRoute()
    const slug = "/plugins/" + (route.params.slug instanceof Array ? route.params.slug.join('/') : route.params.slug);
    const page = await queryContent(slug).findOne()
</script>

<style lang="scss">
    @import '../../assets/styles/docs.scss';
</style>

