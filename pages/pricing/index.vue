<template>
    <div class="cont">
        <Head>
            <Title>Compare all Versions of Kestra</Title>
            <Meta name="description"
                content="Choose the right plan for your needs. Start with the Open Source version and scale with the Enterprise Edition of Kestra." />
        </Head>
        <Heading />
        <features />
        <LayoutCompanies />

        <Table />
        <Faq />
        <LayoutFooterContact
            title="Ready to Get Started with Kestra?"
            purpleButtonText="Talk to Us"
            purpleButtonHref="/demo"
        />
    </div>
</template>

<script setup>
import Heading from "../../components/price/Heading.vue"
import Table from "../../components/price/Table.vue"
import Faq from "../../components/price/Faq.vue"

</script>

<style lang="scss" scoped>
@import "../../assets/styles/variable";
.cont{
   background: $black-4 ;
}
:deep(.companies-container) {
    border-top: $container-border;
    border-bottom: $container-border;
    padding-bottom: 3rem;
}
</style>