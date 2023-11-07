<template>
    <div>
        <PartnersHeaders/>
        <Partners/>
        <PartnersIntegratesWith/>
        <PartnersBetterTogether/>
        <PartnersPerksAndBenefits/>
        <PartnersBecomeAPartner/>
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
            { name: 'twitter:image', content: `${origin}/partners/badge-partner.svg` },
            { name: 'twitter:image:alt', content: "Become Kestra partner" }
        ]
    })
</script>