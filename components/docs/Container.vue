<template>
    <div class="container bd-gutter bd-layout margin">
        <NavSideBar :type="type" :page-list="pageList"/>

        <main class="bd-main order-1" :class="{'full': page.rightBar === false}">
            <ContentRenderer :value="page">
                <div>
                    <Breadcrumb :slug="props.slug" />
                    <h1>{{ removeEmoji(page.title) }}</h1>
                </div>

                <NavToc :page="page"/>

                <div class="bd-content ps-lg-2">
                    <ContentRendererMarkdown class="bd-markdown" :value="page" data-bs-spy="scroll"
                                             data-bs-target="#nav-toc"/>
                    <PrevNext/>
                </div>
            </ContentRenderer>
        </main>
    </div>
</template>

<script setup>
    import PrevNext from "./PrevNext.vue";
    import NavSideBar from "./NavSideBar.vue";
    import Breadcrumb from "./Breadcrumb.vue";
    import NavToc from "./NavToc.vue";

    const props = defineProps({
        slug: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true
        },
    })

    let page;
    try {
        page = await queryContent(props.slug).findOne();
    } catch (error) {
        throw createError({statusCode: 404, message: error.toString(), data: error, fatal: true})
    }

    const pageList = (await queryContent(props.type).find()).map(e => e._path);
    useContentHead(page)

    const removeEmoji = (text) => {
        return text.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
    }
</script>

<style lang="scss">
    @import '../../assets/styles/docs.scss';


</style>

