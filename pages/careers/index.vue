<template>
    <div>
        <Head>
            <Title>Join Us and Shape the Future of Data Orchestration</Title>
            <Meta name="description"
                  content="Discover exciting career opportunities at Kestra. Join our passionate team and help us shape the future of data orchestration"/>
        </Head>

        <CareersHeader/>
        <CareersPerks/>
        <CareersPositions/>
        <LayoutCommunity/>
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
            { name: 'twitter:image', content: `${origin}/landing/careers/header.svg` },
            {
                name: 'twitter:image:alt',
                content: "A square with circles inside with emojis in It representing Kestra's inclusive and dynamic workplace culture"
            }
        ]
    })
</script>
