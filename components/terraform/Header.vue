<template>
    <div class="hero header row justify-content-center">
        <div class="col-12 col-md-10">
            <div class="row">
                <div class="col-12 col-md-6">
                    <h1>Kestra Terraform Provider</h1>
                    <p>Designed to streamline your experience in deploying and managing Kestra configurations within your existing data architecture.</p>
                    <div>
                        <NuxtLink href="https://github.com/kestra-io/kestra">
                            <button class="btn btn-primary me-3">Get Started</button>
                        </NuxtLink>
                        <NuxtLink href="/docs/terraform">
                            <button class="btn btn-dark">Read the docs</button>
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
</script>

<style scoped lang="scss">
@import "../../assets/styles/variable";
.header {
    background: url('terraform/header/background.svg') no-repeat center;

    @include media-breakpoint-down(md) {
        background-position: right;
    }

    p {
        font-size: $font-size-xl;
    }
}
</style>