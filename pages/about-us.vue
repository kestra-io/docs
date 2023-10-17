<template>
    <div>
        <Head>
          <Title>About Us</Title>
          <Meta name="description" content="Discover the team and values behind our mission to empower data-driven organizations worldwide" />
        </Head>

        <CompanyHeader />
        <CompanyOrchestration />
        <CompanyPlatform />
        <CompanyLaunch />
        <CompanyValue />
        <CompanyTeam />
        <CompanyJoin />
        <CompanyPress />
    </div>
</template>

<script setup>
useHead({
  meta:[
      {name:'twitter:card',content:'summary-large-image'},
      {name : 'twitter:site',content:'@kaestra_io'},
      {name : 'twitter:title',content:"about-us"},
      {name:'twitter:description',content:"Discover the team and values behind our mission to empower data-driven organizations worldwide"},
      {name : 'twitter:image' ,content:"/landing/company/header.svg"},
      {name : 'twitter:image:alt',content : "About-Us"}
  ]
})

</script>
