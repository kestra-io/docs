<template>
    <div class="harness-root">
        <div class="real-header"><Header /></div>
        <div class="real-search"><Search :random-ai-questions="questions" /></div>
    <div class="bd-layout">
        <NavSideBar type="docs" :navigation="nav" slug="docs/intro" />
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
        { title: "First", path: "docs/first", children: [] },
        { title: "Second", path: "docs/second", children: [] },
        { title: "Third", path: "docs/third", children: [] },
    ] }]
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
