<template>
    <div class="infra">

        <Head>
            <Title>Kestra: Orchestrate Your Entire Infrastructure from One Control Plane</Title>
            <Meta name="description"
                content="Kestra unifies provisioning, configuration, patching, remediation, compliance, and operational workflows into a single orchestration engine" />
        </Head>
        <InfrastructureHero />
    </div>
</template>

<script setup>
definePageMeta({
    footer: {
        class: {
            'dark-footer': true
        }
    }
})
</script>

<style lang="scss">
@import "../assets/styles/_variable";

.infra {
    font-family: "Mona Sans", sans-serif !important;
}
</style>