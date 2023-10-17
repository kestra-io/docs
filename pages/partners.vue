<template>
    <div>
        <PartnersHeaders />
        <Partners />
        <PartnersIntegratesWith />
        <PartnersBetterTogether />
        <PartnersPerksAndBenefits />
        <PartnersBecomeAPartner />
    </div>
</template>

<script setup>

useHead({
  meta:[
      {name:'twitter:card',content:'summary-large-image'},
      {name : 'twitter:site',content:'@kaestra_io'},
      {name : 'twitter:title',content:"Kestra Partners"},
      {name:'twitter:description',content:"Whether you are building something new, upgrading a legacy stack, or re-platforming, you can trust Kestra and our partner ecosystem to make that journey a success.Discover the team and values behind our mission to empower data-driven organizations worldwide"},
      {name : 'twitter:image' ,content:"/partners/badge-partner.svg"},
      {name : 'twitter:image:alt',content : "Become Kestra partner"}
  ]
})
</script>