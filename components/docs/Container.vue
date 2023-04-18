<template>
    <div class="container bd-gutter mt-3 my-md-4 bd-layout">
        <NavSideBar :type="type" :page-list="pageList" />

        <main class="bd-main order-1" :class="{'full': page.rightBar === false}">
            <ContentRenderer :value="page">
                <h1>{{ page.title }}</h1>

                <NavToc :page="page" />

                <div class="bd-content ps-lg-2">
                    <ContentRendererMarkdown class="bd-markdown" :value="page" data-bs-spy="scroll" data-bs-target="#nav-toc" />
                    <PrevNext />
                </div>
            </ContentRenderer>
        </main>
    </div>
</template>

<script setup>
    import PrevNext from "./PrevNext.vue";
    import NavSideBar from "./NavSideBar.vue";
    import NavToc from "./NavToc.vue";

    const props = defineProps({
        slug: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true
        }
    })
    const page = await queryContent(props.slug).findOne();
    const pageList = (await queryContent(props.type).find()).map(e => e._path);
    useContentHead(page)
</script>

<style lang="scss">
    @import '../../assets/styles/docs.scss';
</style>

