<template>
    <div class="container bd-gutter mt-3 my-md-4 bd-layout">
        <NavSideBar :type="type" />

        <main class="bd-main order-1">
            <ContentRenderer :value="page">
                <NavToc :toc="page.body.toc" />

                <div class="bd-content ps-lg-2">
                    <h1>{{ page.title }}</h1>
                    <ContentRendererMarkdown :value="page" data-bs-spy="scroll" data-bs-target="#nav-toc" />
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
    useContentHead(page)
</script>

<style lang="scss">
    @import '../../assets/styles/docs.scss';
</style>

