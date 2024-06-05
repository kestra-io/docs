<template>
    <div>
        <DemoHeaders/>
        <NuxtLazyHydrate when-visible>
            <EnterpriseBusinessByUs/>
        </NuxtLazyHydrate>
        <HomeTestimonials/>
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
            { name: 'twitter:image', content: `${origin}/demo/background.svg` },
            { name: 'twitter:image:alt', content: "Demo Image" }
        ]
    })
</script>