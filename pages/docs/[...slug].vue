<template>
    <div class="container bd-gutter mt-3 my-md-4 bd-layout">
        <NavAside />

        <nav v-if="false">

        </nav>

        <main class="bd-main order-1">
            <ContentRenderer :value="page">
<!--                <div class="bd-intro pt-2 ps-lg-2">-->
<!--                    <div class="d-md-flex flex-md-row-reverse align-items-center justify-content-between">-->
<!--                        <div class="mb-3 mb-md-0 d-flex text-nowrap">-->
<!--                            <a class="btn btn-sm btn-outline-primary rounded-2" href="#" title="View and edit this file on GitHub" target="_blank" rel="noopener">-->
<!--                                View on GitHub-->
<!--                            </a>-->
<!--                        </div>-->
<!--                        <h1 class="bd-title mb-0" id="content">{{ page.title }}</h1>-->
<!--                    </div>-->
<!--                </div>-->

                <NavToc :toc="page.body.toc" />

                <div class="bd-content ps-lg-2">
                    <ContentRendererMarkdown :value="page" />
                    <PrevNext />
                </div>
            </ContentRenderer>
        </main>
    </div>

</template>

<script setup>
    import PrevNext from "~/components/docs/PrevNext.vue";
    import NavToc from "~/components/docs/NavToc.vue";
    import NavAside from "~/components/docs/NavAside.vue";

    const route = useRoute()
    const slug = "/docs/" + (route.params.slug instanceof Array ? route.params.slug.join('/') : route.params.slug);
    const page = await queryContent(slug).findOne();
    useContentHead(page)
</script>

<style lang="scss">
    @import '../../assets/styles/docs.scss';
</style>

