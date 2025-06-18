<template>
    <div class="about-us">
        <Head>
            <Title>About Us</Title>
            <Meta name="description"
                content="Discover the team and values behind our mission to empower data-driven organizations worldwide"/>
        </Head>
        <CompanyOrchestrate/>
        <CompanyMission/>
        <CompanyTeam/>
        <CompanyInvestors/>
        <CompanyNewsGrid/>
        <CompanyLife/>
    </div>
</template>

<script setup>
    const { origin } = useRequestURL()
    useHead({
        meta: [
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'twitter:site', content: '@kestra_io' },
            { name: 'twitter:title', content: "About Us" },
            {
                name: 'twitter:description',
                content: "Discover the team and values behind our mission to empower data-driven organizations worldwide"
            },
            { name: 'twitter:image', content: `${origin}/og-image.png` },
            { name: 'twitter:image:alt', content: "About-Us" },
            { property: 'og:title', content: "About Us" },
            { property: 'og:description', content: "Discover the team and values behind our mission to empower data-driven organizations worldwide" },
            { property: 'og:image', content: `${origin}/og-image.png` },
            { property: 'og:image:type', content: "image/svg+xml" },
            { property: 'og:image:alt', content: "About-Us" },
            { property: 'og:url', content: `${origin}/about-us` },
        ]
    })

</script>
<style lang="scss" scoped>
.container {
    overflow-y: hidden;
}

.about-us {
    position: relative;
    min-height: 100vh;

    &::after {
        content: "";
        position: fixed;
        top: 0;
        right: 0;
        width: 100%;
        height: 100%;
        background: url("/landing/company/teams/gridbg.svg") center/cover no-repeat fixed;
        z-index: -1;
    }
}
</style>
