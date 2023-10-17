<template>
    <div class="content">
        <Head>
            <Title>Kestra, Open Source Declarative Data Orchestration</Title>
            <Meta name="description" content="Use declarative language to build simpler, faster, scalable and flexible data pipelines" />
        </Head>

        <HomeHeader />
        <HomeFeatures />
        <HomeUI />
        <HomeHow />
        <HomePlugins />
        <HomeTestimonials />
        <HomeEnterpriseEdition />
        <HomeOpenSource />
        <LayoutBlogs title="What’s new in Kestra?" />
        <LayoutNewsletter />
    </div>
</template>

<script setup>
    definePageMeta({
        transparentHeader: true,
    })
useHead({
    meta:[
      {name:'twitter:card',content:'summary-large-image'},
      {name : 'twitter:site',content:'@kaestra_io'},
      {name : 'twitter:title',content:"Kestra, Open Source Declarative Data Orchestration"},
      {name:'twitter:description',content:"Use declarative language to build simpler, faster, scalable and flexible data pipelines"},
      {name : 'twitter:image' ,content:"/landing/home/header-bg.png"},
      {name : 'twitter:image:alt',content : "kaestra"}
    ]
  })
</script>

<style lang="scss" scoped>
    .content {
        margin-top: -67px;
    }
</style>