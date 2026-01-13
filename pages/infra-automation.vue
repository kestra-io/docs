<template>
    <div class="infra">
        <Head>
            <Title>Kestra: Orchestrate Your Entire Infrastructure from One Control Plane</Title>
            <Meta 
                name="description"
                content="Kestra unifies provisioning, configuration, patching, remediation, compliance, and operational workflows into a single orchestration engine" 
            />
        </Head>
        <InfrastructureHero />
        <InfrastructureDeserver />
        <InfrastructureFortune />
        <InfrastructureGovern />
        <InfrastructureTour />
        <InfrastructureOperation />
        <InfrastructureAutomations />
        <InfrastructureLifecycle />
        <InfrastructureConnect />
        <InfrastructureBuilt />
        <InfrastructureReady />
    </div>
</template>

<script setup lang="ts">
    // NOOP
</script>

<style lang="scss" scoped>
    .infra {
        // FIXME: This is only for page level. Plan is to use Mona Sans throughout the website once confirmed.
        font-family: "Mona Sans", sans-serif !important;
        overflow: clip;
        position: relative;

        &::after {
            content: "";
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100vw;
            height: 80px;
            background: rgba(255, 255, 255, 0.06);
            backdrop-filter: blur(2px);
            z-index: 10;
            pointer-events: none;
            -webkit-mask-image: linear-gradient(180deg, transparent 0%, black 100%);
            mask-image: linear-gradient(180deg, transparent 0%, black 100%);
        }
    }
</style>