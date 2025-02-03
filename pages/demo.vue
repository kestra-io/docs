<template>
    <div>
        <DemoHeaders/>
        <DemoCompanies class="mt-5" />
        <DemoBusinessByUs/>
    </div>
</template>
<script setup>
    const { origin } = useRequestURL()
    useHead({
        meta: [
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'twitter:site', content: '@kestra_io' },
            { name: 'twitter:title', content: "Ready to See Kestra in Action?" },
            {
                name: 'twitter:description',
                content: "Connect with one of our Product Specialist to get the best out of our product and its value proposition"
            },
            { name: 'twitter:image', content: `${origin}/og-image.png` },
            { name: 'twitter:image:alt', content: "Demo Image" },
            { property: 'og:title', content: "Ready to See Kestra in Action?" },
            {
                property: 'og:description',
                content: "Connect with one of our Product Specialist to get the best out of our product and its value proposition"
            },
            { property: 'og:image', content: `${origin}/og-image.png` },
            { property: 'og:image:type', content: "image/svg+xml" },
            { property: 'og:image:alt', content: "Ready to See Kestra in Action?" },
        ]
    })
</script>