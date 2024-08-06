<template>
    <div>
        <Head>
            <Title>About Us</Title>
            <Meta name="description"
                  content="Discover the team and values behind our mission to empower data-driven organizations worldwide"/>
        </Head>

        <CompanyHeader/>
        <CompanyOrchestration/>
        <CompanyPlatform/>
        <CompanyLaunch/>
        <CompanyValue/>
        <CompanyTeam/>
        <CompanyPress/>
        <LayoutFooterContact
            title="Join Our Team and Contribute to the Future of Data Orchestration"
            purpleButtonText="See open roles"
            purpleButtonHref="/careers"
        />
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
