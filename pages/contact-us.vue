<template>
    <div>
        <Head>
            <Title>Get in Touch With the Team</Title>
            <Meta name="description"
                  content="Connect with our team for any questions or inquiries you may have. We're eager to assist you and provide the information you need about Kestra"/>
        </Head>

        <ContactHeader/>
        <CommunitySlack/>
    </div>
</template>
<script setup>
    const { origin } = useRequestURL()
    useHead({
        meta: [
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'twitter:site', content: '@kestra_io' },
            { name: 'twitter:title', content: "Get in Touch With the Team" },
            {
                name: 'twitter:description',
                content: "Connect with our team for any questions or inquiries you may have. We're eager to assist you and provide the information you need about Kestra"
            },
            { name: 'twitter:image', content: `${origin}/og-image.png` },
            { name: 'twitter:image:alt', content: "Get in Touch With the Team" },
            { property: 'og:title', content: "Get in Touch With the Team" },
            {
                property: 'og:description',
              content: "Connect with our team for any questions or inquiries you may have. We're eager to assist you and provide the information you need about Kestra"
            },
            { property: 'og:image', content: `${origin}/og-image.png` },
            { property: 'og:image:type', content: "image/svg+xml" },
            { property: 'og:image:alt', content: "Get in Touch With the Team" },
        ]
    })

</script>

