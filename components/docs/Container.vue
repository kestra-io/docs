<template>
    <div class="container bd-gutter bd-layout margin">
        <NavSideBar :type="type" v-if="pageList" :page-list="pageList"/>

        <article class="bd-main order-1" v-if="page" :class="{'full': page.rightBar === false}">
            <ContentRenderer :value="page">
                <div class="bd-title">
                    <Breadcrumb :slug="props.slug" :pageList="pageList"/>
                    <h1 v-html="transformTitle(page.title)"></h1>
                </div>

                <NavToc :page="page"/>

                <div class="bd-content">
                    <ContentRendererMarkdown
                        class="bd-markdown"
                        :value="page"
                        data-bs-spy="scroll"
                        data-bs-target="#nav-toc"
                    />
                    <PrevNext :base-path="`/${type}`" />
                </div>
            </ContentRenderer>
        </article>
    </div>
</template>

<script setup>
    import PrevNext from "./PrevNext.vue";
    import NavSideBar from "./NavSideBar.vue";
    import Breadcrumb from "./Breadcrumb.vue";
    import NavToc from "./NavToc.vue";
    import {hash} from "ohash";

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

    const {data: page, error} = await useAsyncData(`Container-${hash(props.slug)}`, () => {
        try {
            return queryContent(props.slug).findOne();
        } catch (error) {
            throw createError({statusCode: 404, message: error.toString(), data: error, fatal: true})
        }
    });

    if (error && error.value) {
        throw error.value;
    }

    const {data: pageList} = await useAsyncData(
        `Container-pageList-${hash(props.type)}`,
        () => queryContent(props.type).only("_path").find(),
        {
            transform: (pages) => pages.map(e => e._path)
        }
    );

    useContentHead(page)

    const transformTitle = (text) => {
        return text
            .replace(/([A-Z])/g, '&#x200B;$1')
            .replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
    }
    const {description,title} = page
useHead({
        meta:[
            {name:'twitter:card',content:'summary-large-image'},
            {name : 'twitter:site',content:'@kaestra_io'},
            {name : 'twitter:title',content:title},
            {name:'twitter:description',content:description},
            {name : 'twitter:image' ,content:"/landing/home/header-bg.png"},
            {name : 'twitter:image:alt',content : title}
        ]
    })
</script>



