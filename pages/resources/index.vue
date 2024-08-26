<template>
    <div>
        <Head>
            <Title>All Things Kestra in Video</Title>
            <Meta name="description"
                  content="Discover all our video tutorials, hands-on video, and more"/>
        </Head>
        <ResourcesTutorialsList />
    </div>
</template>

<script setup>
    const { origin } = useRequestURL()

    useHead({
        meta: [
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'twitter:site', content: '@kestra_io' },
            { name: 'twitter:title', content: "All Things Kestra in Video" },
            {
                name: 'twitter:description',
                content: "Discover all our video tutorials, hands-on video, and more"
            },
            { name: 'twitter:image', content: `${origin}/landing/careers/header.svg` },
            {
                name: 'twitter:image:alt',
                content: "Discover all our video tutorials, hands-on video, and more"
            }
        ]
    })
</script>
