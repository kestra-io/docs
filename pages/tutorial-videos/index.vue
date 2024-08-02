<template>
    <div>
        <Head>
            <Title>All Things Kestra in Video</Title>
            <Meta name="description"
                  content="Discover all our video tutorials, hands-on video, and more"/>
        </Head>
        <VideosTutorialsList />
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
            { name: 'twitter:image', content: `${origin}/og-image.png` },
            { name: 'twitter:image:alt', content: "Get in Touch With the Team" },
            { property: 'og:title', content: "All Things Kestra in Video" },
            {
                property: 'og:description',
                content: "Discover all our video tutorials, hands-on video, and more"
            },
            { property: 'og:image', content: `${origin}/og-image.png` },
            { property: 'og:image:type', content: "image/svg+xml" },
            { property: 'og:image:alt', content: "All Things Kestra in Video" },
        ]
    })
</script>
