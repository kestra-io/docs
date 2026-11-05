<template>
    <div class="harness-root">
        <div class="real-header"><Header /></div>
        <div class="real-search"><Search :random-ai-questions="questions" /></div>
    <div class="bd-layout">
        <NavSideBar type="docs" :navigation="nav" :slug="slug" />
        <button class="harness-navigate" @click="slug = '/docs/third/child-c'">navigate</button>
        <button class="harness-navigate-sibling" @click="slug = '/docs/second/child-a'">navigate within branch</button>
        <NavToc :links="links" :markdown-body="body" page-path="/docs/intro" page-title="Intro" />
        <div class="blog-toc-host"><BlogToc :links="links" /></div>
        <CustomSelect v-model="selected" :options="options" label="Sort" />
        <p class="selected-readout">{{ selected }}</p>
        <Styleguide />
        <Elements />
    </div>
    </div>
</template>
<script setup lang="ts">
    import { ref } from "vue"
    import NavSideBar from "~/components/docs/NavSideBar.vue"
    import NavToc from "~/components/docs/NavToc.vue"
    import BlogToc from "~/components/blogs/BlogToc.vue"
    import CustomSelect from "~/components/common/CustomSelect.vue"
    import Styleguide from "./Styleguide.vue"
    import Elements from "./Elements.vue"
    import Header from "~/components/layout/Header.vue"
    import Search from "~/components/layout/Search.vue"

    const nav = [{ children: [
        { title: "First", path: "/docs/first", children: [] },
        { title: "Second", path: "/docs/second", children: [
            { title: "Child A", path: "/docs/second/child-a", children: [] },
            { title: "Child B", path: "/docs/second/child-b", children: [] },
        ] },
        { title: "Third", path: "/docs/third", children: [
            { title: "Child C", path: "/docs/third/child-c", children: [] },
        ] },
    ] }]
    const slug = ref("/docs/second/child-b")
    const links = [
        { id: "one", depth: 2, text: "Section one" },
        { id: "two", depth: 2, text: "Section two" },
        { id: "three", depth: 2, text: "Section three" },
    ]
    const body = "# Intro\n\nSome markdown body."
    const options = [
        { value: "newest", label: "Newest" },
        { value: "oldest", label: "Oldest" },
    ]
    const selected = ref("newest")
    const questions = ["What is Kestra?", "How do I run a flow?"]
</script>

<style>
    /* The real header is position: fixed; keep it off the probed content. */
    .harness-root { padding-top: 220px; }
</style>
