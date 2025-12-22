<template>
    <div class="infra">

        <Head>
            <Title>Kestra: Orchestrate Your Entire Infrastructure from One Control Plane</Title>
            <Meta name="description"
                content="Kestra unifies provisioning, configuration, patching, remediation, compliance, and operational workflows into a single orchestration engine" />
        </Head>
        <InfrastructureHero />
        <InfrastructureGovern />
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