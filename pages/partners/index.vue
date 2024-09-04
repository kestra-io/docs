<template>
    <div>
        <PartnersHeaders/>
        <NuxtLazyHydrate when-visible>
            <Partners/>
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <PartnersIntegratesWith/>
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <PartnersBetterTogether/>
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <PartnersPerksAndBenefits/>
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <PartnersBecomeAPartner/>
        </NuxtLazyHydrate>
    </div>
</template>

<script setup>
    const { origin } = useRequestURL()
    useHead({
        meta: [
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'twitter:site', content: '@kestra_io' },
            { name: 'twitter:title', content: "Kestra Partners" },
            {
                name: 'twitter:description',
                content: "Whether you are building something new, upgrading a legacy stack, or re-platforming, you can trust Kestra and our partner ecosystem to make that journey a success.Discover the team and values behind our mission to empower data-driven organizations worldwide"
            },
            { name: 'twitter:image', content: `${origin}/og-image.png` },
            { name: 'twitter:image:alt', content: "Kestra Partners" },
            { property: 'og:title', content: "Kestra Partners" },
            {
                property: 'og:description',
                content: "Whether you are building something new, upgrading a legacy stack, or re-platforming, you can trust Kestra and our partner ecosystem to make that journey a success.Discover the team and values behind our mission to empower data-driven organizations worldwide"
            },
            { property: 'og:image', content: `${origin}/og-image.png` },
            { property: 'og:image:type', content: "image/svg+xml" },
            { property: 'og:image:alt', content: "Kestra Partners" },
        ]
    })
</script>