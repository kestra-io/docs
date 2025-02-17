<template>
    <div>
        <Head>
            <Title>Join Us and Shape the Future of Data Orchestration</Title>
            <Meta name="description"
                  content="Discover exciting career opportunities at Kestra. Join our passionate team and help us shape the future of data orchestration"/>
        </Head>

        <CareersHeader/>
        <CareersPositions/>
        <CareersPerks/>
        <LayoutFooterContact
            title="Join our community"
            darkButtonText="Join our Slack"
            darkButtonHref="https://kestra.io/slack"
            purpleButtonText="Contribute"
            purpleButtonHref="/docs/plugin-developer-guide"
        />
    </div>
</template>

<script setup>
    const { origin } = useRequestURL()
    useHead({
        meta: [
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'twitter:site', content: '@kestra_io' },
            { name: 'twitter:title', content: "Join Us and Shape the Future of Data Orchestration" },
            {
                name: 'twitter:description',
                content: "Discover exciting career opportunities at Kestra. Join our passionate team and help us shape the future of data orchestration"
            },
            { name: 'twitter:image', content: `${origin}/og-image.png` },
            { name: 'twitter:image:alt', content: "Join Us and Shape the Future of Data Orchestration" },
            { property: 'og:title', content: "Join Us and Shape the Future of Data Orchestration" },
            {
                property: 'og:description',
              content: "Discover exciting career opportunities at Kestra. Join our passionate team and help us shape the future of data orchestration"
            },
            { property: 'og:image', content: `${origin}/og-image.png` },
            { property: 'og:image:type', content: "image/svg+xml" },
            { property: 'og:image:alt', content: "Join Us and Shape the Future of Data Orchestration" },
        ]
    })
</script>
