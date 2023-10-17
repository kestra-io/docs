<template>
    <div>
        <DemoHeaders />
        <HomeTestimonials />
    </div>
</template>

<script setup>
useHead({
  meta:[
      {name:'twitter:card',content:'summary-large-image'},
      {name : 'twitter:site',content:'@kaestra_io'},
      {name : 'twitter:title',content:"Ready to See Kestra in Action?"},
      {name:'twitter:description',content:"Connect with one of our Product Specialist to get the best out of our product and its value proposition"},
      {name : 'twitter:image' ,content:"/demo/background.svg"},
      {name : 'twitter:image:alt',content : "Illustration of Kestra's logo with a dark background"}
  ]
})
</script>