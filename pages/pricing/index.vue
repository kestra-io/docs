<template>
    <div class="cont">
        <Head>
            <Title>Compare all Versions of Kestra</Title>
            <Meta name="description"
                content="Choose the right plan for your needs. Start with the Open Source version and scale with the Enterprise Edition of Kestra." />
        </Head>
        <Heading />
      
        <Companies />
      
        <Table />
        <Faq />
        <Footer />
    </div>
</template>

<script setup>
import Heading from "../../components/price/Heading.vue"
import Companies from "../../components/price/Companies.vue"
import Footer from "../../components/price/Footer.vue"
import Table from "../../components/price/Table.vue"
import Faq from "../../components/price/Faq.vue"

</script>

<style lang="scss" scoped>
@import "../../assets/styles/variable";
.cont{
   background: $black-4 ;
}
</style>